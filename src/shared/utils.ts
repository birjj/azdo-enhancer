export const escapeRegexString = (str: string) =>
  str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

type FullEvents<Events extends { [k: string]: (...args: any) => any }> = Omit<
  Events,
  "*"
> & {
  "*": (ev: keyof Events, ...args: any[]) => any;
};
export abstract class EventEmitter<
  Events extends { [k: string]: (...args: any) => any }
> {
  private listeners: {
    [k in keyof FullEvents<Events>]?: FullEvents<Events>[k][];
  } = {};

  addEventListener<E extends keyof FullEvents<Events>>(
    ev: E,
    listener: FullEvents<Events>[E]
  ) {
    if (!this.listeners[ev]) {
      this.listeners[ev] = [];
    }
    if (this.listeners[ev]!.indexOf(listener) !== -1) {
      return;
    }
    this.listeners[ev]!.push(listener);
  }

  removeEventListener<E extends keyof FullEvents<Events>>(
    ev: E,
    listener: FullEvents<Events>[E]
  ) {
    if (!this.listeners[ev]) {
      return;
    }
    const index = this.listeners[ev]!.indexOf(listener);
    if (index === -1) {
      return;
    }
    this.listeners[ev]!.splice(index, 1);
  }

  protected emit<E extends keyof FullEvents<Events>>(
    ev: E,
    ...args: Parameters<FullEvents<Events>[E]>
  ) {
    if (this.listeners[ev]) {
      this.listeners[ev]!.forEach((listener) => listener.apply(null, args));
    }
    if (this.listeners["*"]) {
      this.listeners["*"].forEach((listener) =>
        listener.apply(null, [ev, ...args])
      );
    }
  }

  protected destroy() {
    this.listeners = {};
  }
}
