import { TextInput } from "../pixi/PIXI.TextInput.js";
import { Container } from "../pixi/pixi.js";

export class SearchPanel extends Container {
  //
}

export const SearchBox = new TextInput({
  input: {
    fontSize: "36px",
    padding: "12px",
    width: "500px",
    color: "#26272E",
  },
  box: {
    default: {
      fill: 0xe8e9f3,
      rounded: 12,
      stroke: { color: 0xcbcee0, width: 3 },
    },
    focused: {
      fill: 0xe1e3ee,
      rounded: 12,
      stroke: { color: 0xabafc6, width: 3 },
    },
    disabled: { fill: 0xdbdbdb, rounded: 12 },
  },
});

SearchBox.placeholder = "Search...";
SearchBox.x = window.innerWidth / 2;
SearchBox.y = 80;
SearchBox.pivot.x = SearchBox.width / 2;
SearchBox.pivot.y = 0;
