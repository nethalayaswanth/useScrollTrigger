import { RefCallback, RefObject } from "react";
declare type SubscriberCleanupFunction = () => void;
declare type SubscriberResponse = SubscriberCleanupFunction | void;
export default function useResolvedElement<T extends Element>(subscriber: (element: T) => SubscriberResponse, refOrElement?: T | RefObject<T> | null): RefCallback<T>;
export {};
