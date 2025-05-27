import { useRef } from "react";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { Globe, type GlobeRef } from "./components/Globe";
import { ControlPanel } from "./components/Controls/ControlPanel";
import { Header } from "./components/Header";
import { useGlobeState } from "./hooks/useGlobeState";
import { ActionButtons } from "./components/Controls/ActionButtons";

function App() {
  const globeRef = useRef<GlobeRef>(null);
  const {
    state,
    updateMeridian,
    updateParallel,
    updateZRotation,
    updateZoom,
    updateProjectionType,
    updateDistance,
    updateResolution,
    toggleDarkMode,
    reset,
  } = useGlobeState();

  const handleDownloadSVG = () => {
    globeRef.current?.downloadSVG();
  };

  return (
    <Theme
      accentColor="green"
      radius="medium"
      scaling="100%"
      appearance={state.isDarkMode ? "dark" : "light"}
    >
      <div
        style={{
          display: "grid",
          gridTemplateRows: "60px 1fr 100px",
          gridTemplateColumns: "3fr 2fr",
          width: "100%",
          height: "100vh",
          maxHeight: "100vh",
          overflow: "hidden",
        }}
      >
        <header
          style={{
            gridColumn: "1 / -1",
            borderBottom: "1px solid var(--accent-4)",
          }}
        >
          <Header
            isDarkMode={state.isDarkMode}
            onDarkModeToggle={toggleDarkMode}
          />
        </header>
        <div
          style={{
            gridRow: "2 / -1",
            background: "var(--accent-1)",
          }}
        >
          <Globe
            ref={globeRef}
            centralMeridian={state.centralMeridian}
            centralParallel={state.centralParallel}
            zRotation={state.zRotation}
            zoom={state.zoom}
            projectionType={state.projectionType}
            distance={state.distance}
            resolution={state.resolution}
            onMeridianChange={updateMeridian}
            onParallelChange={updateParallel}
            onZoomChange={updateZoom}
            isDarkMode={state.isDarkMode}
          />
        </div>
        <div
          style={{
            borderLeft: "1px solid var(--accent-4)",
            gridRow: "2 / -2",
            overflowY: "auto",
          }}
        >
          <ControlPanel
            state={state}
            onMeridianChange={updateMeridian}
            onParallelChange={updateParallel}
            onZRotationChange={updateZRotation}
            onZoomChange={updateZoom}
            onProjectionTypeChange={updateProjectionType}
            onDistanceChange={updateDistance}
            onResolutionChange={updateResolution}
            onDownload={handleDownloadSVG}
            onReset={reset}
          />
        </div>
        <div
          style={{
            gridRow: "3 / -1",
            borderLeft: "1px solid var(--accent-4)",
          }}
        >
          <ActionButtons onDownload={handleDownloadSVG} onReset={reset} />
        </div>
      </div>
    </Theme>
  );
}

export default App;
