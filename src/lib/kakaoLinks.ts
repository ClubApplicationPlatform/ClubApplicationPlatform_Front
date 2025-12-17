const OPEN_CHAT_LINKS: Record<string, string> = {
  sg01: "https://open.kakao.com/o/smartgrid",
  iot01: "https://open.kakao.com/o/iotstudy",
  default: "https://open.kakao.com/o/join-us",
};

export function getOpenChatLink(clubId?: string) {
  if (!clubId) {
    return OPEN_CHAT_LINKS.default;
  }
  return OPEN_CHAT_LINKS[clubId] ?? OPEN_CHAT_LINKS.default;
}
