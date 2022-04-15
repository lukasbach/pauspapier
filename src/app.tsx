import React, { useState } from "react";
import { StartPage } from "./start-page";
import { AreaSelect } from "./area-select";
import { AppState, Area } from "./common";
import { InArea } from "./in-area";

const fs = (window as any).__TAURI__.fs;

function App() {
  const [appState, setAppState] = useState(AppState.StartPage);
  const [screenshotPath, setScreenshotPath] = useState("");
  const [area, setArea] = useState<Area>();

  switch (appState) {
    case AppState.StartPage:
      return (
        <StartPage
          onStart={path => {
            setScreenshotPath(path);
            setAppState(AppState.AreaSelect);
          }}
        />
      );
    case AppState.AreaSelect:
      return (
        <AreaSelect
          screenshotPath={screenshotPath}
          onSelectArea={area => {
            setArea(area);
            setAppState(AppState.InArea);
          }}
        />
      );
    case AppState.InArea:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return <InArea area={area!} screenshotPath={screenshotPath} />;
  }
}

export default App;
