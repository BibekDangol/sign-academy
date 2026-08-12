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

import "./HandSign.css";

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
    <div className="hand-sign-page">
      <Navbar />

      <div className="hand-sign-container">
        <Typography variant="h4" gutterBottom className="title-text">
          Hand Gesture Recognition
        </Typography>

        <div className="video-wrapper">
          <Webcam
            ref={webcamRef}
            className="webcam-video"
            mirrored
          />
          <canvas
            ref={canvasRef}
            className="webcam-canvas"
          />
        </div>

        {recognizedGesture && (
          <Typography className="gesture-label">
            🖐 Detected Gesture: <strong>{recognizedGesture}</strong>
          </Typography>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/handsignstore")}
          className="store-button"
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
