export const drawHand = (hand, ctx) => {
    if (!hand || !ctx) return;
  
    // Clear previous drawing
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
    // Loop through each hand landmark and draw a point
    hand[0].landmarks.forEach((landmark, index) => {
      const [x, y, z] = landmark; // Destructure the landmark coordinates
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI); // Draw a small circle at each landmark
      ctx.fillStyle = "red";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.stroke();
    });
  
    // Optionally, connect the landmarks with lines to visualize the hand structure
    const connections = [
      [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
      [0, 5], [5, 6], [6, 7], [7, 8], // Index
      [0, 9], [9, 10], [10, 11], [11, 12], // Middle
      [0, 13], [13, 14], [14, 15], [15, 16], // Ring
      [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
    ];
  
    connections.forEach(([startIdx, endIdx]) => {
      const start = hand[0].landmarks[startIdx];
      const end = hand[0].landmarks[endIdx];
      ctx.beginPath();
      ctx.moveTo(start[0], start[1]);
      ctx.lineTo(end[0], end[1]);
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  };
  