import { useRef } from "react";
import { Globe, type GlobeRef } from "./components/Globe";
import { ControlPanel } from "./components/Controls/ControlPanel";
import { useGlobeState } from "./hooks/useGlobeState";
import styles from "./styles/App.module.css";
import "./styles/globals.css";
import "./styles/variables.css";

function App() {
  const globeRef = useRef<GlobeRef>(null);
  const {
    state,
    updateMeridian,
    updateParallel,
    updateZRotation,
    updateZoom,
    updateProjectionType,
    toggleDarkMode,
    reset,
  } = useGlobeState();

  const handleDownloadSVG = () => {
    globeRef.current?.downloadSVG();
  };

  return (
    <div
      className={`${styles.container} ${state.isDarkMode ? styles.darkMode : ""}`}
    >
      <div className={styles.mainContent}>
        <Globe
          ref={globeRef}
          centralMeridian={state.centralMeridian}
          centralParallel={state.centralParallel}
          zRotation={state.zRotation}
          zoom={state.zoom}
          projectionType={state.projectionType}
          onMeridianChange={updateMeridian}
          onParallelChange={updateParallel}
          onZoomChange={updateZoom}
          isDarkMode={state.isDarkMode}
        />
      </div>
      <ControlPanel
        state={state}
        onMeridianChange={updateMeridian}
        onParallelChange={updateParallel}
        onZRotationChange={updateZRotation}
        onZoomChange={updateZoom}
        onProjectionTypeChange={updateProjectionType}
        onDarkModeToggle={toggleDarkMode}
        onDownload={handleDownloadSVG}
        onReset={reset}
      />
    </div>
  );
}

export default App;
