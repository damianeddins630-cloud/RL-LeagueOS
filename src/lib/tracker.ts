const TRACKER_HOSTS = ["tracker.network", "rltracker.pro"];

export function isValidRlTrackerUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return TRACKER_HOSTS.some((host) => url.hostname.includes(host));
  } catch {
    return false;
  }
}

export function normalizeRlTrackerUrl(value: string): string {
  return value.trim();
}
