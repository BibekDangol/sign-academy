import React, { useRef, useState, useEffect } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import * as fp from 'fingerpose';
import Handsigns from './gesturestore';  
import Navbar from './Navbar';           
import Footer from './footer1';
import { Button } from "@/components/ui/button";           

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
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Video and Chart Side-by-side */}
      <div className="flex flex-col md:flex-row justify-center items-stretch md:items-start gap-[30px] mt-5 px-4 md:px-0">
        {/* Left: Video */}
        <div className="flex-grow flex justify-center items-center bg-[#f8f8f8] p-5 border-[5px] border-solid border-[rgb(13,13,13)] rounded-[10px]">
          <div className="relative w-full max-w-[640px] aspect-[4/3]">
            <video ref={videoRef} className="w-full h-full border-[5px] border-solid border-[rgb(13,13,13)] rounded-[10px] object-cover" autoPlay muted playsInline />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
          </div>
        </div>

        {/* Right: Static Chart Image */}
        <div className="bg-[#f8f8f8] p-5 border-[5px] border-solid border-[rgb(13,13,13)] rounded-[10px] flex justify-center items-center">
          <img 
            src="/images/sign image.png" 
            alt="Hand Sign Chart" 
            className="w-full max-w-[400px] h-auto rounded-[10px]" 
          />
        </div>
      </div>

      {/* Letters and Controls */}
      <div className="my-5 mx-auto text-center">
        <div className="text-2xl mb-[10px] font-bold">
          {letters.join(' ')}
        </div>
        <div className="flex flex-wrap justify-center gap-[10px]">
          <Button className="px-5 py-[10px] text-base border-none rounded-[5px] bg-[#007bff] text-white cursor-pointer hover:bg-[#0056b3] backspace-btn" onClick={handleBackspace}>Backspace</Button>
          <Button className="px-5 py-[10px] text-base border-none rounded-[5px] bg-[#007bff] text-white cursor-pointer hover:bg-[#0056b3] clear-btn" onClick={handleClear}>Clear</Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HandSignStore;
