import { CanvasObserver } from "./canvas/CanvasObserver";
import { createEditTextManager } from "./edit-node-manager/createEditTextManager";
import { withRAFThrottle } from "./helpers";
import { sendPostMessage } from "./node-tools/events/sendPostMessage";
import { setupEventListener } from "./node-tools/events/setupEventListener";
import { clearHighlightFrame } from "./node-tools/highlight/clearHighlightFrame";
import { highlightNode } from "./node-tools/highlight/highlightNode";
import { refreshHighlightFrame } from "./node-tools/highlight/refreshHighlightFrame";

export class NodeTools {
  private cleanupEventListener: (() => void) | null = null;
  private cleanupCanvasObserver: (() => void) | null = null;
  private cleanupHighlightNode: (() => void) | null = null;
  private cleanupKeydownListener: (() => void) | null = null;
  private nodeProvider: HTMLElement | null;
  private selectedNode: HTMLElement | null = null;

  private editTextManager = createEditTextManager();

  private throttledHighlightFrameRefresh = withRAFThrottle(refreshHighlightFrame);

  constructor(element?: HTMLElement | null) {
    this.nodeProvider = element || null;
    this.init();
  }

  private init(): void {
    this.cleanupEventListener = setupEventListener(
      (node: HTMLElement | null) => this.setSelectedNode(node),
      this.nodeProvider,
      () => this.editTextManager.getEditableNode()
    );
    this.cleanupCanvasObserver = CanvasObserver.getInstance().subscribe(() => this.handleCanvasMutation());
    this.cleanupKeydownListener = this.setupGlobalKeydownHandler();
    this.bindToWindow(this);
  }

  private setupGlobalKeydownHandler(): () => void {
    const keydownHandler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();

        // If in edit mode, blur it first
        if (this.editTextManager.isEditing()) {
          this.editTextManager.blur();
        }

        // Clear the selection (works for both edit mode and just selected nodes)
        if (this.selectedNode) {
          this.clearHighlightFrame();
        }
      }
    };

    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }

  private setSelectedNode(node: HTMLElement | null): void {
    if (this.editTextManager.isEditing()) {
      const currentEditable = this.editTextManager.getEditableNode();
      if (currentEditable && currentEditable !== node) {
        this.editTextManager.blur();
      }
    }

    if (node) {
      this.editTextManager.edit(
        node,
        this.nodeProvider,
        (editNode) => {
          console.log("Edit mode enabled for:", editNode);
        },
        () => {
          console.log("Edit mode blurred");
        }
      );
    }

    this.selectedNode = node;
    sendPostMessage("selectedNodeChanged", node?.getAttribute("data-layer-id") ?? null);
    this.cleanupHighlightNode = highlightNode((node as HTMLElement) ?? null, this.nodeProvider as HTMLElement) ?? null;
  }

  private handleCanvasMutation(): void {
    if (this.selectedNode && this.nodeProvider) {
      this.throttledHighlightFrameRefresh(
        this.selectedNode as HTMLElement,
        this.nodeProvider as HTMLElement,
        window.canvas?.zoom.current ?? 1
      );
    }
  }

  public getSelectedNode(): HTMLElement | null {
    return this.selectedNode;
  }

  public getEditableNode(): HTMLElement | null {
    return this.editTextManager.getEditableNode();
  }

  public refreshHighlightFrame(zoom: number): void {
    this.throttledHighlightFrameRefresh(this.selectedNode as HTMLElement, this.nodeProvider as HTMLElement, zoom);
  }

  public clearHighlightFrame(): void {
    if (this.nodeProvider) {
      clearHighlightFrame(this.nodeProvider);
      this.selectedNode = null;
    }
  }

  public cleanup(): void {
    if (this.cleanupHighlightNode) {
      this.cleanupHighlightNode();
      this.cleanupHighlightNode = null;
    }
    this.throttledHighlightFrameRefresh.cleanup();
    if (this.cleanupEventListener) {
      this.cleanupEventListener();
      this.cleanupEventListener = null;
    }
    if (this.cleanupCanvasObserver) {
      this.cleanupCanvasObserver();
      this.cleanupCanvasObserver = null;
    }
    if (this.cleanupKeydownListener) {
      this.cleanupKeydownListener();
      this.cleanupKeydownListener = null;
    }

    this.editTextManager.blur();
  }

  public destroy(): void {
    this.cleanup();
  }

  public bindToWindow(instance: NodeTools, namespace: string = "nodeEditUtils"): void {
    if (typeof window !== "undefined") {
      // biome-ignore lint/suspicious/noExplicitAny: global window extension requires flexibility
      (window as any)[namespace] = instance;
    }
  }
}
