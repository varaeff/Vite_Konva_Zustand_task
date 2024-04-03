import { produce } from "immer";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { SHAPE } from "@/feature/shapes";
import { Size, Shape, Point, Pos } from "./types";
import { getDistance } from "./lib";

interface StageState {
  size: Size;
  shapes: Map<string, Shape>;
  activeID: string | null;
  activeShapeID: string | null;
  yPixelRatio: number;
  ratio: number;
  addShape: (shape: Shape, activeID?: string) => void;
  dragElement: (id: string, draggingElementID: string, pos: Pos) => void;
  changeShape: (
    id: string,
    newVal: Partial<Omit<Shape, "id" | "mode">>
  ) => void;
  setSize: (val: Size) => void;
  clean: () => void;
  deleteShapes: (ids: Set<string>) => void;
}

export const useStage = create<StageState>()(
  devtools(
    (set) => {
      return {
        size: { width: 0, height: 0 },
        shapes: new Map(),
        activeID: null,
        activeShapeID: null,
        yPixelRatio: 1,
        ratio: 1,

        addShape: (shape: Shape, activeID?: string) =>
          set(
            produce((state: StageState) => {
              const { width, height } = state.size;

              switch (shape.mode) {
                case SHAPE.SEGMENT:
                  state.shapes.set(shape.id, {
                    ...shape,
                    start: {
                      ...shape.start,
                      x: shape.start.x * state.yPixelRatio,
                      y: shape.start.y * state.yPixelRatio,
                    },
                    ...(shape.mode === SHAPE.SEGMENT && {
                      end: {
                        ...shape.end,
                        x: shape.end.x * state.yPixelRatio,
                        y: shape.end.y * state.yPixelRatio,
                      },
                    }),
                  });
                  break;

                case SHAPE.CIRCLE:
                  state.shapes.set(shape.id, {
                    ...shape,
                    center: {
                      ...shape.center,
                      x: shape.center.x * state.yPixelRatio,
                      y: shape.center.y * state.yPixelRatio,
                    },
                    ring: {
                      ...shape.ring,
                      x: shape.ring.x * state.yPixelRatio,
                      y: shape.ring.y * state.yPixelRatio,
                      radius: shape.ring.radius,
                    },
                  });

                  break;

                default:
                  throw new Error("unknown shape");
              }

              if (activeID) {
                state.activeShapeID = shape.id; // if active any element of shape - it whole active
                state.activeID = activeID!;
              }
            }),
            false,
            "addShape"
          ),
        setSize: (val: Size) =>
          set(
            produce((state: StageState) => {
              state.size = val;
              state.yPixelRatio = 1 / val.height;
              state.ratio = val.height / val.width;
            }),
            false,
            "setSize"
          ),
        changeShape: (
          id: string,
          newVal: Partial<Omit<Shape, "id" | "mode">>
        ) =>
          set(
            produce((state: StageState) => {
              const shape = state.shapes.get(id);
              if (shape) {
                Object.assign(shape, newVal);
              }
            }),
            false,
            "changeShape"
          ),
        dragElement: (id: string, draggingElementID: string, pos: Pos) =>
          set(
            produce((state: StageState) => {
              const shape = state.shapes.get(id);
              const relativePos = {
                x: pos.x * state.yPixelRatio,
                y: pos.y * state.yPixelRatio,
              };
              const boundedPos = {
                x: Math.max(0, Math.min(1 / state.ratio, relativePos.x)),
                y: Math.max(0, Math.min(1, relativePos.y)),
              };

              if (shape) {
                switch (shape.mode) {
                  case SHAPE.SEGMENT:
                    if (shape.end.id === draggingElementID) {
                      shape.end = {
                        ...shape.end,
                        ...boundedPos,
                      };
                    } else if (shape.start.id === draggingElementID) {
                      shape.start = {
                        ...shape.start,
                        ...boundedPos,
                      };
                    }
                    break;

                  case SHAPE.CIRCLE:
                    if (shape.ring.id === draggingElementID) {
                      const newRadius = getDistance(
                        { x: shape.center.x, y: shape.center.y },
                        relativePos
                      );
                      shape.ring = {
                        ...shape.ring,
                        radius: newRadius,
                      };
                    } else if (shape.center.id === draggingElementID) {
                      shape.center = {
                        ...shape.center,
                        ...boundedPos,
                      };
                      shape.ring = {
                        ...shape.ring,
                        ...boundedPos,
                      };
                    }

                    break;

                  default:
                    throw new Error("unknown shape");
                }
              }
            }),
            true,
            "dragElement"
          ),

        clean: () =>
          set(
            produce((state: StageState) => {
              state.shapes = new Map();
            }),
            false,
            "clean"
          ),
        deleteShapes: (ids: Set<string>) =>
          set(
            produce((state: StageState) => {
              state.shapes = new Map(
                Array.from(state.shapes).filter(([id]) => !ids.has(id))
              );
            }),
            false,
            "deleteShapes"
          ),
      };
    },
    {
      name: "stage",
    }
  )
);
