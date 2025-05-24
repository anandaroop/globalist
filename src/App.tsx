import { useState } from "react";
import { Globe } from "./Globe";
import "./App.css";

function App() {
  const [centralMeridian, setCentralMeridian] = useState(0);

  const handleMeridianChange = (value: number) => {
    setCentralMeridian(value);
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <Globe centralMeridian={centralMeridian} />
      </div>
      <div className="settings-panel">
        <h3>Settings</h3>
        <div className="setting-group">
          <h4>Central meridian</h4>
          <div className="meridian-controls">
            <input
              type="number"
              value={centralMeridian}
              onChange={(e) => handleMeridianChange(Number(e.target.value))}
              min="-180"
              max="180"
              step="1"
              className="meridian-input"
            />
            <input
              type="range"
              value={centralMeridian}
              onChange={(e) => handleMeridianChange(Number(e.target.value))}
              min="-180"
              max="180"
              step="1"
              className="meridian-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
