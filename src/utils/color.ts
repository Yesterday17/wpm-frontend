let div: HTMLDivElement;

interface Color {
  color: number;
  alpha: number;
}

export function randomColor(): Color {
  return {
    alpha: 1,
    color: (Math.random() * 0xffffff) << 0,
  };
}

export function color2rgba(color: string): Color {
  if (!div) {
    div = document.createElement("div");
    div.style.display = "none";
    document.body.appendChild(div);
  }

  div.style.color = color;

  const result = {
    color: 0,
    alpha: 1,
  };
  const rgb = window.getComputedStyle(div).color;
  const rgba = rgb
    .slice(rgb.indexOf("(") + 1, -1)
    .split(",")
    .map((c) => Number(c));

  result.color = rgb2hex(rgba[0], rgba[1], rgba[2]);
  if (rgba.length == 4) {
    result.alpha = rgba[3];
  }

  return result;
}

export function rgb2hex(r: number, g: number, b: number): number {
  return (r << 16) + (g << 8) + b;
}

export function color2str(c: Color): string {
  return "#" + c.color.toString(16) + Math.floor(c.alpha * 0xff).toString(16);
}
