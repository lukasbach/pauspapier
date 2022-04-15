import React, { useEffect } from "react";
import {
  currentMonitor,
  getCurrent,
  LogicalSize,
  PhysicalSize,
} from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";
import { tempdir } from "@tauri-apps/api/os";
import { open } from "@tauri-apps/api/shell";
import { exit } from "@tauri-apps/api/process";
import { IoCloseSharp, IoStarOutline, IoLogoGithub } from "react-icons/io5";

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
      <div className="start-page-floating-buttons">
        <button
          className="start-page-floating-button"
          onClick={() => open("https://github.com/lukasbach")}
        >
          <IoLogoGithub />
          /lukasbach
        </button>
        <button
          className="start-page-floating-button start-page-floating-button-close"
          onClick={() => open("https://github.com/lukasbach/pauspapier")}
          aria-label="Star on Github"
          title="Star on Github"
        >
          <IoStarOutline />
          {/* &nbsp;Star on GitHub */}
        </button>
        <button
          className="start-page-floating-button start-page-floating-button-close"
          onClick={() => exit()}
          aria-label="Close app"
        >
          <IoCloseSharp />
        </button>
      </div>
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
