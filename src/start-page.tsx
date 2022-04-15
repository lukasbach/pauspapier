import React from 'react';
import { currentMonitor, getCurrent } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/tauri';
import { tempdir } from '@tauri-apps/api/os';

export const StartPage: React.FC<{
  onStart: (path: string) => void;
}> = props => {
  return (
    <div>
      <button type="button" onClick={async () => {
        const monitor = await currentMonitor();
        const path =  await invoke<string>("make_screenshot", {
          ...monitor?.position,
          dir: await tempdir()
        });
        const appWindow = await getCurrent();
        await appWindow.setAlwaysOnTop(true);
        await appWindow.setFullscreen(true);
        props.onStart(path);
      }}>
        Select Area
      </button>
    </div>
  );
};