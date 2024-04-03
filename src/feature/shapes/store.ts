import { devtools } from "zustand/middleware";
import { create } from "zustand";
import { SHAPE } from ".";

export interface ShapesState {
  mode: SHAPE;
  setMode: (shape: SHAPE) => void;
}

export const useShapes = create<ShapesState>()(
  devtools(
    (set, get) => {
      return {
        mode: SHAPE.DRAG,
        setMode: (shape: SHAPE) => set({ mode: shape }),
      };
    },
    { name: "shapes" },
  ),
);
