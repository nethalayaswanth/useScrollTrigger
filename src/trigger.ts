import { clamp } from "./utils";

const ROOTMARGINEXT = 20;

export interface IntersectionOptions extends IntersectionObserverInit {}

export interface EventCallbackProps {
  node: HTMLElement;
  entry: IntersectionObserverEntry;
  scrollingUp: boolean;
  progress: number;
}

type Observer = IntersectionObserver | null;


export default class ScrollTrigger {
  private nodes = new Map<HTMLElement, any>();
  private visibleNodes = new Map<HTMLElement, IntersectionObserverEntry>();
  private animatingNodes = new Set<HTMLElement>();
  private observer: IntersectionObserver | null = null;
  private scroller: Element | Document | null | undefined = null;
  private direction: string | null = null;
  private mounted = false;
  private prevYPosition = 0;
  private scroll = true;

  private static readonly ROOTMARGINEXT = 0; // Replace this with the actual value

  private setScrollDirection(scrollTop: number) {
    if (scrollTop < this.prevYPosition) {
      this.direction = "down";
    } else {
      this.direction = "up";
    }
    this.prevYPosition = scrollTop;
  }

  private handleIntersecting(entry: IntersectionObserverEntry) {
    let target = entry.target as HTMLElement;
    if (entry.isIntersecting) {
      this.visibleNodes.set(target, entry);
      target.classList.add("trigger");
    } else {
      if (!this.direction) return;

      const scrollingUp = this.direction === "up";

      target.classList.remove("trigger");
      target.style.setProperty("--trigger", scrollingUp ? " 1" : " 0");
      target.style.setProperty(
        "--trigger-px",
        scrollingUp ? target.dataset.end ?? "0" : "0"
      );
    }
  }

  private updateEntries(entries: IntersectionObserverEntry[]) {
    this.visibleNodes = new Map();
    entries.forEach((entry) => {
      this.handleIntersecting(entry);
    });
  }

  private caluclatePosition(entry: IntersectionObserverEntry) {
     if (!entry) return [0, 0];

      var { top: elTop, height: elHeight } = entry.boundingClientRect;
      if (!entry.rootBounds) return [0, 0];
      var { height: rootHeight } = entry.rootBounds;
      var rootVisibleHeight = rootHeight - 2 * ROOTMARGINEXT;
      var start = 0;
      var end = rootVisibleHeight + elHeight;

      let target = entry.target as HTMLElement;
      if (target.dataset.start) {
        start = parseInt(target.dataset.start, 10);
      }
      if (target.dataset.end) {
        end = parseInt(target.dataset.end, 10);
      }
      var track = end - start;
      var posTop = rootVisibleHeight - elTop - start;
      var pos = posTop / track;

      return [clamp(pos, 0, 1), clamp(posTop, 0, track)];
  }

  private update() {
    this.visibleNodes.forEach((entry, node) => {
      var style = node.style;
      var id = node.id;

      const [progress, pixels] = this.caluclatePosition(entry);
      const scrollingUp = this.direction === "up";
      const { onStart, onProgress, onEnd } = this.nodes.get(node);

      if (progress > 0 && progress < 1) {
        if (!this.animatingNodes.has(node)) {
          this.animatingNodes.add(node);

          if (scrollingUp) {
            onStart({ node, entry, scrollingUp, progress });
          }
        }

        onProgress({ node, entry, scrollingUp, progress });
      } else if (progress === 0 || progress === 1) {
        if (this.animatingNodes.has(node)) {
          if (progress === 1) {
            onEnd({ node, entry, scrollingUp, progress });
          }
          this.animatingNodes.delete(node);
        }
      }

      style.setProperty("--trigger", `${progress}`);
      style.setProperty("--trigger-px", `${pixels}`);
    });
  }

  public initObserver({ root, ...observerOptions }: IntersectionOptions) {
    this.scroller = root;
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        this.updateEntries(entries);
        this.update();
      },
      { root, rootMargin: `${ScrollTrigger.ROOTMARGINEXT}px 0px`, ...observerOptions }
    );
  }

  public init(observerOptions: IntersectionOptions) {
    this.initObserver(observerOptions);
    this.observeAll();
    this.onScroll();

    return this;
  }

  public add({ node, ...props }: { node: HTMLElement }) {
    this.nodes.set(node, props);
    node.style.setProperty("--trigger", "0");
    node.style.setProperty("--trigger-px", "0");
    this.observe(node);
  }

  public observe(element: HTMLElement) {
    if (this.observer) this.observer.observe(element);
  }

  public unobserve(element: HTMLElement) {
    if (this.observer) this.observer.unobserve(element);
  }

  public destroy() {
    if (this.observer) this.observer.disconnect();
  }

  public observeAll() {
    this.nodes.forEach((value, node) => {
      this.observe(node);
    });
  }

  public onScroll(e?: Event) {
    if (e && this.mounted) {
      if (!(e.target instanceof HTMLElement || e.target instanceof Window))
        return;

      const scrollTop =
        e.target instanceof HTMLElement
          ? e.target.scrollTop
          : e.target instanceof Document
          ? e.target.documentElement.scrollTop
          : e.target instanceof Window
          ? e.target.scrollX
          : 0;
      this.mounted = true;

      this.setScrollDirection(scrollTop);
    }

    if (this.visibleNodes && this.visibleNodes.size !== 0) {
      this.visibleNodes.forEach((value, element) => {
        this.unobserve(element);
        this.observe(element);
      });
    }
  }
}

