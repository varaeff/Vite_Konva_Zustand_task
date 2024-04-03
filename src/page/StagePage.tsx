import { ImgPlaceholder } from "@/feature/img/ui/ImgPlaceholder";
import { Left, Main } from "@/feature/layout";
import { ShapesControls } from "@/feature/shapes/ui/ShapesControls";
import { Stage } from "@/feature/stage/ui/Stage";

export const StagePage = () => {
  return (
    <div className="max-w-screen flex h-screen max-h-screen flex-row ">
      <Left>
        <ShapesControls></ShapesControls>
      </Left>

      <Main>
        <div className="flex justify-center p-2">
          <Stage></Stage>
          <ImgPlaceholder imgWidth={3000} imgHeight={2000}></ImgPlaceholder>
        </div>
      </Main>
    </div>
  );
};
