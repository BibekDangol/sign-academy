import PageLayout from '../components/layout/PageLayout';
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as fp from 'fingerpose';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';
import gestures from '../gestures';
import Webcam from 'react-webcam';
import { drawHand } from '../utils/drawHand';
import { Button } from '../components/ui/button';
import { FaArrowRight, FaCamera, FaHandPaper, FaLightbulb } from 'react-icons/fa';
import './HandSign.css';

const practiceTips = [
  { title: 'Find good lighting', text: 'Face a light source so your fingers and palm are clearly visible.' },
  { title: 'Keep one hand in view', text: 'Leave some space around your hand and keep it inside the camera frame.' },
  { title: 'Hold your gesture steady', text: 'Pause briefly to give the detector time to recognise the hand shape.' },
];

export default function HandSign() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [recognizedGesture, setRecognizedGesture] = useState(null);
  const [modelStatus, setModelStatus] = useState('loading');
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [videoRatio, setVideoRatio] = useState(4 / 3);

  useEffect(() => {
    let active = true;
    let timer;
    const estimator = new fp.GestureEstimator(Object.values(gestures));

    const detect = async net => {
      try {
        const video = webcamRef.current?.video;
        const canvas = canvasRef.current;
        if (video?.readyState === 4 && canvas) {
          const hands = await net.estimateHands(video);
          if (!active) return;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          let recognized = null;
          if (hands[0]?.landmarks?.length) {
            const result = await estimator.estimate(hands[0].landmarks, 8.0);
            if (!active) return;
            if (result.gestures.length) {
              recognized = result.gestures.reduce((best, gesture) => best.confidence > gesture.confidence ? best : gesture).name;
            }
            drawHand(hands, ctx);
          }
          setRecognizedGesture(recognized);
        }
        if (active) timer = setTimeout(() => detect(net), 150);
      } catch {
        if (active) {
          setModelStatus('error');
          setRecognizedGesture(null);
        }
      }
    };

    const start = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        if (!active) return;
        const net = await handpose.load();
        if (!active) return;
        setModelStatus('ready');
        detect(net);
      } catch {
        if (active) setModelStatus('error');
      }
    };
    start();
    return () => { active = false; clearTimeout(timer); };
  }, []);

  const ready = cameraReady && !cameraError && modelStatus === 'ready';
  const failed = cameraError || modelStatus === 'error';
  const status = cameraError ? 'Camera unavailable' : modelStatus === 'error' ? 'Detector unavailable'
    : !cameraReady ? 'Waiting for camera' : modelStatus === 'loading' ? 'Preparing detector' : 'Ready to practise';
  const gestureLabel = recognizedGesture?.replace(/_/g, ' ');

  return <PageLayout>
    <main className="handsign-page">
      <div className="handsign-container">
        <header className="handsign-heading">
          <div>
            <p className="handsign-eyebrow">Your practice space</p>
            <h1>Make a sign. See it recognised.</h1>
            <p>Try a supported hand gesture in front of your camera and watch the detector respond.</p>
          </div>
          <span className="handsign-mode"><FaHandPaper aria-hidden="true" /> Gesture practice</span>
        </header>

        <div className="handsign-workspace">
          <section className="handsign-camera-panel" aria-labelledby="camera-title">
            <div className="handsign-camera-heading">
              <h2 id="camera-title"><FaCamera aria-hidden="true" /> Your camera</h2>
              <span className={`handsign-status ${ready ? 'is-ready' : ''} ${failed ? 'is-error' : ''}`}>
                <span aria-hidden="true" />{status}
              </span>
            </div>
            <div className="handsign-camera" style={{ aspectRatio: videoRatio }}>
              <Webcam ref={webcamRef} audio={false} mirrored playsInline
                videoConstraints={{ width: 640, height: 480, facingMode: 'user' }}
                onUserMedia={() => { setCameraReady(true); setCameraError(false); }}
                onUserMediaError={() => { setCameraReady(false); setCameraError(true); setRecognizedGesture(null); }}
                onLoadedMetadata={event => {
                  const { videoWidth, videoHeight } = event.target;
                  if (videoWidth && videoHeight) setVideoRatio(videoWidth / videoHeight);
                }} />
              <canvas ref={canvasRef} className="handsign-landmarks" aria-hidden="true" />
              {!cameraReady && <div className="handsign-camera-placeholder" role={cameraError ? 'alert' : 'status'}>
                <FaCamera aria-hidden="true" />
                <h3>{cameraError ? 'Let’s get your camera connected' : 'Getting your camera ready'}</h3>
                <p>{cameraError ? 'Check your browser camera permission and make sure another app is not using it. Then reload this page.' : 'Allow camera access in your browser to start practising.'}</p>
              </div>}
            </div>
            <div className="handsign-camera-caption"><span className="handsign-caption-dot" aria-hidden="true" /><p>Keep your palm and fingertips visible. One hand at a time works best.</p></div>
          </section>

          <aside className="handsign-sidebar" aria-label="Practice feedback and tips">
            <section className={`handsign-result ${ready && recognizedGesture ? 'has-result' : ''}`} aria-labelledby="result-title">
              <p className="handsign-eyebrow">Recognition</p>
              <h2 id="result-title">Your gesture</h2>
              <div className="handsign-result-symbol" aria-hidden="true"><FaHandPaper /></div>
              <div className="handsign-result-output" role="status" aria-live="polite" aria-atomic="true">
                <strong>{failed ? 'Let’s reconnect' : !ready ? 'Setting things up' : gestureLabel || 'Ready when you are'}</strong>
                <p>{cameraError ? 'Enable your camera to see a result here.' : modelStatus === 'error' ? 'The detector could not start. Check your connection and reload to try again.' : !ready ? 'Your result will appear once the camera and detector are ready.' : recognizedGesture ? 'Gesture recognised. Try another hand shape to keep practising.' : 'Show a supported gesture and hold it steady for a moment.'}</p>
              </div>
            </section>

            <section className="handsign-tips" aria-labelledby="tips-title">
              <h2 id="tips-title"><FaLightbulb aria-hidden="true" /> A few helpful tips</h2>
              <ol>{practiceTips.map((tip, index) => <li key={tip.title}>
                <span className="handsign-tip-number" aria-hidden="true">{index + 1}</span>
                <div><h3>{tip.title}</h3><p>{tip.text}</p></div>
              </li>)}</ol>
            </section>
          </aside>
        </div>

        <section className="handsign-next" aria-labelledby="alphabet-title">
          <div><p className="handsign-eyebrow">Keep building your skills</p><h2 id="alphabet-title">Ready to practise the alphabet?</h2><p>Open alphabet practice to recognise letters and build a sequence of signs.</p></div>
          <Button asChild className="handsign-alphabet-link"><Link to="/handsignstore">Try alphabet practice <FaArrowRight aria-hidden="true" /></Link></Button>
        </section>
      </div>
    </main>
  </PageLayout>;
}
