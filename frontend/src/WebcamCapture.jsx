import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as tf from "@tensorflow/tfjs";

const WebcamCapture = () => {
  const webcamRef = useRef(null);
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState("");

  useEffect(() => {
    const loadModel = async () => {
      const loadedModel = await tf.loadLayersModel("/model/model.json");
      setModel(loadedModel);
      console.log("✅ Model Loaded");
    };
    loadModel();
  }, []);

  const captureAndPredict = async () => {
    if (webcamRef.current && model) {
      const video = webcamRef.current.video;
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, 128, 128);
      const imgData = tf.browser.fromPixels(canvas, 1).expandDims(0).div(255.0);

      const preds = model.predict(imgData);
      const predIndex = preds.argMax(1).dataSync()[0];
      const letter = String.fromCharCode(65 + predIndex);

      setPrediction(letter);

      const utterance = new SpeechSynthesisUtterance(letter);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div>
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" width={400} height={400} />
      <br />
      <button onClick={captureAndPredict}>Capture & Predict</button>
      <h2>Predicted Letter: {prediction}</h2>
    </div>
  );
};

export default WebcamCapture;
