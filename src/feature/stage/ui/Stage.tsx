import {
  FC,
  useRef,
  useEffect,
  useState,
  useMemo,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import Konva from "konva";
import {
  Stage as KonvaStage,
  Layer,
  Line,
  Group,
  Circle,
  Ring,
  Text,
} from "react-konva";
import { CURSOR, generateId, getCursorStyle, useStage } from "..";
import { useShapes, SHAPE } from "@/feature/shapes";
import classNames from "classnames";
import { EditableTextInput } from "./EditableTextInput";

interface StageProps {}
interface DraggingShape {
  id: string;
  draggingElementID: string;
}

export const Stage: FC<StageProps> = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const [
    size,
    shapes,
    addShape,
    dragElement,
    setShapeText,
    deleteShapes,
    pixelRatio,
  ] = useStage((s) => [
    s.size,
    s.shapes,
    s.addShape,
    s.dragElement,
    s.setShapeText,
    s.deleteShapes,
    s.yPixelRatio,
  ]);

  const [mode] = useShapes((s) => [s.mode]);

  const [dragging, setDragging] = useState<DraggingShape | null>(null);
  const [cursor] = useState<CURSOR>(getCursorStyle(mode));
  const [isEditingID, setIsEditingID] = useState<string>("");
  const [text, setText] = useState<string>("");

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setText(e.currentTarget.value);
  }

  useEffect(() => {
    shapes.forEach((shape) => {
      if (shape.mode === SHAPE.TEXT && isEditingID === shape.id) {
        setText(shape.text);
      }
    });
  }, [isEditingID, shapes]);

  const blurHandler = () => {
    if (text.trim()) {
      setShapeText(isEditingID, text);
    } else {
      deleteShapes(new Set([isEditingID]));
    }
    setIsEditingID("");
    setText("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      blurHandler();
      return;
    }
    if (e.key === "Escape" || e.key === "Delete") {
      deleteShapes(new Set([isEditingID]));
      setIsEditingID("");
      return;
    }
  };

  const handleTextDoubleClick = (shapeId: string) => {
    setIsEditingID(shapeId);
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();

    if (isEditingID) {
      blurHandler();
    }

    if (!stage) {
      return;
    }
    const pos = stage.getPointerPosition();
    if (!pos) {
      return;
    }

    const konvaShape = stage.getIntersection(pos);
    if (konvaShape) {
      return;
    }

    setDragging(null);

    switch (mode) {
      case SHAPE.SEGMENT: {
        const segmentID = generateId();
        const endID = generateId();
        addShape(
          {
            id: segmentID,
            mode,
            start: { id: generateId(), x: pos.x, y: pos.y },
            end: { id: endID, x: pos.x, y: pos.y },
          },
          endID
        );
        setDragging({
          id: segmentID,
          draggingElementID: endID,
        });
        break;
      }
      case SHAPE.CIRCLE: {
        const circleID = generateId();
        const centerID = generateId();
        const ringID = generateId();
        addShape(
          {
            id: circleID,
            mode,
            center: { id: centerID, x: pos.x, y: pos.y },
            ring: { id: ringID, radius: 0, x: pos.x, y: pos.y },
          },
          circleID
        );
        setDragging({
          id: circleID,
          draggingElementID: ringID,
        });
        break;
      }
      case SHAPE.TEXT: {
        const textID = generateId();
        const posID = generateId();
        addShape(
          {
            id: textID,
            mode,
            pos: { id: posID, x: pos.x, y: pos.y },
            text: "",
          },
          textID
        );
        setDragging({
          id: textID,
          draggingElementID: posID,
        });
        setIsEditingID(textID);
        break;
      }
      default:
        break;
    }
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    if (!stage) {
      return;
    }
    const pos = stage.getPointerPosition();
    if (!pos) {
      return;
    }

    if (dragging) {
      dragElement(dragging.id, dragging.draggingElementID, pos);
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleGroupMouseEnter = () => {
    const container = stageRef.current?.container();
    if (container) {
      container.style.cursor = "pointer";
    }
  };

  const handleGroupMouseLeave = () => {
    const container = stageRef.current?.container();
    if (container) {
      container.style.cursor = getCursorStyle(mode);
    }
  };

  const dragBoundFunc = useMemo(
    () => (pos: { x: number; y: number }) => {
      const newX = Math.max(Math.min(pos.x, size.width), 0);
      const newY = Math.max(Math.min(pos.y, size.height), 0);
      return { x: newX, y: newY };
    },
    [size]
  );

  useEffect(() => {
    const container = stageRef.current?.container();
    if (container) {
      container.style.cursor = getCursorStyle(mode);
    }
  }, [mode]);

  return (
    <div className={`relative flex justify-center`}>
      <KonvaStage
        ref={stageRef}
        width={size.width}
        height={size.height}
        className={classNames(
          "absolute top-0 left-0 z-20 mx-auto",
          `cursor-${cursor}`
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Layer>
          {[...shapes.values()].map((shape) => {
            switch (shape.mode) {
              case SHAPE.SEGMENT: {
                const scaledStart = {
                  id: shape.start.id,
                  x: shape.start.x / pixelRatio,
                  y: shape.start.y / pixelRatio,
                };
                const scaledEnd = {
                  id: shape.end.id,
                  x: shape.end.x / pixelRatio,
                  y: shape.end.y / pixelRatio,
                };

                return (
                  <Group
                    key={shape.id}
                    onMouseEnter={handleGroupMouseEnter}
                    onMouseLeave={handleGroupMouseLeave}
                  >
                    <Circle
                      {...scaledStart}
                      radius={8}
                      stroke="blue"
                      strokeWidth={2}
                      draggable
                      onDragMove={(e) => {
                        dragElement(
                          shape.id,
                          scaledStart.id,
                          e.target.position()
                        );
                      }}
                      dragBoundFunc={dragBoundFunc}
                    />

                    <Circle
                      {...scaledEnd}
                      radius={8}
                      stroke="blue"
                      strokeWidth={2}
                      draggable
                      dragBoundFunc={dragBoundFunc}
                      onDragMove={(e) => {
                        dragElement(
                          shape.id,
                          scaledEnd.id,
                          e.target.position()
                        );
                      }}
                    />

                    <Line
                      id={shape.id}
                      key={shape.id}
                      points={[
                        scaledStart.x,
                        scaledStart.y,
                        scaledEnd.x,
                        scaledEnd.y,
                      ]}
                      stroke="white"
                      strokeWidth={3}
                      lineCap="round"
                      lineJoin="round"
                    />
                  </Group>
                );
              }
              case SHAPE.CIRCLE: {
                const scaledCenter = {
                  id: shape.center.id,
                  x: shape.center.x / pixelRatio,
                  y: shape.center.y / pixelRatio,
                };

                const scaledRing = {
                  ...shape.ring,
                  radius: shape.ring.radius / pixelRatio,
                  x: shape.ring.x / pixelRatio,
                  y: shape.ring.y / pixelRatio,
                };

                return (
                  <Group
                    key={shape.id}
                    onMouseEnter={handleGroupMouseEnter}
                    onMouseLeave={handleGroupMouseLeave}
                  >
                    <Circle
                      {...scaledCenter}
                      radius={6}
                      stroke="white"
                      strokeWidth={2}
                      draggable
                      onDragMove={(e) => {
                        dragElement(
                          shape.id,
                          scaledCenter.id,
                          e.target.position()
                        );
                      }}
                      dragBoundFunc={dragBoundFunc}
                    />
                    <Ring
                      {...scaledRing}
                      x={scaledCenter.x}
                      y={scaledCenter.y}
                      innerRadius={scaledRing.radius}
                      outerRadius={scaledRing.radius + 2}
                      stroke="transparent"
                      fill="blue"
                      strokeWidth={6}
                      draggable
                      onDragMove={(e) => {
                        const pos = e.target.getStage()?.getPointerPosition();

                        if (pos) {
                          e.target.setAttr("x", scaledCenter.x);
                          e.target.setAttr("y", scaledCenter.y);
                          dragElement(shape.id, scaledRing.id, pos);
                        }

                        e.cancelBubble = true;
                        return false;
                      }}
                      dragBoundFunc={dragBoundFunc}
                    />
                  </Group>
                );
              }
              case SHAPE.TEXT: {
                const scaledPos = {
                  id: shape.pos.id,
                  x: shape.pos.x / pixelRatio,
                  y: shape.pos.y / pixelRatio,
                };

                return (
                  <Group
                    key={shape.id}
                    onMouseEnter={handleGroupMouseEnter}
                    onMouseLeave={handleGroupMouseLeave}
                  >
                    {isEditingID === shape.id && (
                      <EditableTextInput
                        x={scaledPos.x}
                        y={scaledPos.y}
                        value={text}
                        onChange={handleTextChange}
                        onKeyDown={handleKeyPress}
                      />
                    )}
                    {isEditingID !== shape.id && (
                      <Text
                        id={shape.id}
                        key={shape.id}
                        x={scaledPos.x}
                        y={scaledPos.y}
                        text={shape.text}
                        fontSize={30}
                        fill={"rgb(37 99 235)"}
                        draggable
                        dragBoundFunc={dragBoundFunc}
                        onDragMove={(e) => {
                          dragElement(shape.id, shape.id, e.target.position());
                        }}
                        onDblClick={() => handleTextDoubleClick(shape.id)}
                      />
                    )}
                  </Group>
                );
              }
            }
          })}
        </Layer>
      </KonvaStage>
    </div>
  );
};
