import { readFile } from "node:fs/promises";
import path from "node:path";
import { parseContentManifests, type ParsedCatalog } from "./validation/content-manifest";

async function readJson(name: string): Promise<unknown> {
  return JSON.parse(await readFile(path.join(process.cwd(), "content", name), "utf8"));
}

export async function loadCatalog(): Promise<ParsedCatalog> {
  const [navigation, curriculum, resources] = await Promise.all([
    readJson("navigation.json"), readJson("curriculum.json"), readJson("resources.json"),
  ]);
  const heyzineHosts = (process.env.HEYZINE_ALLOWED_HOSTS ?? "heyzine.com").split(",").map((host) => host.trim()).filter(Boolean);
  const thumbnailHosts = (process.env.THUMBNAIL_ALLOWED_HOSTS ?? "i.ytimg.com").split(",").map((host) => host.trim()).filter(Boolean);
  return parseContentManifests(navigation, curriculum, resources, heyzineHosts, thumbnailHosts);
}
