import { useCallback, useEffect, useRef, useState } from "react";

const DEFAULT_CELL_SELECTOR = "[data-scenario-cell]";

type Options = {
  initialIndex?: number;
  cellSelector?: string;
};

export function useCenteredHorizontalScroll<T extends HTMLElement>(options: Options = {}) {
  const { initialIndex = 1, cellSelector = DEFAULT_CELL_SELECTOR } = options;
  const viewportRef = useRef<T>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const activeIndexRef = useRef(initialIndex);
  const rafRef = useRef<number | null>(null);

  const updateActiveIndex = useCallback(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const cells = viewport.querySelectorAll<HTMLElement>(cellSelector);

    if (cells.length === 0) {
      return;
    }

    const viewportRect = viewport.getBoundingClientRect();
    const viewportCenter = viewportRect.left + viewportRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cells.forEach((cell, index) => {
      const rect = cell.getBoundingClientRect();
      const cellCenter = rect.left + rect.width / 2;
      const distance = Math.abs(cellCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    if (closestIndex !== activeIndexRef.current) {
      activeIndexRef.current = closestIndex;
      setActiveIndex(closestIndex);
    }
  }, [cellSelector]);

  const scheduleActiveIndexUpdate = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      updateActiveIndex();
    });
  }, [updateActiveIndex]);

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "auto") => {
      const viewport = viewportRef.current;

      if (!viewport) {
        return;
      }

      const cells = viewport.querySelectorAll<HTMLElement>(cellSelector);
      const cell = cells[index];

      if (!cell) {
        return;
      }

      const viewportRect = viewport.getBoundingClientRect();
      const cellRect = cell.getBoundingClientRect();
      const nextLeft =
        viewport.scrollLeft + (cellRect.left - viewportRect.left) + cellRect.width / 2 - viewportRect.width / 2;

      viewport.scrollTo({ left: nextLeft, behavior });
    },
    [cellSelector],
  );

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    let pointerId: number | null = null;
    let startX = 0;
    let startScrollLeft = 0;
    let isDragging = false;

    const handlePointerDown = (event: PointerEvent) => {
      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = viewport.scrollLeft;
      isDragging = false;

      viewport.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) {
        return;
      }

      const deltaX = event.clientX - startX;

      if (!isDragging && Math.abs(deltaX) > 6) {
        isDragging = true;
      }

      if (!isDragging) {
        return;
      }

      viewport.scrollLeft = startScrollLeft - deltaX;
      scheduleActiveIndexUpdate();
      event.preventDefault();
    };

    const finishDrag = (event: PointerEvent) => {
      if (pointerId !== event.pointerId) {
        return;
      }

      if (viewport.hasPointerCapture(event.pointerId)) {
        viewport.releasePointerCapture(event.pointerId);
      }

      pointerId = null;

      if (isDragging) {
        event.preventDefault();
        scheduleActiveIndexUpdate();
        window.setTimeout(scheduleActiveIndexUpdate, 120);
      }

      isDragging = false;
    };

    const handleScroll = () => {
      scheduleActiveIndexUpdate();
    };

    const handleResize = () => {
      scrollToIndex(activeIndexRef.current, "auto");
      scheduleActiveIndexUpdate();
    };

    const frameId = window.requestAnimationFrame(() => {
      scrollToIndex(initialIndex, "auto");
      scheduleActiveIndexUpdate();
    });

    viewport.addEventListener("pointerdown", handlePointerDown);
    viewport.addEventListener("pointermove", handlePointerMove);
    viewport.addEventListener("pointerup", finishDrag);
    viewport.addEventListener("pointercancel", finishDrag);
    viewport.addEventListener("lostpointercapture", finishDrag);
    viewport.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(frameId);

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      viewport.removeEventListener("pointerdown", handlePointerDown);
      viewport.removeEventListener("pointermove", handlePointerMove);
      viewport.removeEventListener("pointerup", finishDrag);
      viewport.removeEventListener("pointercancel", finishDrag);
      viewport.removeEventListener("lostpointercapture", finishDrag);
      viewport.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [initialIndex, scheduleActiveIndexUpdate, scrollToIndex]);

  return { viewportRef, activeIndex, scrollToIndex };
}
