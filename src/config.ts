import { Persist } from "./utils/persist";

export class config {
  static dim: string = "0";
  static showCursorInfo: number = 1;

  static gridLineStyle: "line" | "dash" | "none" = "line";

  static auth: string = "";

  static rmenu: boolean = false;
  static edit: boolean = false;

  static load() {
    this.dim = Persist.getString("dim", "0");
    this.showCursorInfo = Persist.getNumber("showCursorInfo", 1);
    this.auth = Persist.getString("auth", "");
  }

  static persist() {
    Persist.setString("dim", this.dim);
    Persist.setString("auth", this.auth);
  }
}
