"use client";

import { FC } from "react";
import { startGenerate } from "./actions";

export const ActionButton: FC<{ sampleOutputId: number }> = ({
  sampleOutputId,
}) => {
  return <button onClick={async () => {}}>Click me</button>;
};
