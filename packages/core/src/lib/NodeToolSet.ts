import { sendPostMessage } from './events/sendPostMessage';
import { setupEventListeners } from './events/setupEventListeners';

export class NodeToolSet {
  private cleanupEventListeners: (() => void) | null = null;
  private nodeProvider: HTMLElement | null;
  private selectedNode: HTMLElement | null = null;

  constructor(element?: HTMLElement | null) {
    this.nodeProvider = element || null;
    this.init();
  }

  private init(): void {
    this.cleanupEventListeners = setupEventListeners(
      (node: HTMLElement | null) => this.setSelectedNode(node)
    );
    this.bindToWindow(this);
  }

  private setSelectedNode(node: HTMLElement | null): void {
    this.selectedNode = node;
    sendPostMessage('selectedNodeChanged', node);
  }

  public getSelectedNode(): HTMLElement | null {
    return this.selectedNode;
  }

  public cleanup(): void {
    if (this.cleanupEventListeners) {
      this.cleanupEventListeners();
      this.cleanupEventListeners = null;
    }
  }

  public destroy(): void {
    this.cleanup();
  }

  public bindToWindow(instance: NodeToolSet, namespace: string = 'nodeEditUtils'): void {
    if (typeof window !== 'undefined') {
      (window as any)[namespace] = instance;
    }
  }
}
