import { Waypoint } from "../models/waypoint";

function wpFetch(
  url: string,
  method: string,
  auth: string,
  identifier: string,
  body?: Object | string
) {
  if (typeof body === "object") {
    const result = [];
    for (let key in body) {
      result.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(body[key])}`
      );
    }
    body = result.join("&");
  }

  return fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Waypoint-Auth": auth,
      "Waypoint-Identifier": identifier,
    },
    body: body as string,
  });
}

export function Patch(auth: string, dim: string, identifier: string, body) {
  return wpFetch(`dimension/${dim}`, "PATCH", auth, identifier, body);
}

export function Post(auth: string, dim: string, identifier: string, body) {
  return wpFetch(`dimension/${dim}`, "POST", auth, identifier, body);
}

export function Delete(auth: string, dim: string, identifier: string) {
  return wpFetch(`dimension/${dim}`, "DELETE", auth, identifier);
}

export async function fetchDimensions(base: string = ""): Promise<string[]> {
  return await fetch(base + "/dimension").then((d) => d.json());
}

export async function fetchDimension(
  id: string,
  base: string = ""
): Promise<Waypoint[]> {
  return await fetch(base + "/dimension/" + id)
    .then((d) => d.json())
    .then((wp) => wp.map((p) => Waypoint.from(p)));
}
