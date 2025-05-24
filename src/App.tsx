import { useState } from "react";
import { Globe } from "./Globe";
import "./App.css";

function App() {
  const [centralMeridian, setCentralMeridian] = useState(0);
  const [centralParallel, setCentralParallel] = useState(0);

  // Initialize dark mode based on system preference
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  const handleMeridianChange = (value: number) => {
    setCentralMeridian(value);
  };

  const handleParallelChange = (value: number) => {
    setCentralParallel(value);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="main-content">
        <Globe
          centralMeridian={centralMeridian}
          centralParallel={centralParallel}
          onMeridianChange={setCentralMeridian}
          onParallelChange={setCentralParallel}
          isDarkMode={isDarkMode}
        />
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
        <div className="setting-group">
          <h4>Central parallel</h4>
          <div className="meridian-controls">
            <input
              type="number"
              value={centralParallel}
              onChange={(e) => handleParallelChange(Number(e.target.value))}
              min="-90"
              max="90"
              step="1"
              className="meridian-input"
            />
            <input
              type="range"
              value={centralParallel}
              onChange={(e) => handleParallelChange(Number(e.target.value))}
              min="-90"
              max="90"
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
