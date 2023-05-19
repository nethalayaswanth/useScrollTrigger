import {
  useEffect,
  useState,
  useRef,
  useMemo,
  RefObject,
  RefCallback,
  useCallback
} from "react";

import useResolvedElement from "./useResolvedElement";
import { extractSize } from "../utils";

export type ObservedSize = {
  width: number | undefined;
  height: number | undefined;
};

export type ResizeHandler = (size: ObservedSize) => void;

type HookResponse<T extends Element> = {
  ref: RefCallback<T>;
} & ObservedSize;

export type ResizeObserverBoxOptions =
  | "border-box"
  | "content-box"
  | "device-pixel-content-box";

declare global {
  interface ResizeObserverEntry {
    readonly devicePixelContentBoxSize: ReadonlyArray<ResizeObserverSize>;
  }
}

export type RoundingFunction = (n: number) => number;

function useResizeObserver<T extends Element>(
  opts: {
    ref?: RefObject<T> | T | null | undefined;
    onResize?: ResizeHandler;
    box?: ResizeObserverBoxOptions;
    round?: RoundingFunction;
  } = {}
): HookResponse<T> {
  const onResize = opts.onResize;
  const onResizeRef = useRef<ResizeHandler | undefined>(undefined);
  onResizeRef.current = onResize;
  const round = opts.round || Math.round;

  const resizeObserverRef = useRef<{
    box?: ResizeObserverBoxOptions;
    round?: RoundingFunction;
    instance: ResizeObserver;
  }>();

  const [size, setSize] = useState<{
    width?: number;
    height?: number;
  }>({
    width: undefined,
    height: undefined
  });

  const didUnmount = useRef(false);
  useEffect(() => {
    didUnmount.current = false;

    return () => {
      didUnmount.current = true;
    };
  }, []);

  const previous: {
    current: {
      width?: number;
      height?: number;
    };
  } = useRef({
    width: undefined,
    height: undefined
  });

  const refCallback = useResolvedElement<T>(
    useCallback(
      (element) => {
        if (
          !resizeObserverRef.current ||
          resizeObserverRef.current.box !== opts.box ||
          resizeObserverRef.current.round !== round
        ) {
          resizeObserverRef.current = {
            box: opts.box,
            round,
            instance: new ResizeObserver((entries) => {
              const entry = entries[0];

              const boxProp =
                opts.box === "border-box"
                  ? "borderBoxSize"
                  : opts.box === "device-pixel-content-box"
                  ? "devicePixelContentBoxSize"
                  : "contentBoxSize";

              const reportedWidth = extractSize(entry, boxProp, "inlineSize");
              const reportedHeight = extractSize(entry, boxProp, "blockSize");

              const newWidth = reportedWidth ? round(reportedWidth) : undefined;
              const newHeight = reportedHeight
                ? round(reportedHeight)
                : undefined;

              if (
                previous.current.width !== newWidth ||
                previous.current.height !== newHeight
              ) {
                const newSize = { width: newWidth, height: newHeight };
                previous.current.width = newWidth;
                previous.current.height = newHeight;
                if (onResizeRef.current) {
                  onResizeRef.current(newSize);
                } else {
                  if (!didUnmount.current) {
                    setSize(newSize);
                  }
                }
              }
            })
          };
        }

        resizeObserverRef.current.instance.observe(element, { box: opts.box });

        return () => {
          if (resizeObserverRef.current) {
            resizeObserverRef.current.instance.unobserve(element);
          }
        };
      },
      [opts.box, round]
    ),
    opts.ref
  );

  return useMemo(
    () => ({
      ref: refCallback,
      width: size.width,
      height: size.height
    }),
    [refCallback, size.width, size.height]
  );
}

export default useResizeObserver;

/*  The MIT License (MIT)
 Copyright 2018 Viktor Hubert <rpgmorpheus@gmail.com> */
