import PageLayout from '../components/layout/PageLayout';
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as handpose from '@tensorflow-models/handpose';
import * as fp from 'fingerpose';
import Handsigns from './gesturestore';
import { Button } from '../components/ui/button';
import { FaCamera, FaFont, FaBookOpen, FaExternalLinkAlt, FaBackspace, FaTrashAlt } from 'react-icons/fa';
import './HandSign.css';
import './HandSignStore.css';

const chartUrl = `${process.env.PUBLIC_URL}/images/sign%20image.png`;

export default function HandSignStore() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [letters, setLetters] = useState([]);
  const [currentLetter, setCurrentLetter] = useState(null);
  const [status, setStatus] = useState('loading');
  const [videoRatio, setVideoRatio] = useState(4 / 3);
  const lastAddedRef = useRef(0);

  useEffect(() => {
    let active = true;
    let timer;
    let stream;
    const estimator = new fp.GestureEstimator(Object.values(Handsigns));

    const detect = async net => {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video?.readyState === 4 && canvas) {
          const predictions = await net.estimateHands(video);
          if (!active) return;
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          let letter = null;
          if (predictions[0]?.landmarks?.length) {
            const landmarks = predictions[0].landmarks;
            ctx.strokeStyle = '#8ee0c2';
            ctx.lineWidth = 3;
            ctx.fillStyle = '#f2c981';
            const fingers = [[0, 1, 2, 3, 4], [0, 5, 6, 7, 8], [0, 9, 10, 11, 12], [0, 13, 14, 15, 16], [0, 17, 18, 19, 20]];
            fingers.forEach(path => {
              for (let index = 0; index < path.length - 1; index++) {
                ctx.beginPath();
                ctx.moveTo(...landmarks[path[index]].slice(0, 2));
                ctx.lineTo(...landmarks[path[index + 1]].slice(0, 2));
                ctx.stroke();
              }
            });
            landmarks.forEach(([x, y]) => {
              ctx.beginPath();
              ctx.arc(x, y, 5, 0, 2 * Math.PI);
              ctx.fill();
            });
            const estimated = estimator.estimate(landmarks, 7.5);
            if (estimated.gestures?.length) {
              letter = estimated.gestures.reduce((best, gesture) => best.score > gesture.score ? best : gesture).name;
            }
          }
          setCurrentLetter(letter);
          const now = Date.now();
          if (letter && now - lastAddedRef.current > 4000) {
            setLetters(previous => [...previous, letter]);
            lastAddedRef.current = now;
          }
        }
        if (active) timer = setTimeout(() => detect(net), 150);
      } catch {
        if (active) { setStatus('detector-error'); setCurrentLetter(null); }
      }
    };

    const start = async () => {
      let net;
      try {
        net = await handpose.load();
      } catch {
        if (active) setStatus('detector-error');
        return;
      }
      if (!active) return;
      setStatus('camera-pending');
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: 'user' }, audio: false });
        if (!active) { stream.getTracks().forEach(track => track.stop()); return; }
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      } catch {
        if (active) setStatus('camera-error');
        return;
      }
      if (!active) return;
      setStatus('ready');
      detect(net);
    };
    start();
    return () => {
      active = false;
      clearTimeout(timer);
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const failed = status.endsWith('error');
  const statusLabel = status === 'ready' ? 'Ready to practise' : status === 'loading' ? 'Preparing detector'
    : status === 'camera-pending' ? 'Waiting for camera' : status === 'camera-error' ? 'Camera unavailable' : 'Detector unavailable';

  return <PageLayout>
    <main className="handsign-page alphabet-page">
      <div className="handsign-container">
        <header className="handsign-heading">
          <div><p className="handsign-eyebrow">Letter by letter</p><h1>Turn your signs into letters.</h1><p>Use the alphabet chart as a guide, practise a hand shape, and build your own letter sequence.</p></div>
          <span className="handsign-mode"><FaFont aria-hidden="true" /> Alphabet practice</span>
        </header>

        <div className="handsign-workspace alphabet-workspace">
          <div className="alphabet-practice-column">
            <section className="handsign-camera-panel" aria-labelledby="alphabet-camera-title">
              <div className="handsign-camera-heading">
                <h2 id="alphabet-camera-title"><FaCamera aria-hidden="true" /> Your camera</h2>
                <span className={`handsign-status ${status === 'ready' ? 'is-ready' : ''} ${failed ? 'is-error' : ''}`}><span aria-hidden="true" />{statusLabel}</span>
              </div>
              <div className="handsign-camera alphabet-camera" style={{ aspectRatio: videoRatio }}>
                <video ref={videoRef} autoPlay muted playsInline onLoadedMetadata={event => {
                  const { videoWidth, videoHeight } = event.target;
                  if (videoWidth && videoHeight) setVideoRatio(videoWidth / videoHeight);
                }} />
                <canvas ref={canvasRef} className="alphabet-landmarks" aria-hidden="true" />
                {status !== 'ready' && <div className="handsign-camera-placeholder" role={failed ? 'alert' : 'status'}>
                  <FaCamera aria-hidden="true" />
                  <h3>{status === 'camera-error' ? 'Let’s connect your camera' : status === 'detector-error' ? 'The detector needs a moment' : 'Getting ready to practise'}</h3>
                  <p>{status === 'camera-error' ? 'Check your browser camera permission and close any other app using the camera. Then reload to try again.' : status === 'detector-error' ? 'Check your connection and reload this page to try loading the detector again.' : status === 'loading' ? 'Loading the letter detector. Your camera will open next.' : 'Allow camera access in your browser to begin.'}</p>
                </div>}
              </div>
              <div className="alphabet-live-result" role="status" aria-live="polite" aria-atomic="true">
                <span className="alphabet-live-letter">{status === 'ready' && currentLetter ? currentLetter : '—'}</span>
                <div><strong>{status === 'ready' && currentLetter ? 'Letter recognised' : 'Your next letter'}</strong><p>{status === 'ready' ? 'Hold one hand clearly in the frame.' : 'Connect your camera and detector to begin.'}</p></div>
              </div>
            </section>

            <section className="alphabet-output" aria-labelledby="letters-title">
              <div className="alphabet-output-heading"><div><p className="handsign-eyebrow">Your practice so far</p><h2 id="letters-title">Your letters</h2></div><span className="alphabet-letter-count">{letters.length} {letters.length === 1 ? 'letter' : 'letters'}</span></div>
              <div className="alphabet-letter-tray" role="status" aria-live="polite" aria-atomic="true" aria-label="Recognised letter sequence">
                {letters.length ? letters.map((letter, index) => <span className="alphabet-letter-tile" key={index}>{letter}</span>) : <p>Recognised letters will appear here. Try your first hand shape.</p>}
              </div>
              <div className="alphabet-output-footer"><p>Letters are added automatically, up to once every four seconds.</p><div className="alphabet-controls">
                <Button variant="outline" disabled={!letters.length} className="alphabet-backspace" onClick={() => setLetters(previous => previous.slice(0, -1))}><FaBackspace aria-hidden="true" /> Backspace</Button>
                <Button variant="ghost" disabled={!letters.length} className="alphabet-clear" onClick={() => setLetters([])}><FaTrashAlt aria-hidden="true" /> Clear all</Button>
              </div></div>
            </section>
          </div>

          <aside className="alphabet-reference-column" aria-label="Alphabet reference and guidance">
            <section className="alphabet-reference" aria-labelledby="reference-title">
              <div className="alphabet-reference-heading"><p className="handsign-eyebrow">A little guidance</p><h2 id="reference-title"><FaBookOpen aria-hidden="true" /> ASL alphabet reference</h2><p>Compare your hand shape with the chart as you practise.</p></div>
              <a className="alphabet-chart-link" href={chartUrl} target="_blank" rel="noopener noreferrer" aria-label="Open the ASL alphabet chart in a new tab"><img src={chartUrl} alt="American Sign Language fingerspelling chart showing hand shapes for A to Z" /></a>
              <a className="alphabet-expand" href={chartUrl} target="_blank" rel="noopener noreferrer">Open full-size chart <FaExternalLinkAlt aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
            </section>
            <section className="handsign-tips alphabet-tips" aria-labelledby="alphabet-tip-title"><h2 id="alphabet-tip-title">Take your time with each sign</h2><p>Keep your palm and fingertips visible in good lighting. Use Backspace to remove the last letter, or Clear all to start fresh.</p></section>
          </aside>
        </div>
        <div className="alphabet-other-practice"><p>Want to try everyday hand gestures?</p><Link to="/handsign">Explore gesture practice →</Link></div>
      </div>
    </main>
  </PageLayout>;
}
