import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { invoke } from '@tauri-apps/api/tauri'
import { tempdir } from '@tauri-apps/api/os'
import { getCurrent } from '@tauri-apps/api/window'
import { appDir, join, cacheDir, dataDir, resourceDir, localDataDir, logDir } from '@tauri-apps/api/path'

const fs = (window as any).__TAURI__.fs;

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={async () => {
            const monitor = await (window as any).__TAURI__.window.currentMonitor();
            const path =  await invoke("make_screenshot", {
              ...monitor.position,
              dir: await tempdir()
            });
            const appWindow = await getCurrent();
            await appWindow.setAlwaysOnTop(true);
            await appWindow.setFullscreen(true);
            await new Promise(r => setTimeout(r, 3000));
            await appWindow.setAlwaysOnTop(false);
            await appWindow.setFullscreen(false);
          }}>
            Screenshot
          </button>
          <button type="button" onClick={async () => {
            const image = await fs.readBinaryFile("C:\\dev\\tauri-app\\src-tauri\\2779098405.bin");
            console.log("ZZ")
          }}>
            Load
          </button>
        </p>
      </header>
    </div>
  )
}

export default App
