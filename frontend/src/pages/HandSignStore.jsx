import React, { useRef, useState, useEffect } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import * as fp from 'fingerpose';
import Handsigns from './gesturestore';  
import Navbar from './Navbar';           
import Footer from './footer1';           
import './HandSignStore.css';

const HandSignStore = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [letters, setLetters] = useState([]);
  const lastAddedRef = useRef({ letter: null, time: 0 });

  useEffect(() => {
    let net = null;
    let animationFrameId = null;
    const gestureEstimator = new fp.GestureEstimator(Object.values(Handsigns));

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing webcam: ", err);
      }
    };

    const runDetection = async () => {
      if (!net || !videoRef.current || !canvasRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (video.readyState !== 4) {
        requestAnimationFrame(runDetection);
        return;
      }

      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;

      if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
        canvas.width = videoWidth;
        canvas.height = videoHeight;
      }

      const predictions = await net.estimateHands(video);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (predictions.length > 0) {
        const landmarks = predictions[0].landmarks;

        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 4;
        ctx.fillStyle = 'red';

        const fingers = [
          [0, 1, 2, 3, 4],
          [0, 5, 6, 7, 8],
          [0, 9, 10, 11, 12],
          [0, 13, 14, 15, 16],
          [0, 17, 18, 19, 20]
        ];

        fingers.forEach(path => {
          for (let i = 0; i < path.length - 1; i++) {
            const [x0, y0] = landmarks[path[i]];
            const [x1, y1] = landmarks[path[i + 1]];
            ctx.beginPath();
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
          }
        });

        for (let i = 0; i < landmarks.length; i++) {
          const [x, y] = landmarks[i];
          ctx.beginPath();
          ctx.arc(x, y, 6, 0, 2 * Math.PI);
          ctx.fill();
        }

        const estimatedGestures = gestureEstimator.estimate(landmarks, 7.5);
        if (estimatedGestures.gestures && estimatedGestures.gestures.length > 0) {
          const result = estimatedGestures.gestures.reduce((p, c) => (p.score > c.score ? p : c));
          const letter = result.name;
          const now = Date.now();
          const { letter: lastLetter, time: lastTime } = lastAddedRef.current;

          if (letter && (now - lastTime > 4000)) {
            setLetters(prev => [...prev, letter]);
            lastAddedRef.current = { letter: letter, time: now };
          }
        }
      }

      animationFrameId = requestAnimationFrame(runDetection);
    };

    handpose.load().then(loadedNet => {
      net = loadedNet;
      startVideo();
    });

    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', () => {
        runDetection();
      });
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const handleBackspace = () => {
    setLetters(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setLetters([]);
  };

  return (
    <div className="hand-sign-store">
      <Navbar />

      {/* Video and Chart Side-by-side */}
      <div className="video-chart-container">
        {/* Left: Video */}
        <div className="video-container">
          <div className="video-inner">
            <video ref={videoRef} className="video-feed" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="video-canvas" />
          </div>
        </div>

        {/* Right: Static Chart Image */}
        <div className="side-container">
          <img 
            src="/images/sign image.png" 
            alt="Hand Sign Chart" 
            className="sign-chart" 
          />
        </div>
      </div>

      {/* Letters and Controls */}
      <div className="text-container">
        <div className="letters-display">
          {letters.join(' ')}
        </div>
        <div className="controls">
          <button className="btn backspace-btn" onClick={handleBackspace}>Backspace</button>
          <button className="btn clear-btn" onClick={handleClear}>Clear</button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HandSignStore;
