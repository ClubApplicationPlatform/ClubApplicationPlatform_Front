📚 ClubApplicationPlatform_Front

동아리 신청·관리 플랫폼 프론트엔드
React 19 + Vite 기반으로 구축된 동아리 조회, 신청, 공지 조회, 활동 내역 관리 기능을 제공하는 웹 애플리케이션입니다.

<br>
🚀 Tech Stack
Frontend


React 19


TypeScript


Vite


React Router DOM v7


Framer Motion


Radix UI / shadcn-ui


Tailwind CSS


Lucide Icons


Axios


State Management


Zustand


Context API (일부 기능)



<br>
📸 Screenshots
이미지들은 /images 폴더에 넣고 아래처럼 연결하면 됨 👇
### 🔍 메인 동아리 리스트 화면
![club-list](./images/club_list.png)

- 검색/카테고리/유형 필터를 통한 동아리 탐색
- Radix UI + Tailwind로 구성한 깔끔한 UI

### 📄 동아리 상세 화면
![club-detail](./images/club_detail.png)

- 소개 / 공지사항 / 활동 내역 탭 전환
- 즐겨찾기(Wishlist) 기능 포함

### 📝 동아리 신청 화면
![club-apply](./images/club_apply.png)

- 사용자 정보 기반 자동 입력
- 제출 시 API 연동 및 검증 처리


<br>
🧩 Features
🏷 동아리 리스트 조회


전공/일반 필터링


키워드 검색


정렬 기능 (예: 인기순 / 최신 등록순)


📘 동아리 상세 조회


동아리 소개 / 공지 / 활동 내역


Wishlist(관심 동아리) 추가·삭제


관리자 정보 표시


📝 동아리 신청 기능


사용자 기본 정보 자동 불러오기


신청서 작성 및 제출


신청 현황 모달 조회


🔔 공지사항 / 활동 내역


동아리별 공지사항 확인


활동 내역 카드 UI



<br>
📁 Folder Structure
src/
├── components/
│   ├── ui/               # shadcn-ui 기반 공통 UI 컴포넌트
│   ├── common/           # 페이지 간 공유되는 컴포넌트
│   └── figma/            # 이미지 & 컴포넌트 모음
│
├── pages/
│   ├── ClubListPage/
│   ├── ClubDetailPage/
│   ├── MyPage/
│   └── Auth/
│
├── lib/
│   ├── mockData.ts       # mock 데이터
│   ├── api/              # axios 요청 모음
│   └── utils.ts
│
├── styles/
│   └── globals.css
│
└── main.tsx


<br>
⚙️ Getting Started
1️⃣ Install Dependencies
npm install

2️⃣ Run Dev Server
npm run dev

3️⃣ Build
npm run build


<br>
🔌 API 연결
백엔드 레포 (예: ClubApplicationPlatform_Server) 의 엔드포인트 기준으로 아래처럼 axios를 사용합니다.
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});


와이어프레임, ERD 이미지도 추가해서 더 완성도 있게 만들어줄게!
