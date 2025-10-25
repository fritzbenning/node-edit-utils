import { sendPostMessage } from "./events/sendPostMessage";
import { setupCanvasObserver } from "./events/setupCanvasObserver";
import { setupEventListener } from "./events/setupEventListener";
import { clearHighlightFrame } from "./highlight/clearHighlightFrame";
import { withRAFThrottle } from "./highlight/helpers/withRAF";
import { highlightNode } from "./highlight/highlightNode";
import { updateHighlightFrame } from "./highlight/updateHighlightFrame";

export class NodeToolSet {
  private cleanupEventListener: (() => void) | null = null;
  private cleanupCanvasObserver: (() => void) | null = null;
  private cleanupHighlightNode: (() => void) | null = null;
  private nodeProvider: HTMLElement | null;
  private selectedNode: HTMLElement | null = null;

  private throttledHighlightFrameUpdate = withRAFThrottle(updateHighlightFrame);

  constructor(element?: HTMLElement | null) {
    this.nodeProvider = element || null;
    this.init();
  }

  private init(): void {
    this.cleanupEventListener = setupEventListener((node: HTMLElement | null) => this.setSelectedNode(node), this.nodeProvider);
    // this.cleanupPostMessageListener = setupPostMessageListener();
    this.cleanupCanvasObserver = setupCanvasObserver(() => this.handleCanvasMutation());
    this.bindToWindow(this);
  }

  private setSelectedNode(node: HTMLElement | null): void {
    this.selectedNode = node;
    sendPostMessage("selectedNodeChanged", node?.getAttribute("data-layer-id") ?? null);
    this.cleanupHighlightNode = highlightNode((node as HTMLElement) ?? null, this.nodeProvider as HTMLElement) ?? null;
  }

  private handleCanvasMutation(): void {
    if (this.selectedNode && this.nodeProvider) {
      this.throttledHighlightFrameUpdate(
        this.selectedNode as HTMLElement,
        this.nodeProvider as HTMLElement,
        window.canvas?.zoom.current ?? 1
      );
    }
  }

  public getSelectedNode(): HTMLElement | null {
    return this.selectedNode;
  }

  public updateHighlightFrame(zoom: number): void {
    this.throttledHighlightFrameUpdate(this.selectedNode as HTMLElement, this.nodeProvider as HTMLElement, zoom);
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
    this.throttledHighlightFrameUpdate.cleanup();
    if (this.cleanupEventListener) {
      this.cleanupEventListener();
      this.cleanupEventListener = null;
    }
    // if (this.cleanupPostMessageListener) {
    //   this.cleanupPostMessageListener();
    //   this.cleanupPostMessageListener = null;
    // }
    if (this.cleanupCanvasObserver) {
      this.cleanupCanvasObserver();
      this.cleanupCanvasObserver = null;
    }
  }

  public destroy(): void {
    this.cleanup();
  }

  public bindToWindow(instance: NodeToolSet, namespace: string = "nodeEditUtils"): void {
    if (typeof window !== "undefined") {
      (window as any)[namespace] = instance;
    }
  }
}
