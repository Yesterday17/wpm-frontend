export class Persist {
  static getString(name: string, initial: string = ""): string {
    return localStorage.getItem(name) || initial;
  }

  static setString(name: string, value: string) {
    localStorage.setItem(name, value);
  }

  static getBoolean(name: string, initial: boolean = false): boolean {
    const str = localStorage.getItem(name);
    return (
      (str && (Number(str) === 1 || str.toLowerCase() === "true")) || initial
    );
  }

  static setBoolean(name: string, value: boolean) {
    this.setString(name, String(value));
  }

  static getNumber(name: string, initial: number = 0): number {
    const str = this.getString(name);
    const result = str === "" ? NaN : Number(str);
    if (!isNaN(result)) {
      return result;
    } else {
      return initial;
    }
  }

  static setNumber(name: string, value: number) {
    this.setString(name, String(Math.floor(value * 100) / 100));
  }
}
