import React, { useEffect } from "react";
import {
  currentMonitor,
  getCurrent,
  LogicalSize,
  PhysicalSize,
} from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";
import { tempdir } from "@tauri-apps/api/os";
import { exit } from "@tauri-apps/api/process";
import { IoCloseSharp } from "react-icons/io5";

export const StartPage: React.FC<{
  onStart: (path: string) => void;
}> = props => {
  useEffect(() => {
    (async () => {
      const appWindow = await getCurrent();
      await appWindow.setResizable(false);
      await appWindow.setDecorations(false);
      await appWindow.setSize(new PhysicalSize(450, 120));
      await appWindow.setMinSize(new LogicalSize(450, 120));
    })();
    return () => {
      (async () => {
        const appWindow = await getCurrent();
      })();
    };
  }, []);

  return (
    <div className="start-page" data-tauri-drag-region={true}>
      <button
        className="start-page-close-button"
        onClick={() => exit()}
        aria-label="Close app"
      >
        <IoCloseSharp />
      </button>
      <h1 className="start-page-header" data-tauri-drag-region={true}>
        Pauspapier
      </h1>
      <p className="start-page-text" data-tauri-drag-region={true}>
        Select an area to overlay on your screen.
      </p>
      <button
        className="start-page-button"
        onClick={async () => {
          const appWindow = await getCurrent();
          await appWindow.hide();
          await new Promise(r => setTimeout(r, 200)); // wait for hide animation
          const monitor = await currentMonitor();
          const path = await invoke<string>("make_screenshot", {
            ...monitor?.position,
            dir: await tempdir(),
          });
          await appWindow.show();
          props.onStart(path);
        }}
      >
        Select an Area
      </button>
    </div>
  );
};
