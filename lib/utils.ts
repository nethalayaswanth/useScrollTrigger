import { MutableRefObject, LegacyRef } from "react";

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

export type Ref<T> = MutableRefObject<T> | LegacyRef<T> | undefined;
export function mergeRefs<T = any>(...refs: Ref<T>[]): React.RefCallback<T> {
  return (value) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}

export function extractSize(
  entry: ResizeObserverEntry,
  boxProp: "borderBoxSize" | "contentBoxSize" | "devicePixelContentBoxSize",
  sizeType: keyof ResizeObserverSize
): number | undefined {
  if (!entry[boxProp]) {
    if (boxProp === "contentBoxSize") {
      return entry.contentRect[sizeType === "inlineSize" ? "width" : "height"];
    }

    return undefined;
  }

  return entry[boxProp][0]
    ? entry[boxProp][0][sizeType]
    : // @ts-ignore
      entry[boxProp][sizeType];
}
