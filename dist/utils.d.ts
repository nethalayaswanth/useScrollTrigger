import { MutableRefObject, LegacyRef } from "react";
export declare const clamp: (value: number, min: number, max: number) => number;
export declare type Ref<T> = MutableRefObject<T> | LegacyRef<T> | undefined;
export declare function mergeRefs<T = any>(...refs: Ref<T>[]): React.RefCallback<T>;
export declare function extractSize(entry: ResizeObserverEntry, boxProp: "borderBoxSize" | "contentBoxSize" | "devicePixelContentBoxSize", sizeType: keyof ResizeObserverSize): number | undefined;
