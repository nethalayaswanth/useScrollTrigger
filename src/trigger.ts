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

const scrollTrigger = () => {
  let nodes = new Map<HTMLElement, any>();
  let visibleNodes = new Map<HTMLElement, IntersectionObserverEntry>();
  let animatingNodes = new Set<HTMLElement>();
  let observer: Observer;
  let scroller;
  let direction: string | null = null;
  let mounted = false;
  let prevYPosition = 0;
  let scroll = true;

  const setScrollDirection = (scrollTop: number) => {
    if (scrollTop < prevYPosition) {
      direction = "down";
    } else {
      direction = "up";
    }

    prevYPosition = scrollTop;
  };

  const trigger = {
    initObserver: ({ root, ...observerOptions }: IntersectionOptions) => {
      scroller = root;
      observer = new IntersectionObserver(
        function (entries, observer) {
          // console.log(entries);
          trigger.updateEntries(entries);
          trigger.update();
        },
        { root, rootMargin: `${ROOTMARGINEXT}px 0px`, ...observerOptions }
      );
    },
    handleIntersecting: function (entry: IntersectionObserverEntry) {
      let target = entry.target as HTMLElement;
      if (entry.isIntersecting) {
        visibleNodes.set(target, entry);
        target.classList.add("trigger");
      } else {
        if (!direction) return;

        const scrollingUp = direction === "up";

        target.classList.remove("trigger");
        target.style.setProperty("--trigger", scrollingUp ? " 1" : " 0");
        target.style.setProperty(
          "--trigger-px",
          scrollingUp ? target.dataset.end ?? "0" : "0"
        );
      }
    },
    init: function (observerOptions: IntersectionOptions) {
      trigger.initObserver(observerOptions);
      trigger.observeAll();
      trigger.onScroll();

      return trigger;
    },
    add: function ({ node, ...props }: { node: HTMLElement }) {
      nodes.set(node, props);
      node.style.setProperty("--trigger", "0");
      node.style.setProperty("--trigger-px", "0");
      trigger.observe(node);
    },
    observe: function (element: HTMLElement) {
      if (observer) observer.observe(element);
    },
    unobserve: function (element: HTMLElement) {
      if (observer) observer.unobserve(element);
    },
    destroy: function () {
      if (observer) observer.disconnect();
    },
    observeAll: () => {
      nodes.forEach((value, node) => {
        trigger.observe(node);
      });
    },
    onScroll: function (e?: Event) {
      if (e && mounted) {
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
        mounted = true;

        setScrollDirection(scrollTop);
      }

      if (visibleNodes && visibleNodes.size !== 0) {
        visibleNodes.forEach(function (value, element) {
          trigger.unobserve(element);
          trigger.observe(element);
        });
      }
    },
    updateEntries: function (entries: IntersectionObserverEntry[]) {
      visibleNodes = new Map();
      entries.forEach(function (entry) {
        trigger.handleIntersecting(entry);
      });
    },

    caluclatePosition: function (entry: IntersectionObserverEntry) {
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
    },

    update: function () {
      visibleNodes.forEach((entry, node) => {
        var style = node.style;
        var id = node.id;

        const [progress, pixels] = trigger.caluclatePosition(entry);
        const scrollingUp = direction === "up";
        const { onStart, onProgress, onEnd } = nodes.get(node);

        if (progress > 0 && progress < 1) {
          if (!animatingNodes.has(node)) {
            animatingNodes.add(node);

            if (scrollingUp) {
              onStart({ node, entry, scrollingUp, progress });
            }
          }

          onProgress({ node, entry, scrollingUp, progress });
        } else if (progress === 0 || progress === 1) {
          if (animatingNodes.has(node)) {
            if (progress === 1) {
              onEnd({ node, entry, scrollingUp, progress });
            }
            animatingNodes.delete(node);
          }
        }

        style.setProperty("--trigger", `${progress}`);
        style.setProperty("--trigger-px", `${pixels}`);
      });
    }
  };
  return trigger;
};

export default scrollTrigger;
