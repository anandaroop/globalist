import { useState, useRef } from "react";
import { Globe, type GlobeRef } from "./Globe";
import "./App.css";

function App() {
  const globeRef = useRef<GlobeRef>(null);
  const [centralMeridian, setCentralMeridian] = useState(0);
  const [centralParallel, setCentralParallel] = useState(0);
  const [zRotation, setZRotation] = useState(0);
  const [zoom, setZoom] = useState(1.0);
  const [projectionType, setProjectionType] = useState<
    "orthographic" | "satellite"
  >("orthographic");

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

  const handleZRotationChange = (value: number) => {
    setZRotation(value);
  };

  const handleZoomChange = (value: number) => {
    setZoom(value);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleDownloadSVG = () => {
    globeRef.current?.downloadSVG();
  };

  const handleReset = () => {
    setCentralMeridian(0);
    setCentralParallel(0);
    setZRotation(0);
    setZoom(1.0);
    setProjectionType("orthographic");
  };

  return (
    <div className={`app-container ${isDarkMode ? "dark-mode" : ""}`}>
      <div className="main-content">
        <Globe
          ref={globeRef}
          centralMeridian={centralMeridian}
          centralParallel={centralParallel}
          zRotation={zRotation}
          zoom={zoom}
          projectionType={projectionType}
          onMeridianChange={setCentralMeridian}
          onParallelChange={setCentralParallel}
          onZoomChange={setZoom}
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
          <h4>Projection</h4>
          <div className="projection-controls">
            <label className="radio-option">
              <input
                type="radio"
                value="orthographic"
                checked={projectionType === "orthographic"}
                onChange={(e) =>
                  setProjectionType(
                    e.target.value as "orthographic" | "satellite"
                  )
                }
              />
              Orthographic
            </label>
            <label className="radio-option">
              <input
                type="radio"
                value="satellite"
                checked={projectionType === "satellite"}
                onChange={(e) =>
                  setProjectionType(
                    e.target.value as "orthographic" | "satellite"
                  )
                }
              />
              Satellite
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
          <h4>Z-axis rotation</h4>
          <div className="meridian-controls">
            <input
              type="number"
              value={parseFloat(zRotation.toFixed(1))}
              onChange={(e) => handleZRotationChange(Number(e.target.value))}
              min="-180"
              max="180"
              step="0.1"
              className="meridian-input"
            />
            <input
              type="range"
              value={zRotation}
              onChange={(e) => handleZRotationChange(Number(e.target.value))}
              min="-180"
              max="180"
              step="1"
              className="meridian-slider"
            />
          </div>
        </div>
        <div className="setting-group">
          <h4>Zoom</h4>
          <div className="meridian-controls">
            <input
              type="number"
              value={parseFloat(zoom.toFixed(1))}
              onChange={(e) => handleZoomChange(Number(e.target.value))}
              min="1.0"
              max="8.0"
              step="0.1"
              className="meridian-input"
            />
            <input
              type="range"
              value={zoom}
              onChange={(e) => handleZoomChange(Number(e.target.value))}
              min="1.0"
              max="8.0"
              step="0.1"
              className="meridian-slider"
            />
          </div>
        </div>
        <div className="setting-group">
          <button onClick={handleDownloadSVG} className="download-button">
            Download SVG
          </button>
        </div>
        <div className="setting-group">
          <button onClick={handleReset} className="reset-button">
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
