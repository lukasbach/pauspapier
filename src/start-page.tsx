import React from "react";
import { currentMonitor, getCurrent } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";
import { tempdir } from "@tauri-apps/api/os";

export const StartPage: React.FC<{
  onStart: (path: string) => void;
}> = props => {
  return (
    <div>
      <button
        type="button"
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
        Select Area
      </button>
    </div>
  );
};
