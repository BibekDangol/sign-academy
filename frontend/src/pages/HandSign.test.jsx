import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as tf from '@tensorflow/tfjs';
import * as handpose from '@tensorflow-models/handpose';
import * as fp from 'fingerpose';
import HandSign from './HandSign';

jest.mock('@/lib/utils', () => jest.requireActual('../lib/utils'), { virtual: true });
jest.mock('../components/layout/PageLayout', () => ({ children }) => <>{children}</>);
jest.mock('../utils/drawHand', () => ({ drawHand: jest.fn() }));
jest.mock('@tensorflow/tfjs', () => ({ setBackend: jest.fn(), ready: jest.fn() }));
jest.mock('@tensorflow-models/handpose', () => ({ load: jest.fn() }));
jest.mock('fingerpose', () => ({ ...jest.requireActual('fingerpose'), GestureEstimator: jest.fn() }));
jest.mock('react-webcam', () => {
  const React = require('react');
  return React.forwardRef(function MockWebcam(props, ref) {
    React.useImperativeHandle(ref, () => ({ video: { readyState: 4, videoWidth: 640, videoHeight: 480 } }));
    return <>
      <button onClick={() => props.onUserMedia()}>Connect camera</button>
      <button onClick={() => props.onUserMediaError()}>Deny camera</button>
    </>;
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  tf.setBackend.mockResolvedValue(true);
  tf.ready.mockResolvedValue();
  handpose.load.mockResolvedValue({ estimateHands: jest.fn().mockResolvedValue([]) });
  fp.GestureEstimator.mockImplementation(() => ({ estimate: jest.fn().mockReturnValue({ gestures: [] }) }));
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({ clearRect: jest.fn() });
});

afterEach(() => jest.restoreAllMocks());

const openPractice = () => render(<MemoryRouter><HandSign /></MemoryRouter>);

test('waits for the detector after the camera connects', () => {
  tf.setBackend.mockReturnValue(new Promise(() => {}));
  openPractice();
  fireEvent.click(screen.getByText('Connect camera'));
  expect(screen.getByText('Preparing detector')).toBeTruthy();
  expect(screen.getByText('Setting things up')).toBeTruthy();
});

test('explains camera permission failure', () => {
  tf.setBackend.mockReturnValue(new Promise(() => {}));
  openPractice();
  fireEvent.click(screen.getByText('Deny camera'));
  expect(screen.getByRole('alert').textContent).toContain('Check your browser camera permission');
  expect(screen.getByText('Camera unavailable')).toBeTruthy();
});

test('shows a detector failure instead of a ready status', async () => {
  handpose.load.mockRejectedValue(new Error('Model unavailable'));
  openPractice();
  fireEvent.click(screen.getByText('Connect camera'));
  expect(await screen.findByText('Detector unavailable')).toBeTruthy();
  expect(screen.getByText('Let’s reconnect')).toBeTruthy();
});

test('clears the previous gesture when the hand leaves the frame', async () => {
  const estimateHands = jest.fn().mockResolvedValue([{ landmarks: [[1, 2, 3]] }]);
  handpose.load.mockResolvedValue({ estimateHands });
  fp.GestureEstimator.mockImplementation(() => ({ estimate: () => ({ gestures: [{ name: 'call_me', confidence: 9 }] }) }));
  openPractice();
  fireEvent.click(screen.getByText('Connect camera'));
  expect(await screen.findByText('call me')).toBeTruthy();
  estimateHands.mockResolvedValue([]);
  expect(await screen.findByText('Ready when you are')).toBeTruthy();
  expect(screen.queryByText('call me')).toBeNull();
});
