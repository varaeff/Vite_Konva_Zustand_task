import { useMemo, ReactElement, cloneElement, Children } from "react";
import {
  composeRenderProps,
  Button as RACButton,
  Group,
  GroupProps,
  ButtonProps as RACButtonProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { focusRing } from "./utils";

export interface ButtonProps extends RACButtonProps {
  variant?: "primary" | "secondary" | "warning" | "icon";
  isActive?: boolean;
  positionInGroup?: keyof PositionInButtonGroup;
}

let buttonStyles = tv({
  extend: focusRing,
  base: "cursor-pointer select-none rounded-md border border-black/10 px-3 py-1 text-center text-sm transition focus:outline-none dark:border-white/10",
  variants: {
    variant: {
      primary:
        "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
      secondary:
        "bg-secondary-100 text-secondary-800 hover:bg-secondary-200 active:bg-secondary-300 dark:bg-secondary-600 dark:text-secondary-100 dark:hover:bg-secondary-500 dark:active:bg-secondary-400",
      warning:
        "bg-warning-100 text-warning-800 hover:bg-warning-200 active:bg-warning-300 dark:bg-warning-500/50 dark:text-warning-100 dark:text-warning-200 dark:hover:bg-warning-700/50 dark:active:bg-warning-500",
      icon: "flex items-center justify-center border-0 p-1 text-secondary-800 hover:bg-black/10 active:bg-black/20 disabled:bg-transparent dark:text-secondary-200 dark:hover:bg-white/10 dark:active:bg-white/20",
    },
    positionInGroup: {
      none: "",
      start: "rounded-r-none",
      middle: "rounded-none",
      end: "rounded-l-none",
    },
    isActive: {
      true: "border border-primary-400 dark:border-primary-500",
    },
    isDisabled: {
      true: "border-black/5 bg-secondary-100 text-secondary-300 dark:border-white/5 dark:bg-secondary-800 dark:text-secondary-600",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        buttonStyles({
          ...renderProps,
          variant: props.variant,
          isActive: props.isActive,
          positionInGroup: props.positionInGroup,
          className,
        })
      )}
    />
  );
}

export interface FlowbiteButtonGroupTheme {
  base: string;
  position: PositionInButtonGroup;
}

export interface PositionInButtonGroup {
  none: string;
  start: string;
  middle: string;
  end: string;
}

let buttonGroupStyles = tv({
  base: "",
});

export const ButtonGroup = (props: GroupProps) => {
  const items = useMemo(
    () =>
      Children.map(
        props.children as ReactElement<ButtonProps>[],
        (child, index) =>
          cloneElement(child, {
            positionInGroup:
              index === 0
                ? "start"
                : index ===
                  (props.children as ReactElement<ButtonProps>[]).length - 1
                ? "end"
                : "middle",
          })
      ),
    [props.children]
  );

  return (
    <Group
      className={composeRenderProps(props.className, (className, renderProps) =>
        buttonGroupStyles({
          ...renderProps,
          className,
        })
      )}
      role="group"
      {...props}
    >
      {items}
    </Group>
  );
};
