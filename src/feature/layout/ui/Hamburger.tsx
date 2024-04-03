import { Button } from "@/lib/ui";
import { HiOutlineBars3 } from "react-icons/hi2";
import { FC, PropsWithChildren } from "react";
import { useLayout } from "..";

interface HamburgerProps extends PropsWithChildren {}
export const Hamburger: FC<HamburgerProps> = () => {
  const [isLeftOpen, setIsLeftOpen] = useLayout((s) => [
    s.isLeftOpen,
    s.setIsLeftOpen,
  ]);

  return (
    !isLeftOpen && (
      <div className="bg sticky top-0 z-20 float-left flex h-12 items-center pr-2">
        <Button
          variant="icon"
          className="h-8 w-8 "
          onPress={() => setIsLeftOpen(true)}
        >
          <HiOutlineBars3 className="h-5 w-5" />
        </Button>
      </div>
    )
  );
};
