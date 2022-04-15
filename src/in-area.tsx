import { Area } from "./common";
import React, { useCallback, useEffect, useState } from "react";
import {
  getCurrent,
  LogicalSize,
  PhysicalPosition,
  PhysicalSize,
} from "@tauri-apps/api/window";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import {
  IoAddCircle,
  IoRemoveCircle,
  IoCloseCircleOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoMoveSharp,
  IoArrowUpCircleSharp,
  IoArrowForwardCircleSharp,
  IoArrowBackCircleSharp,
  IoArrowDownCircleSharp,
  IoStarOutline,
  IoStarSharp,
} from "react-icons/io5";
import { ControlButton } from "./control-button";

const headerHeight = 30;
const minWidth = 200;

export const InArea: React.FC<{
  area: Area;
  screenshotPath: string;
  onClose: () => void;
}> = ({ area, screenshotPath, onClose }) => {
  const [hidden, setHidden] = useState(false);
  const [onTop, setOnTop] = useState(true);
  const [nudgeControls, setNudgeControls] = useState(false);
  const [hoverText, setHoverText] = useState<string>();
  const [opacity, setOpacity] = useState(0.8);

  useEffect(() => {
    (async () => {
      const appWindow = await getCurrent();
      await appWindow.setResizable(false);
      await appWindow.setDecorations(false);
      await appWindow.setAlwaysOnTop(true);
      await appWindow.setSize(
        new LogicalSize(
          Math.max(200, area.w),
          Math.max(area.h + headerHeight, 40)
        )
      );
      await appWindow.setMinSize(new LogicalSize(200, 40));
    })();
    return () => {
      (async () => {
        const appWindow = await getCurrent();
        await appWindow.setAlwaysOnTop(false);
      })();
    };
  }, []);

  const nudge = useCallback(
    (x: number, y: number) => async () => {
      const appWindow = await getCurrent();
      const position = await appWindow.innerPosition();
      await appWindow.setPosition(
        new PhysicalPosition(position.x + x, position.y + y)
      );
    },
    []
  );

  return (
    <div
      style={{
        minWidth: `${minWidth}px`,
      }}
    >
      <div
        className="in-area-controls"
        data-tauri-drag-region={true}
        style={{
          height: `${headerHeight}px`,
        }}
      >
        {nudgeControls ? (
          <>
            <ControlButton
              description="Nudge upwards"
              onSetHoverText={setHoverText}
              onClick={nudge(0, -1)}
              icon={<IoArrowUpCircleSharp />}
            />
            <ControlButton
              description="Nudge downwards"
              onSetHoverText={setHoverText}
              onClick={nudge(0, 1)}
              icon={<IoArrowDownCircleSharp />}
            />
            <ControlButton
              description="Nudge left"
              onSetHoverText={setHoverText}
              onClick={nudge(-1, 0)}
              icon={<IoArrowBackCircleSharp />}
            />
            <ControlButton
              description="Nudge right"
              onSetHoverText={setHoverText}
              onClick={nudge(1, 0)}
              icon={<IoArrowForwardCircleSharp />}
            />
            <ControlButton
              icon={<IoCloseCircleOutline />}
              description={"Close Window Nudge controls"}
              onSetHoverText={setHoverText}
              onClick={() => setNudgeControls(false)}
            />
          </>
        ) : (
          <>
            <ControlButton
              icon={hidden ? <IoEyeOffOutline /> : <IoEyeOutline />}
              description={!hidden ? "Hide overlay" : "Show overlay"}
              onSetHoverText={setHoverText}
              onClick={async () => {
                const appWindow = await getCurrent();
                await appWindow.setSize(
                  new LogicalSize(
                    Math.max(area.w, 200),
                    Math.max(!hidden ? headerHeight : area.h + headerHeight, 40)
                  )
                );
                setHidden(!hidden);
              }}
            />
            <ControlButton
              icon={onTop ? <IoStarSharp /> : <IoStarOutline />}
              description={
                onTop ? "Disable always on top" : "Enable Always on top"
              }
              onSetHoverText={setHoverText}
              onClick={async () => {
                const appWindow = await getCurrent();
                await appWindow.setAlwaysOnTop(!onTop);
                setOnTop(!onTop);
              }}
            />
            <ControlButton
              icon={<IoAddCircle />}
              description="Increase opacity"
              onSetHoverText={setHoverText}
              onClick={() => setOpacity(Math.min(opacity + 0.1, 1))}
            />
            <ControlButton
              icon={<IoRemoveCircle />}
              description="Decrease opacity"
              onSetHoverText={setHoverText}
              onClick={() => setOpacity(Math.max(opacity - 0.1, 0))}
            />
            <ControlButton
              icon={<IoMoveSharp />}
              description={"Open Window Nudge controls"}
              onSetHoverText={setHoverText}
              onClick={() => setNudgeControls(true)}
            />
            <ControlButton
              icon={<IoCloseCircleOutline />}
              description="Close overlay"
              onSetHoverText={setHoverText}
              onClick={onClose}
            />
          </>
        )}
      </div>
      {hoverText && <div className="hover-text">{hoverText}</div>}
      {!hidden && (
        <div
          data-tauri-drag-region={true}
          className="in-area-image"
          style={{
            backgroundImage: `url(${encodeURI(
              convertFileSrc(screenshotPath)
            )})`,
            backgroundPosition: `left ${-area.x}px top ${-area.y}px`,
            width: `${area.w}px`,
            height: `${area.h}px`,
            opacity,
          }}
        />
      )}
    </div>
  );
};
