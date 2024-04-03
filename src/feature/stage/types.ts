import { SHAPE } from "@/feature/shapes";

export interface Size {
  width: number;
  height: number;
}

export interface Pos {
  x: number;
  y: number;
}

export interface Point extends Pos {
  id: string;
}

export interface Ring extends Pos {
  id: string;
  radius: number;
}

export interface Segment {
  mode: SHAPE.SEGMENT;
  id: string;
  start: Point;
  end: Point;
}

export interface Circle {
  mode: SHAPE.CIRCLE;
  id: string;
  center: Point;
  ring: Ring;
}

export type Shape = Segment | Circle;
