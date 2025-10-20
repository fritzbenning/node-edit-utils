import { setupEventListeners } from './events/setupEventListeners';

export class NodeToolSet {
  private cleanupEventListeners: (() => void) | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    this.cleanupEventListeners = setupEventListeners();
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
}
