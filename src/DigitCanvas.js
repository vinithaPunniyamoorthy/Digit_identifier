import React, { useRef, useEffect, useState } from 'react';

const DigitCanvas = ({ onPrediction }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [model, setModel] = useState(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const tf = await import('@tensorflow/tfjs');
        const model = await tf.loadLayersModel('/model/model.json');
        setModel(model);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };
    loadModel();
  }, []);

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    predictDigit();
  };

  const predictDigit = async () => {
    if (!model) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, 280, 280);

    // Preprocess the image
    const tf = await import('@tensorflow/tfjs');
    let tensor = tf.browser.fromPixels(imageData, 1);
    tensor = tf.image.resizeBilinear(tensor, [28, 28]);
    tensor = tensor.div(255.0);
    tensor = tensor.expandDims(0);

    const prediction = model.predict(tensor);
    const predictedClass = prediction.argMax(1).dataSync()[0];
    const probabilities = prediction.dataSync();

    onPrediction(predictedClass, probabilities);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onPrediction(null);
  };

  const drawSample = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw a sample digit "5"
    ctx.beginPath();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw the number 5
    ctx.moveTo(70, 50);
    ctx.lineTo(50, 50);
    ctx.lineTo(50, 100);
    ctx.lineTo(120, 100);
    ctx.lineTo(120, 150);
    ctx.lineTo(90, 150);
    ctx.lineTo(70, 120);
    ctx.lineTo(50, 120);
    ctx.stroke();

    // Trigger prediction
    predictDigit();
  };

  return (
    <div className="canvas-container">
      <canvas
        ref={canvasRef}
        width={280}
        height={280}
        style={{ border: '2px solid #000', cursor: 'crosshair' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <br />
      <button onClick={drawSample}>Sample</button>
      <button onClick={clearCanvas}>Clear</button>
    </div>
  );
};

export default DigitCanvas;
