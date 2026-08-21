import React, { useRef, useState, useEffect } from "react";
import * as fp from "fingerpose";
import * as handpose from "@tensorflow-models/handpose";
import * as tf from "@tensorflow/tfjs";
import gestures from "../gestures";
import Webcam from "react-webcam";
import { drawHand } from "../utils/drawHand";
import Navbar from './Navbar';
import Footer from './footer1'; 
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography'; 

const HandSign = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [recognizedGesture, setRecognizedGesture] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId;

    const runHandpose = async () => {
      await tf.setBackend("webgl");
      const net = await handpose.load();

      intervalId = setInterval(() => detect(net), 150);
    };

    const detect = async (net) => {
      if (
        webcamRef.current &&
        webcamRef.current.video.readyState === 4
      ) {
        const video = webcamRef.current.video;
        const hand = await net.estimateHands(video);

        if (hand.length > 0) {
          const landmarks = hand[0].landmarks;
          if (landmarks?.length) {
            const gestureEstimator = new fp.GestureEstimator(Object.values(gestures));
            const estimatedGestures = await gestureEstimator.estimate(landmarks, 8.0);

            if (estimatedGestures.gestures.length > 0) {
              const bestGesture = estimatedGestures.gestures.reduce((prev, curr) =>
                prev.confidence > curr.confidence ? prev : curr
              );
              setRecognizedGesture(bestGesture.name);
            }
          }

          const ctx = canvasRef.current.getContext("2d");

          canvasRef.current.width = video.videoWidth;
          canvasRef.current.height = video.videoHeight;

          drawHand(hand, ctx);
        }
      }
    };

    runHandpose();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="bg-[#f0f2f5] min-h-screen font-['Segoe_UI',Tahoma,Geneva,Verdana,sans-serif]">
      <Navbar />

      <div className="flex flex-col items-center p-4 md:p-8">
        <Typography variant="h4" gutterBottom className="text-2xl md:text-[2rem] font-semibold text-[#333] mb-6 text-center">
          Hand Gesture Recognition
        </Typography>

        <div className="relative w-full max-w-[640px] aspect-[4/3] mb-4 rounded-[10px] overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.2)] border-[5px] border-solid border-[rgb(13,13,13)]">
          <Webcam
            ref={webcamRef}
            className="w-full h-full object-cover -scale-x-100"
            mirrored
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full pointer-events-none -scale-x-100 z-[2]"
          />
        </div>

        {recognizedGesture && (
          <Typography className="text-[1.4rem] font-medium text-[#0d47a1] mt-4 bg-[#e3f2fd] py-2 px-4 rounded-lg">
            🖐 Detected Gesture: <strong>{recognizedGesture}</strong>
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/handsignstore")}
          className="mt-6 font-bold bg-[#1976d2] text-white py-[0.6rem] px-6 rounded-md uppercase tracking-[1px] transition-colors duration-300 hover:bg-[#115293]"
          sx={{ marginTop: '20px' }}
        >
          Go to Hand Gesture Store
        </Button>
      </div>

      <Footer /> 
    </div>
  );
};

export default HandSign;
