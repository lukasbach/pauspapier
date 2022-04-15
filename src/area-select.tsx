import { Area } from "./common";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getCurrent } from "@tauri-apps/api/window";
import { convertFileSrc } from "@tauri-apps/api/tauri";

const minTime = 500;

export const AreaSelect: React.FC<{
  screenshotPath: string;
  onSelectArea: (area: Area) => void;
}> = props => {
  const [initial, setInitial] = useState<[number, number]>();
  const areaRef = useRef<HTMLDivElement>(null);
  const startedTime = useRef(0);

  useEffect(() => {
    (async () => {
      const appWindow = await getCurrent();
      await appWindow.setAlwaysOnTop(true);
      await appWindow.setFullscreen(true);
    })();
    return () => {
      (async () => {
        const appWindow = await getCurrent();
        await appWindow.setAlwaysOnTop(false);
        await appWindow.setFullscreen(false);
      })();
    };
  }, []);

  const onSelect = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (areaRef.current && initial) {
        props.onSelectArea({
          x: initial[0],
          y: initial[1],
          w: e.clientX - initial[0],
          h: e.clientY - initial[1],
        });
      }
    },
    [props.onSelectArea, initial]
  );

  return (
    <div
      className="area-select-container"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${encodeURI(
          convertFileSrc(props.screenshotPath)
        )})`,
      }}
      onMouseDown={e => {
        if (!initial) {
          setInitial([e.clientX, e.clientY]);
          startedTime.current = Date.now();
        } else if (Date.now() > startedTime.current + minTime) {
          onSelect(e);
        }
      }}
      onMouseMove={e => {
        if (areaRef.current && initial) {
          areaRef.current.style.width = `${e.clientX - initial[0]}px`;
          areaRef.current.style.height = `${e.clientY - initial[1]}px`;
        }
      }}
      onMouseUp={e => {
        if (Date.now() > startedTime.current + minTime) {
          onSelect(e);
        }
      }}
    >
      Click and drag to select area
      <div
        className="dragging-area"
        ref={areaRef}
        style={{
          left: initial?.[0] || 0,
          top: initial?.[1] || 0,
        }}
      />
    </div>
  );
};
