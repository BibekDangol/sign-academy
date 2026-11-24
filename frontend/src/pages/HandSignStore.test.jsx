import React from 'react';
import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as handpose from '@tensorflow-models/handpose';
import * as fp from 'fingerpose';
import HandSignStore from './HandSignStore';

jest.mock('@/lib/utils', () => jest.requireActual('../lib/utils'), { virtual: true });
jest.mock('../components/layout/PageLayout', () => ({ children }) => <>{children}</>);
jest.mock('@tensorflow-models/handpose', () => ({ load: jest.fn() }));
jest.mock('fingerpose', () => ({ ...jest.requireActual('fingerpose'), GestureEstimator: jest.fn() }));

let stopTrack;
let getUserMedia;
let estimateHands;
let estimate;

beforeEach(() => {
  jest.clearAllMocks();
  stopTrack = jest.fn();
  getUserMedia = jest.fn().mockResolvedValue({ getTracks: () => [{ stop: stopTrack }] });
  Object.defineProperty(navigator, 'mediaDevices', { configurable: true, value: { getUserMedia } });
  jest.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  jest.spyOn(HTMLMediaElement.prototype, 'readyState', 'get').mockReturnValue(4);
  jest.spyOn(HTMLVideoElement.prototype, 'videoWidth', 'get').mockReturnValue(640);
  jest.spyOn(HTMLVideoElement.prototype, 'videoHeight', 'get').mockReturnValue(480);
  jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
    clearRect: jest.fn(), beginPath: jest.fn(), moveTo: jest.fn(), lineTo: jest.fn(),
    stroke: jest.fn(), arc: jest.fn(), fill: jest.fn(),
  });
  estimateHands = jest.fn().mockResolvedValue([{ landmarks: Array.from({ length: 21 }, () => [1, 2, 3]) }]);
  handpose.load.mockResolvedValue({ estimateHands });
  estimate = jest.fn().mockReturnValue({ gestures: [{ name: 'A', score: 9 }] });
  fp.GestureEstimator.mockImplementation(() => ({ estimate }));
});

afterEach(() => jest.restoreAllMocks());
const openPractice = () => render(<MemoryRouter><HandSignStore /></MemoryRouter>);
const letterTray = () => screen.getByRole('status', { name: 'Recognised letter sequence' });

test('captures a letter and allows Backspace and Clear all', async () => {
  openPractice();
  await waitFor(() => expect(within(letterTray()).getByText('A')).toBeTruthy());
  fireEvent.click(screen.getByRole('button', { name: 'Backspace' }));
  expect(within(letterTray()).queryByText('A')).toBeNull();
  expect(screen.getByRole('button', { name: 'Clear all' }).disabled).toBe(true);
  jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 5000);
  await waitFor(() => expect(within(letterTray()).getByText('A')).toBeTruthy());
  fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
  expect(within(letterTray()).queryByText('A')).toBeNull();
});

test('does not append again inside the four second capture interval', async () => {
  jest.spyOn(Date, 'now').mockReturnValue(10000);
  openPractice();
  await waitFor(() => expect(within(letterTray()).getByText('A')).toBeTruthy());
  const firstCalls = estimateHands.mock.calls.length;
  estimate.mockReturnValue({ gestures: [{ name: 'B', score: 9 }] });
  await waitFor(() => expect(estimateHands.mock.calls.length).toBeGreaterThan(firstCalls));
  expect(within(letterTray()).queryByText('B')).toBeNull();
  Date.now.mockReturnValue(15001);
  await waitFor(() => expect(within(letterTray()).getByText('B')).toBeTruthy());
});

test('explains camera permission failure', async () => {
  getUserMedia.mockRejectedValue(new Error('Permission denied'));
  openPractice();
  expect(await screen.findByText('Camera unavailable')).toBeTruthy();
  expect(screen.getByRole('alert').textContent).toContain('Check your browser camera permission');
});

test('stops a camera stream that resolves after leaving the page', async () => {
  let resolveStream;
  getUserMedia.mockReturnValue(new Promise(resolve => { resolveStream = resolve; }));
  const view = openPractice();
  await waitFor(() => expect(getUserMedia).toHaveBeenCalledTimes(1));
  view.unmount();
  await act(async () => resolveStream({ getTracks: () => [{ stop: stopTrack }] }));
  expect(stopTrack).toHaveBeenCalledTimes(1);
  expect(estimateHands).not.toHaveBeenCalled();
});
