import * as tf from '@tensorflow/tfjs';

// 🎯 Create a model that expects 63 input features
export const createModel = () => {
  const model = tf.sequential();
  
  model.add(tf.layers.dense({ units: 64, inputShape: [63], activation: 'relu' }));
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 10, activation: 'softmax' })); // 10 possible signs

  model.compile({ optimizer: 'adam', loss: 'categoricalCrossentropy' });
  
  return model;
};

// 🎯 Predict sign from hand landmarks
export const predictSign = async (model, landmarks) => {
  if (!model || !landmarks) return 'Unknown';

  // Convert landmarks to correct shape: [1, 63]
  const input = tf.tensor(landmarks.flat()).reshape([1, 63]);

  const prediction = model.predict(input);
  const signIndex = prediction.argMax(1).dataSync()[0];

  // 🎯 Define 10 hand signs
  const signs = ['Hello', 'Yes', 'No', 'Thank You', 'Please', 'Love', 'Help', 'Stop', 'Goodbye', 'Peace'];

  return signs[signIndex] || 'Unknown';
};
