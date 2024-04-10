import { SHAPE } from "@/feature/shapes";
import { Pos, Shape } from "./types";

const ID_LENGTH = 8;
export const generateId = (): string => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < ID_LENGTH; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const getDistance = (point1: Pos, point2: Pos) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export enum CURSOR {
  DEFAULT = "auto",
  GRAB = "grab",
  CROSSHAIR = "crosshair",
  TEXT = "text",
}

const shapeToPointerMap = {
  [SHAPE.DRAG]: CURSOR.GRAB,
  [SHAPE.SEGMENT]: CURSOR.CROSSHAIR,
  [SHAPE.CIRCLE]: CURSOR.CROSSHAIR,
  [SHAPE.TEXT]: CURSOR.TEXT,
};

export const getCursorStyle = (shapeType: SHAPE) => {
  return shapeToPointerMap[shapeType] || CURSOR.DEFAULT;
};

interface HasID {
  id: string;
  getParent: () => HasID | null;
}
export const getShape = (
  element: HasID,
  shapes: Map<string, Shape>
): Shape | undefined => {
  if (shapes.has(element.id)) {
    return shapes.get(element.id);
  }

  const parent = element.getParent();
  if (parent) {
    return;
  }

  return;
};
