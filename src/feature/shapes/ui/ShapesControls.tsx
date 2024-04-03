import { PiLineSegment } from "react-icons/pi";
import { Button } from "@/lib/ui";
import { SHAPE, useShapes } from "@/feature/shapes";
import { LiaHandPaper } from "react-icons/lia";
import { LuCircleDot } from "react-icons/lu";
export const ShapesControls = () => {
  const [selectedShape, setSelectedShape] = useShapes((s) => [
    s.mode,
    s.setMode,
  ]);

  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(32px,1fr))] gap-1">
        <Button
          variant={"icon"}
          isActive={selectedShape === SHAPE.DRAG}
          onPress={() => setSelectedShape(SHAPE.DRAG)}
        >
          <LiaHandPaper className="h-5 w-5" />
        </Button>

        <Button
          variant={"icon"}
          isActive={selectedShape === SHAPE.SEGMENT}
          onPress={() => setSelectedShape(SHAPE.SEGMENT)}
        >
          <PiLineSegment className="h-5 w-5" />
        </Button>

        <Button
          variant={"icon"}
          isActive={selectedShape === SHAPE.CIRCLE}
          onPress={() => setSelectedShape(SHAPE.CIRCLE)}
        >
          <LuCircleDot className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
