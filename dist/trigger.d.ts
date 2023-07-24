export interface IntersectionOptions extends IntersectionObserverInit {
}
export interface EventCallbackProps {
    node: HTMLElement;
    entry: IntersectionObserverEntry;
    scrollingUp: boolean;
    progress: number;
}
export default class ScrollTrigger {
    private nodes;
    private visibleNodes;
    private animatingNodes;
    private observer;
    private scroller;
    private direction;
    private mounted;
    private prevYPosition;
    private scroll;
    private static readonly ROOTMARGINEXT;
    private setScrollDirection;
    private handleIntersecting;
    private updateEntries;
    private caluclatePosition;
    private update;
    initObserver({ root, ...observerOptions }: IntersectionOptions): void;
    init(observerOptions: IntersectionOptions): this;
    add({ node, ...props }: {
        node: HTMLElement;
    }): void;
    observe(element: HTMLElement): void;
    unobserve(element: HTMLElement): void;
    destroy(): void;
    observeAll(): void;
    onScroll(e?: Event): void;
}
