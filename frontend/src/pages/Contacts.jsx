import React, { useRef, useEffect, useState } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';
import { drawHand } from './utilities';
import { createModel, predictSign } from './sign_detection_model';
import Navbar from './Navbar';

const Contact = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [error, setError] = useState('');

  // Initialize TensorFlow.js and load models
  useEffect(() => {
    const initializeModels = async () => {
      try {
        await tf.setBackend('webgl');
        await tf.ready();
        
        const handModel = await handpose.load();
        const signModel = createModel();
        
        setModel({ hand: handModel, sign: signModel });
        setLoading(false);
      } catch (err) {
        setError('Failed to initialize models. Please check your webcam access and internet connection.');
        console.error(err);
      }
    };

    initializeModels();

    return () => {
      cancelAnimationFrame(animationRef.current);
      tf.disposeVariables();
    };
  }, []);

  // Hand detection loop
  useEffect(() => {
    const detectHand = async () => {
      try {
        if (webcamRef.current?.video?.readyState !== 4 || !model) return;

        const video = webcamRef.current.video;
        const { videoWidth, videoHeight } = video;
        
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
        
        const hands = await model.hand.estimateHands(video, true);
        const ctx = canvasRef.current.getContext('2d');
        
        ctx.clearRect(0, 0, videoWidth, videoHeight);
        
        if (hands.length > 0) {
          drawHand(hands[0].landmarks, ctx);
          const sign = await predictSign(model.sign, hands[0].landmarks);
          setPrediction(sign);
        }

      } catch (err) {
        console.error('Detection error:', err);
      }
      
      animationRef.current = requestAnimationFrame(detectHand);
    };

    if (!loading && !error) {
      animationRef.current = requestAnimationFrame(detectHand);
    }

    return () => cancelAnimationFrame(animationRef.current);
  }, [loading, model, error]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5]">
      <Navbar />
      <div className="main-content">
        <h2 className="title">Real-Time Hand Sign Detection</h2>
        
        {error && <div className="text-[#e74c3c] p-4 bg-[#fdeded] rounded mb-4">{error}</div>}
        
        <div className="relative w-[calc(100%-2rem)] max-w-[640px] mx-auto mb-8">
          {loading ? (
            <div className="flex flex-col items-center gap-4 p-8">
              <div className="w-10 h-10 border-4 border-[#f3f3f3] border-t-[#3498db] rounded-full animate-spin"></div>
              <p>Initializing models...</p>
            </div>
          ) : (
            <>
              <Webcam
                ref={webcamRef}
                className="!w-full !h-auto rounded-lg"
                mirrored={true}
                screenshotFormat="image/jpeg"
              />
              <canvas
                ref={canvasRef}
                className="!w-full !h-auto rounded-lg absolute top-0 left-0 pointer-events-none"
              />
            </>
          )}
        </div>

        {prediction && (
          <div className="prediction-banner">
            Detected Sign: <span className="text-[#3498db] font-bold">{prediction}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;