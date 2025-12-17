import type { UserWishlist } from "./mockData";

const WISHLISTS_STORAGE_KEY = "joinus-local-wishlists";
const WISHLISTS_CHANGED_EVENT = "joinus-local-wishlists-changed";

function readWishlists(): UserWishlist[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(WISHLISTS_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as UserWishlist[];
  } catch (error) {
    console.error("Failed to read stored wishlists", error);
    return [];
  }
}

function writeWishlists(wishlists: UserWishlist[]) {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(WISHLISTS_STORAGE_KEY, JSON.stringify(wishlists));
  notifyWishlistChange();
}

function notifyWishlistChange() {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event(WISHLISTS_CHANGED_EVENT));
}

function findWishlist(userId: string, wishlists: UserWishlist[]) {
  return wishlists.find((item) => item.userId === userId);
}

export function getLocalWishlist(userId: string) {
  const wishlists = readWishlists();
  const entry = findWishlist(userId, wishlists);
  return entry ? [...entry.clubIds] : [];
}

export function toggleLocalWishlist(userId: string, clubId: string) {
  const wishlists = readWishlists();
  let entry = findWishlist(userId, wishlists);
  if (!entry) {
    entry = { userId, clubIds: [] };
    wishlists.push(entry);
  }

  const isWishlisted = entry.clubIds.includes(clubId);
  entry.clubIds = isWishlisted
    ? entry.clubIds.filter((id) => id !== clubId)
    : [...entry.clubIds, clubId];

  writeWishlists(wishlists);
  return { isWishlisted: !isWishlisted, clubIds: [...entry.clubIds] };
}

export const LOCAL_WISHLISTS_EVENT = WISHLISTS_CHANGED_EVENT;
