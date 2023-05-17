export class Console {
  private _console = globalThis.console;
  private prefix: string;
  constructor(prefix: string) {
    this.prefix = prefix;
  }

  log = (...args: any[]) =>
    this._console.log(
      `%c${this.prefix}`,
      "padding:2px 4px;background:rgb(207,232,252);border-radius:3px;font-size:9px;",
      ...args
    );

  warn = (...args: any[]) =>
    this._console.warn(
      `%c${this.prefix}`,
      "padding:2px 4px;background:rgb(255, 229, 182);border-radius:3px;font-size:9px;",
      ...args
    );

  error = (...args: any[]) =>
    this._console.error(
      `%c${this.prefix}`,
      "padding:2px 4px;background:rgb(253 206 206);border-radius:3px;font-size:9px;",
      ...args
    );
}

const console = new Console("AZDO-E");
export default console;
