export class Theme {
  static darkMode: boolean = false;

  static get line(): number {
    if (this.darkMode) {
      return 0xffffff;
    } else {
      return 0;
    }
  }
}
