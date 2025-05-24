import { useState } from "react";
import { Globe } from "./Globe";
import "./App.css";

function App() {
  const [centralMeridian, setCentralMeridian] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleMeridianChange = (value: number) => {
    setCentralMeridian(value);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="main-content">
        <Globe centralMeridian={centralMeridian} isDarkMode={isDarkMode} />
      </div>
      <div className="settings-panel">
        <div className="settings-header">
          <h3>Settings</h3>
          <div className="dark-mode-toggle">
            <span className="toggle-label">Dark mode</span>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleDarkMode}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
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
