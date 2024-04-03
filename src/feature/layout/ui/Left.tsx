import { FC, PropsWithChildren } from "react";
import { useMove } from "react-aria";
import { useLayout } from "..";
import { Button } from "@/lib/ui";

interface LeftProps extends PropsWithChildren {}

export const Left: FC<LeftProps> = ({ children }) => {
  const [isLeftOpen, width, setWidth] = useLayout((s) => [
    s.isLeftOpen,
    s.leftWidth,
    s.setLeftWidth,
  ]);

  let clamp = (x: number) => (x <= 100 ? 100 : x >= 400 ? 400 : x);

  let { moveProps } = useMove({
    onMove(e) {
      setWidth(clamp(width + e.deltaX));
    },

    onMoveEnd() {
      setWidth(clamp(width));
    },
  });
  return isLeftOpen ? (
    <>
      <div
        className=" shrink-0 select-none flex-col border-r"
        style={{ width: `${width / 16}rem` }}
      >
        <div className="">
          <div className="sticky top-0 z-20 w-full ">
            <Button
              variant="icon"
              className="m-2 h-8 w-full justify-start truncate border-0 p-1"
            >
              <div className=" truncate ">user@email.com</div>
            </Button>
          </div>
          {children}
        </div>
      </div>

      <div
        className=" h-full w-1.5 shrink-0 cursor-col-resize select-none transition hover:bg-secondary-300 dark:hover:bg-secondary-600"
        {...moveProps}
      ></div>
    </>
  ) : (
    <></>
  );
};
