export type Category = "전공 동아리" | "일반 동아리";
export type ClubStatus = "모집중" | "모집 종료";


export interface Club {
  id: string;
  name: string;
  category: Category;
  summary: string;
  status: ClubStatus;
  members: number;
  updated: string; // YYYY.MM.DD
};

