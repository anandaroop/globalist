import { useState, useRef } from "react";
import { Globe, type GlobeRef } from "./Globe";
import "./App.css";

function App() {
  const globeRef = useRef<GlobeRef>(null);
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

  const handleDownloadSVG = () => {
    globeRef.current?.downloadSVG();
  };

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="main-content">
        <Globe
          ref={globeRef}
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
              value={parseFloat(centralMeridian.toFixed(1))}
              onChange={(e) => handleMeridianChange(Number(e.target.value))}
              min="-180"
              max="180"
              step="0.1"
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
              value={parseFloat(centralParallel.toFixed(1))}
              onChange={(e) => handleParallelChange(Number(e.target.value))}
              min="-90"
              max="90"
              step="0.1"
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
        <div className="setting-group">
          <button onClick={handleDownloadSVG} className="download-button">
            Download SVG
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
