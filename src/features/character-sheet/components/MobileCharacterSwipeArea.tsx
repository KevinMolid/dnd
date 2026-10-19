import { useEffect, useRef, type ReactNode } from "react";
import {
  mobileSections,
  type MobileCharacterSection,
} from "./MobileCharacterNavigation";

type Props = {
  activeSection: MobileCharacterSection;
  onChange: (section: MobileCharacterSection) => void;
  children: ReactNode;
};

type TouchStart = { x: number; y: number; identifier: number };

const interactiveSelector = [
  "button",
  "input",
  "textarea",
  "select",
  "a",
  "[role='dialog']",
  "[role='listbox']",
  "[contenteditable]",
  "[data-no-swipe]",
].join(", ");

/**
 * Swipe across the visible viewport BELOW the navigation, including otherwise
 * empty page space. No overlay and no minimum height: neither can increase
 * document scroll height.
 */
const MobileCharacterSwipeArea = ({ activeSection, onChange, children }: Props) => {
  const areaRef = useRef<HTMLDivElement>(null);
  const latestRef = useRef({ activeSection, onChange });
  latestRef.current = { activeSection, onChange };

  useEffect(() => {
    let start: TouchStart | null = null;

    const isMobile = () => !window.matchMedia("(min-width: 768px)").matches;

    const withinSwipeRegion = (x: number, y: number) => {
      const node = areaRef.current;
      if (!node) return false;
      const rect = node.getBoundingClientRect();
      // The bottom is intentionally the viewport bottom, NOT the element's
      // bottom. This makes empty space swipeable without adding layout height.
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      return (
        x >= rect.left &&
        x <= rect.right &&
        y >= rect.top &&
        y <= viewportHeight
      );
    };

    const onStart = (event: TouchEvent) => {
      start = null;
      if (!isMobile() || event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!withinSwipeRegion(touch.clientX, touch.clientY)) return;
      const target = event.target;
      if (target instanceof Element && target.closest(interactiveSelector)) return;
      start = {
        x: touch.clientX,
        y: touch.clientY,
        identifier: touch.identifier,
      };
    };

    const onEnd = (event: TouchEvent) => {
      const previous = start;
      start = null;
      if (!previous || !isMobile()) return;
      const touch = Array.from(event.changedTouches).find(
        (item) => item.identifier === previous.identifier,
      );
      if (!touch) return;
      const dx = touch.clientX - previous.x;
      const dy = touch.clientY - previous.y;
      if (Math.abs(dx) < 65 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
      const { activeSection: current, onChange: change } = latestRef.current;
      const index = mobileSections.findIndex((section) => section.id === current);
      const next = mobileSections[index + (dx < 0 ? 1 : -1)];
      if (next) change(next.id);
    };

    const onCancel = () => { start = null; };

    // Document listeners also receive gestures starting on the body's empty
    // background below a short card. Passive listeners preserve native scroll.
    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchend", onEnd, { passive: true });
    document.addEventListener("touchcancel", onCancel, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onCancel);
    };
  }, []);

  return (
    <div ref={areaRef} className="lorebound-mobile-content min-w-0">
      {children}
    </div>
  );
};

export default MobileCharacterSwipeArea;
