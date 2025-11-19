export interface Campus {
  id: string;
  name: string;
  shortName: string;
  heroTitle: string;
  heroDescription: string;
  emailDomains: string[];
}

export const campuses: Campus[] = [
  {
    id: "yonam",
    name: "연암공과대학교",
    shortName: "연암공대",
    heroTitle: "연암공과대학교 모든 동아리",
    heroDescription:
      "연암공과대학교 재학생을 위한 전공·일반 동아리 모집 정보를 한 곳에서 확인하세요.",
    emailDomains: ["st.yc.ac.kr", "yc.ac.kr"],
  },
  {
    id: "gnu",
    name: "경상국립대학교",
    shortName: "경상국립대",
    heroTitle: "경상국립대학교 캠퍼스 클럽",
    heroDescription:
      "경상국립대학교 학생회의 협조로 제공되는 전공, 창업, 문화 동아리 소식을 살펴보세요.",
    emailDomains: ["gnu.ac.kr", "st.gnu.ac.kr"],
  },
];

const campusById = new Map<string, Campus>();
const campusByDomain = new Map<string, Campus>();

campuses.forEach((campus) => {
  campusById.set(campus.id, campus);
  campus.emailDomains.forEach((domain) => {
    campusByDomain.set(domain.toLowerCase(), campus);
  });
});

export function getCampusById(id?: string | null): Campus | null {
  if (!id) {
    return null;
  }
  return campusById.get(id) ?? null;
}

export function getCampusByDomain(domain: string): Campus | null {
  if (!domain) {
    return null;
  }
  return campusByDomain.get(domain.toLowerCase()) ?? null;
}

export function matchCampusByEmail(email: string): Campus | null {
  if (!email.includes("@")) {
    return null;
  }
  const [, domain = ""] = email.toLowerCase().split("@");
  return getCampusByDomain(domain);
}

export function getSupportedEmailDomains(): string[] {
  return campuses.flatMap((campus) => campus.emailDomains);
}

export function getSupportedEmailSuffixHint(): string {
  return getSupportedEmailDomains()
    .map((domain) => `@${domain}`)
    .join(", ");
}
