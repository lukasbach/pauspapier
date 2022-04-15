import { Area } from "./common";
import React from "react";

export const InArea: React.FC<{
  area: Area;
  screenshotPath: string;
}> = props => {
  return <pre>{JSON.stringify(props)}</pre>;
};
