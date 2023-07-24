import { RefObject } from "react";
import { EventCallbackProps } from "./trigger";
declare type Register = {
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
export declare const useScrollTrigger: <T extends HTMLElement>({ root, onScroll }: {
    root?: T | RefObject<T> | null | undefined;
    onScroll?: ((e: Event) => void) | undefined;
}) => {
    register: ({ name, ref, style, ...rest }: Register) => {
        id: string;
        ref: (instance: HTMLElement | null) => void;
        style: {
            cssRules?: CSSRuleList | undefined;
            ownerRule?: CSSRule | null | undefined;
            rules?: CSSRuleList | undefined;
            addRule?: ((selector?: string | undefined, style?: string | undefined, index?: number | undefined) => number) | undefined;
            deleteRule?: ((index: number) => void) | undefined;
            insertRule?: ((rule: string, index?: number | undefined) => number) | undefined;
            removeRule?: ((index?: number | undefined) => void) | undefined;
            disabled?: boolean | undefined;
            href?: string | null | undefined;
            media?: MediaList | undefined;
            ownerNode?: Element | ProcessingInstruction | null | undefined;
            parentStyleSheet?: CSSStyleSheet | null | undefined;
            title?: string | null | undefined;
            type?: string | undefined;
        };
    };
    scrollerRef: (instance: HTMLElement | null) => void;
};
export default useScrollTrigger;
