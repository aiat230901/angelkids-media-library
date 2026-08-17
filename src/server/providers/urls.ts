import type { Provider } from "@/domain/public-resource";

const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "youtu.be", "www.youtube-nocookie.com"]);

function parseHttps(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

export function validateProviderUrl(provider: Provider, value: string, heyzineHosts: string[] = []): { success: boolean; error?: string } {
  const url = parseHttps(value);
  if (!url) return { success: false, error: "URL phải sử dụng HTTPS hợp lệ." };

  if (provider === "YOUTUBE") {
    return YOUTUBE_HOSTS.has(url.hostname) && Boolean(readYouTubeId(url))
      ? { success: true }
      : { success: false, error: "URL YouTube không được hỗ trợ." };
  }
  if (provider === "GOOGLE_DRIVE") {
    return url.hostname === "drive.google.com" && /^\/drive\/folders\/[^/]+/.test(url.pathname)
      ? { success: true }
      : { success: false, error: "Cần URL thư mục Google Drive." };
  }
  return heyzineHosts.includes(url.hostname)
    ? { success: true }
    : { success: false, error: "Hostname Heyzine chưa được cho phép." };
}

function readYouTubeId(url: URL): string | null {
  const candidate = url.hostname === "youtu.be"
    ? url.pathname.split("/").filter(Boolean)[0]
    : url.pathname.startsWith("/embed/") || url.pathname.startsWith("/shorts/")
      ? url.pathname.split("/")[2]
      : url.searchParams.get("v");
  return candidate && /^[\w-]{11}$/.test(candidate) ? candidate : null;
}

export function toYouTubeEmbedUrl(value: string): string {
  const url = parseHttps(value);
  const id = url && YOUTUBE_HOSTS.has(url.hostname) ? readYouTubeId(url) : null;
  if (!id) throw new Error("URL YouTube không hợp lệ.");
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

