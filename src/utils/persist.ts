export class Persist {
  static getString(name: string, initial: string = ""): string {
    return localStorage.getItem(name) || initial;
  }

  static setString(name: string, value: string) {
    localStorage.setItem(name, value);
  }

  static getBoolean(name: string, initial: boolean = false): boolean {
    return (
      (localStorage.getItem(name) && Boolean(localStorage.getItem(name))) ||
      initial
    );
  }

  static setBoolean(name: string, value: boolean) {
    this.setString(name, String(value));
  }

  static getNumber(name: string, initial: number = 0): number {
    const result = Number(this.getString(name));
    if (!isNaN(result)) {
      return result;
    } else {
      return initial;
    }
  }

  static setNumber(name: string, value: number) {
    this.setString(name, String(value));
  }
}
