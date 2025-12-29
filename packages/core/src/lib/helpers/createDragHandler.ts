/**
 * State tracked during a drag operation
 */
export interface DragState {
  isDragging: boolean;
  hasDragged: boolean;
  startX: number;
  startY: number;
}

/**
 * Callbacks for drag operations
 */
export interface DragCallbacks {
  /**
   * Called when drag starts
   * @param event - Mouse event that started the drag
   * @param state - Current drag state
   */
  onStart?: (event: MouseEvent, state: DragState) => void;
  /**
   * Called during drag movement
   * @param event - Mouse move event
   * @param state - Current drag state with updated deltas
   */
  onDrag: (event: MouseEvent, state: DragState & { deltaX: number; deltaY: number }) => void;
  /**
   * Called when drag stops
   * @param event - Mouse event that stopped the drag
   * @param state - Final drag state
   */
  onStop?: (event: MouseEvent, state: DragState) => void;
  /**
   * Called when drag is cancelled (e.g., window blur)
   * @param state - Current drag state
   */
  onCancel?: (state: DragState) => void;
  /**
   * Called on click events to prevent default behavior
   * @param event - Click event
   * @param state - Current drag state
   */
  onPreventClick?: (event: MouseEvent, state: DragState) => void;
}

/**
 * Options for configuring the drag handler
 */
export interface DragHandlerOptions {
  /**
   * Whether to prevent default behavior on start/stop events
   * @default true
   */
  preventDefault?: boolean;
  /**
   * Whether to stop event propagation on start/stop events
   * @default true
   */
  stopPropagation?: boolean;
}

/**
 * Creates a reusable drag handler for mouse drag operations
 * @param element - Element that triggers the drag (mousedown listener attached here)
 * @param callbacks - Callbacks for drag lifecycle events
 * @param options - Configuration options
 * @returns Cleanup function to remove all event listeners
 */
export function createDragHandler(
  element: HTMLElement | SVGElement,
  callbacks: DragCallbacks,
  options: DragHandlerOptions = {}
): () => void {
  const { preventDefault = true, stopPropagation = true } = options;

  const state: DragState = {
    isDragging: false,
    hasDragged: false,
    startX: 0,
    startY: 0,
  };

  const startDrag = (event: MouseEvent): void => {
    if (preventDefault) {
      event.preventDefault();
    }
    if (stopPropagation) {
      event.stopPropagation();
    }

    state.isDragging = true;
    state.hasDragged = false;
    state.startX = event.clientX;
    state.startY = event.clientY;

    callbacks.onStart?.(event, state);
  };

  const handleDrag = (event: MouseEvent): void => {
    if (!state.isDragging) return;

    const deltaX = event.clientX - state.startX;
    const deltaY = event.clientY - state.startY;

    state.hasDragged = true;

    callbacks.onDrag(event, {
      ...state,
      deltaX,
      deltaY,
    });
  };

  const stopDrag = (event: MouseEvent): void => {
    if (!state.isDragging) return;

    if (preventDefault) {
      event.preventDefault();
    }
    if (stopPropagation) {
      event.stopPropagation();
    }

    state.isDragging = false;

    callbacks.onStop?.(event, state);
  };

  const cancelDrag = (): void => {
    if (!state.isDragging) return;

    state.isDragging = false;
    callbacks.onCancel?.(state);
  };

  const preventClick = (event: MouseEvent): void => {
    if (preventDefault) {
      event.preventDefault();
    }
    if (stopPropagation) {
      event.stopPropagation();
    }

    callbacks.onPreventClick?.(event, state);

    // Reset hasDragged flag after handling the click
    if (state.hasDragged) {
      state.hasDragged = false;
    }
  };

  // Attach event listeners
  element.addEventListener("mousedown", startDrag as EventListener);
  if (callbacks.onPreventClick) {
    element.addEventListener("click", preventClick as EventListener);
  }
  document.addEventListener("mousemove", handleDrag as EventListener);
  document.addEventListener("mouseup", stopDrag as EventListener);
  window.addEventListener("blur", cancelDrag);

  // Return cleanup function
  return () => {
    element.removeEventListener("mousedown", startDrag as EventListener);
    if (callbacks.onPreventClick) {
      element.removeEventListener("click", preventClick as EventListener);
    }
    document.removeEventListener("mousemove", handleDrag as EventListener);
    document.removeEventListener("mouseup", stopDrag as EventListener);
    window.removeEventListener("blur", cancelDrag);
  };
}
