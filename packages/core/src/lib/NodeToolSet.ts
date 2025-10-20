import { sendPostMessage } from "./events/sendPostMessage";
import { setupEventListener } from "./events/setupEventListener";
import { setupPostMessageListener } from "./events/setupPostMessageListener";
import { highlightNode } from "./highlight/highlightNode";
import { updateHighlightFrame } from "./highlight/updateHighlightFrame";
import { updateHighlightFrameBorder } from "./highlight/updateHighlightFrameBorder";

export class NodeToolSet {
  private cleanupEventListener: (() => void) | null = null;
  private cleanupPostMessageListener: (() => void) | null = null;
  private cleanupHighlightNode: (() => void) | null = null;
  private nodeProvider: HTMLElement | null;
  private selectedNode: HTMLElement | null = null;

  constructor(element?: HTMLElement | null) {
    this.nodeProvider = element || null;
    this.init();
  }

  private init(): void {
    this.cleanupEventListener = setupEventListener((node: HTMLElement | null) => this.setSelectedNode(node), this.nodeProvider);
    this.cleanupPostMessageListener = setupPostMessageListener();
    this.bindToWindow(this);
  }

  private setSelectedNode(node: HTMLElement | null): void {
    this.selectedNode = node;
    sendPostMessage("selectedNodeChanged", node?.getAttribute("data-layer-id") ?? null);
    this.cleanupHighlightNode = highlightNode((node as HTMLElement) ?? null, this.nodeProvider as HTMLElement) ?? null;
  }

  public getSelectedNode(): HTMLElement | null {
    return this.selectedNode;
  }

  public updateHighlightFrame(): void {
    this.cleanupHighlightNode = updateHighlightFrame(this.selectedNode as HTMLElement, this.nodeProvider as HTMLElement) ?? null;
  }

  public updateHighlightFrameBorder(zoom: number): void {
    this.cleanupHighlightNode = updateHighlightFrameBorder(this.selectedNode as HTMLElement, this.nodeProvider as HTMLElement, zoom) ?? null;
  }

  public cleanup(): void {
    if (this.cleanupHighlightNode) {
      this.cleanupHighlightNode();
      this.cleanupHighlightNode = null;
    }
    if (this.cleanupEventListener) {
      this.cleanupEventListener();
      this.cleanupEventListener = null;
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
