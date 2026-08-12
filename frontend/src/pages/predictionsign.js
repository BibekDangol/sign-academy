export const predictSign = (detectedLandmarks, dataset) => {
    let closestSign = "Unknown";
    let minDistance = Infinity;
  
    dataset.forEach(sign => {
      let distance = 0;
      sign.landmarks.forEach((point, index) => {
        if (index < detectedLandmarks.length) {
          const dx = detectedLandmarks[index][0] - point[0];
          const dy = detectedLandmarks[index][1] - point[1];
          distance += Math.sqrt(dx * dx + dy * dy);
        }
      });
  
      if (distance < minDistance) {
        minDistance = distance;
        closestSign = sign.label;
      }
    });
  
    return closestSign;
  };
  