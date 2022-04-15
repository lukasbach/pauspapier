import React, { ReactNode } from "react";

export const ControlButton: React.VFC<{
  icon: ReactNode;
  description: string;
  onClick?: () => void;
  onSetHoverText?: (text?: string) => void;
}> = ({ icon, onClick, description, onSetHoverText }) => {
  return (
    <button
      className="control-button"
      onMouseOver={() => onSetHoverText?.(description)}
      onMouseLeave={() => onSetHoverText?.(undefined)}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};
