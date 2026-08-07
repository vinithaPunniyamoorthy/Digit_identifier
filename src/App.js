import React, { useState } from 'react';
import DigitCanvas from './DigitCanvas';
import './App.css';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [probabilities, setProbabilities] = useState(null);

  const handlePrediction = (digit, probs) => {
    setPrediction(digit);
    setProbabilities(probs);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Digit Identifier</h1>
        <p>Draw a digit (0-9) on the canvas below and see the prediction!</p>
        <DigitCanvas onPrediction={handlePrediction} />
        {prediction !== null && (
          <div className="prediction">
            <h2>Predicted Digit: {prediction}</h2>
            <div className="probabilities">
              <h3>Prediction Probabilities:</h3>
              <div className="prob-grid">
                {probabilities && probabilities.map((prob, index) => (
                  <div key={index} className={`prob-item ${index === prediction ? 'predicted' : ''}`}>
                    <span className="digit">{index}</span>
                    <span className="prob">{(prob * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
