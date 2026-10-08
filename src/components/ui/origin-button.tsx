"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import * as React from "react";
import type { ComponentProps } from "react";

const MotionLink = motion.create(Link);
const FILL_DURATION = 0.5;
const FILL_EASE = [0.16, 1, 0.3, 1] as const;

export type OriginButtonProps = Omit<
  ComponentProps<typeof Link>,
  | "children"
  | "className"
  | "href"
  | "onAnimationEnd"
  | "onAnimationIteration"
  | "onAnimationStart"
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragExit"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
> & {
  children?: React.ReactNode;
  className?: string;
  href: string;
  small?: boolean;
};

function getCoverDiameter(width: number, height: number, x: number, y: number) {
  return Math.ceil(
    2 *
      Math.max(
        Math.hypot(x, y),
        Math.hypot(width - x, y),
        Math.hypot(x, height - y),
        Math.hypot(width - x, height - y),
      ),
  );
}

function assignRef<T>(ref: React.ForwardedRef<T>, value: T | null) {
  if (typeof ref === "function") ref(value);
  else if (ref) ref.current = value;
}

export const OriginButton = React.forwardRef<HTMLAnchorElement, OriginButtonProps>(
  (
    {
      children,
      className = "",
      href,
      small = false,
      onBlur,
      onClick,
      onFocus,
      onPointerCancel,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      onPointerUp,
      ...props
    },
    ref,
  ) => {
    const anchorRef = React.useRef<HTMLAnchorElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const [hovered, setHovered] = React.useState(false);
    const [isPressed, setIsPressed] = React.useState(false);
    const [origin, setOrigin] = React.useState({ x: 0, y: 0 });
    const [coverSize, setCoverSize] = React.useState(0);
    const showFill = hovered || isPressed;

    const updateOrigin = React.useCallback((x: number, y: number) => {
      const node = anchorRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      setOrigin({ x, y });
      setCoverSize(getCoverDiameter(rect.width, rect.height, x, y));
    }, []);

    const updateOriginFromPointer = React.useCallback(
      (event: React.PointerEvent<HTMLAnchorElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        updateOrigin(event.clientX - rect.left, event.clientY - rect.top);
      },
      [updateOrigin],
    );

    const updateOriginFromCenter = React.useCallback(() => {
      const node = anchorRef.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      updateOrigin(rect.width / 2, rect.height / 2);
    }, [updateOrigin]);

    React.useLayoutEffect(() => {
      const node = anchorRef.current;
      if (!(node && showFill)) return;

      const measure = () => {
        const rect = node.getBoundingClientRect();
        setCoverSize(
          getCoverDiameter(rect.width, rect.height, origin.x, origin.y),
        );
      };

      measure();
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      document.fonts?.ready.then(measure).catch(() => undefined);

      return () => observer.disconnect();
    }, [showFill, origin.x, origin.y]);

    const setMergedRef = React.useCallback(
      (node: HTMLAnchorElement | null) => {
        anchorRef.current = node;
        assignRef(ref, node);
      },
      [ref],
    );

    const fillTransition = {
      duration: prefersReducedMotion ? 0 : FILL_DURATION,
      ease: FILL_EASE,
    };

    return (
      <MotionLink
        {...props}
        className={[
          "cta originButton",
          small ? "sm" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-origin-active={showFill ? "true" : undefined}
        data-pressed={isPressed ? "true" : "false"}
        href={href}
        onBlur={(event) => {
          onBlur?.(event);
          setIsPressed(false);
          if (!event.defaultPrevented) setHovered(false);
        }}
        onClick={onClick}
        onFocus={(event) => {
          onFocus?.(event);
          if (!event.defaultPrevented && event.currentTarget.matches(":focus-visible")) {
            updateOriginFromCenter();
            setHovered(true);
          }
        }}
        onPointerCancel={(event) => {
          onPointerCancel?.(event);
          setIsPressed(false);
          if (!event.currentTarget.matches(":focus-visible")) setHovered(false);
        }}
        onPointerDown={(event) => {
          onPointerDown?.(event);
          if (event.defaultPrevented || event.button !== 0) return;
          updateOriginFromPointer(event);
          setIsPressed(true);
          setHovered(true);
        }}
        onPointerEnter={(event) => {
          onPointerEnter?.(event);
          if (event.defaultPrevented) return;
          updateOriginFromPointer(event);
          setHovered(true);
        }}
        onPointerLeave={(event) => {
          onPointerLeave?.(event);
          setHovered(false);
          setIsPressed(false);
        }}
        onPointerUp={(event) => {
          onPointerUp?.(event);
          setIsPressed(false);
        }}
        ref={setMergedRef}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }}
      >
        <motion.span
          animate={{ scale: showFill && coverSize > 0 ? 1 : 0 }}
          aria-hidden
          className="originButton__fill"
          initial={false}
          style={{
            height: coverSize,
            left: origin.x,
            top: origin.y,
            width: coverSize,
          }}
          transition={fillTransition}
        />
        <span className="originButton__label">{children}</span>
      </MotionLink>
    );
  },
);

OriginButton.displayName = "OriginButton";
