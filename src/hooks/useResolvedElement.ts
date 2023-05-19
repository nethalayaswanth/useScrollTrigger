import { RefCallback, RefObject, useCallback, useEffect, useRef } from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

type SubscriberCleanupFunction = () => void;
type SubscriberResponse = SubscriberCleanupFunction | void;

export default function useResolvedElement<T extends Element>(
  subscriber: (element: T) => SubscriberResponse,
  refOrElement?: T | RefObject<T> | null
): RefCallback<T> {
  const lastReportRef = useRef<{
    element: T | null;
    subscriber: typeof subscriber;
    cleanup?: SubscriberResponse;
  } | null>(null);
  const refOrElementRef = useRef<typeof refOrElement>(null);
  refOrElementRef.current = refOrElement;
  const cbElementRef = useRef<T | null>(null);

  const evaluateSubscription = useCallback(() => {
    const cbElement = cbElementRef.current;
    const refOrElement = refOrElementRef.current;

    const element = cbElement
      ? cbElement
      : refOrElement
      ? refOrElement instanceof Element
        ? refOrElement
        : refOrElement.current
      : null;

    if (
      lastReportRef.current &&
      lastReportRef.current.element === element &&
      lastReportRef.current.subscriber === subscriber
    ) {
      return;
    }

    if (lastReportRef.current && lastReportRef.current.cleanup) {
      lastReportRef.current.cleanup();
    }
    lastReportRef.current = {
      element,
      subscriber,

      cleanup: element ? subscriber(element) : undefined
    };
  }, [subscriber]);

  useIsomorphicLayoutEffect(() => {
    evaluateSubscription();
  });

  useIsomorphicLayoutEffect(() => {
    return () => {
      if (lastReportRef.current && lastReportRef.current.cleanup) {
        lastReportRef.current.cleanup();
        lastReportRef.current = null;
      }
    };
  }, []);

  return useCallback(
    (element) => {
      cbElementRef.current = element;
      evaluateSubscription();
    },
    [evaluateSubscription]
  );
}
/*  The MIT License (MIT)
 Copyright 2018 Viktor Hubert <rpgmorpheus@gmail.com> */
