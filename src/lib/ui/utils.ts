import { composeRenderProps } from "react-aria-components";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export const focusRing = tv({
  base: "focus:ring-2 active:ring-2",
  variants: {
    isFocusVisible: {
      false: "ring-0",
      true: "ring-2",
    },
  },
});

export const focusInnerRing = tv({
  base: "outline -outline-offset-2 focus:outline-2 active:outline-2",
  variants: {
    isFocusVisible: {
      false: "outline-0",
      true: "outline-2",
    },
  },
});

export function composeTailwindRenderProps<T>(
  className: string | ((v: T) => string) | undefined,
  tw: string
): string | ((v: T) => string) {
  return composeRenderProps(className, (className) => twMerge(tw, className));
}
