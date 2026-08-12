import React, { useRef, useEffect, useState } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import * as tf from '@tensorflow/tfjs';
import Webcam from 'react-webcam';
import { drawHand } from './utilities';
import { createModel, predictSign } from './sign_detection_model';
import Navbar from './Navbar';
import './Contact.css';  // Changed to Contact.css

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
    <div className="contact-container">
      <Navbar />
      <div className="main-content">
        <h2 className="title">Real-Time Hand Sign Detection</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="webcam-container">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Initializing models...</p>
            </div>
          ) : (
            <>
              <Webcam
                ref={webcamRef}
                className="webcam-feed"
                mirrored={true}
                screenshotFormat="image/jpeg"
              />
              <canvas
                ref={canvasRef}
                className="landmark-canvas"
              />
            </>
          )}
        </div>

        {prediction && (
          <div className="prediction-banner">
            Detected Sign: <span className="sign-text">{prediction}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;