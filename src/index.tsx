import {
  useCallback,
  useLayoutEffect,
  useState,
  RefObject,
  useMemo
} from "react";
import { mergeRefs } from "./utils";
import scrollTrigger, { EventCallbackProps } from "./trigger";
import useStable from "./hooks/useStable";
import useResolvedElement from "./hooks/useResolvedElement";
import useResizeObserver, { ResizeHandler } from "./hooks/useResizeObserver";

type Register = {
  name: string;
  start?: string;
  end?: string;
  ref?: RefObject<HTMLElement>;
  refKey?: string;
  style?: CSSStyleSheet;
  onProgress?: (arg: EventCallbackProps) => void;
  onEntering?: (arg: EventCallbackProps) => void;
  onEntered?: (arg: EventCallbackProps) => void;
  onLeaving?: (arg: EventCallbackProps) => void;
  onLeft?: (arg: EventCallbackProps) => void;
  onEnteredBack?: (arg: EventCallbackProps) => void;
  onLeaveBack?: (arg: EventCallbackProps) => void;
  onStart?: (arg: EventCallbackProps) => void;
  onEnd?: (arg: EventCallbackProps) => void;
};

export const useScrollTrigger = <T extends HTMLElement>({
  root,
  onScroll
}: {
  root?: T | RefObject<T> | null;
  onScroll?: (e: Event) => void;
}) => {
  const getScroller = useCallback(() => {
    const scroller = !root
      ? document.documentElement
      : typeof root === "string"
      ? document.getElementById(root)
      : root instanceof HTMLElement
      ? root
      : root.current;
    return scroller;
  }, [root]);

  const [trigger] = useState(() => scrollTrigger());

  const onScrollRef = useStable(onScroll);

  useLayoutEffect(() => {
    trigger.init({ root: getScroller() });
  }, [getScroller, trigger]);

  const containerRef = useResolvedElement<HTMLElement>((element) => {
    const handleScroll = (e: Event) => {
      trigger.onScroll(e);
      onScrollRef.current?.(e);
    };

    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      trigger.destroy();
      element.removeEventListener("scroll", handleScroll, ({
        passive: true
      } as unknown) as EventListenerOptions);
    };
  }, getScroller());

  const { ref: resizeRef } = useResizeObserver({
    ref: getScroller(),
    onResize: useCallback(() => {
      trigger.observeAll();
    }, [trigger]) as ResizeHandler
  });

  const registerCb = (props: Register & { node: HTMLElement }) => {
    const { node, start, end } = props;
    node.dataset.start = start;
    node.dataset.end = end;
    trigger.add(props);
  };

  function register({ name, ref, style, ...rest }: Register) {
    return {
      id: `${name}`,
      ref: mergeRefs((node) => {
        if (!node) return;
        registerCb({
          node,
          name,
          ...rest
        });
      }, ref),
      style: {
        ...style
      }
    };
  }

  const scrollerRef = useMemo(() => mergeRefs(containerRef, resizeRef), [
    containerRef,
    resizeRef
  ]);
  return { register, scrollerRef };
};

export default useScrollTrigger;
