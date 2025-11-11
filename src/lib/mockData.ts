export const mockClubs = [
  {
    id: "1",
    name: "멋쟁이사자처럼",
    type: "major", // major: 전공, general: 일반
    category: "프로그래밍",
    department: "스마트소프트웨어학과", // 전공 동아리의 소속 학과
    adminId: "admin1", // 동아리 관리자 ID
    shortDescription: "대학생 IT 창업 동아리",
    description:
      "멋쟁이사자처럼은 전국 대학생들이 모여 웹/앱 서비스를 기획하고 개발하는 동아리입니다. 프로그래밍을 처음 접하는 학생부터 경험이 있는 학생까지 모두 환영합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1652696290920-ee4c836c711e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGUlMjBsYXB0b3B8ZW58MXx8fHwxNzYyNzI2NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    members: 45,
    tags: ["웹개발", "프론트엔드", "백엔드", "기획"],
    isRecruiting: true,
    recruitDeadline: "2025-11-20",
    activities: [
      "매주 정기 세션 진행",
      "팀 프로젝트 개발",
      "해커톤 참가",
      "네트워킹 행사",
    ],
    direction:
      "실무 중심의 웹 개발 교육과 프로젝트 기반 학습을 통해 실제 서비스 런칭을 목표로 합니다.",
    notices: [
      {
        id: "1",
        title: "2025년 1학기 신입 부원 모집 안내",
        content:
          "멋쟁이사자처럼 12기 신입 부원을 모집합니다.\n\n모집 기간: 2025.11.01 ~ 2025.11.20\n지원 자격: 프로그래밍에 관심있는 모든 학생\n\n많은 지원 바랍니다!",
        date: "2025-11-01",
        isImportant: true,
      },
      {
        id: "2",
        title: "정기 세션 일정 변경 안내",
        content:
          "다음 주 정기 세션 일정이 수요일 18:00에서 목요일 19:00로 변경되었습니다.\n장소는 동일하게 IT관 305호입니다.",
        date: "2025-11-05",
        isImportant: false,
      },
      {
        id: "3",
        title: "해커톤 참가 안내",
        content:
          "11월 25일 개최되는 대학생 해커톤에 참가 신청을 받습니다.\n관심있는 분들은 11월 15일까지 운영진에게 연락주세요.",
        date: "2025-11-08",
        isImportant: false,
      },
    ],
  },
  {
    id: "2",
    name: "로봇 동아리",
    type: "major",
    category: "공학",
    department: "기계공학과",
    adminId: "admin2",
    shortDescription: "로봇 제작 및 대회 참가",
    description:
      "로봇 설계부터 제작, 프로그래밍까지 전 과정을 경험할 수 있는 동아리입니다. 다양한 로봇 대회에 참가하며 실력을 쌓을 수 있습니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1742767069929-0c663150b164?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMHRlY2hub2xvZ3klMjBwcm9qZWN0fGVufDF8fHx8MTc2Mjc1OTI4MHww&ixlib=rb-4.1.0&q=80&w=1080",
    members: 28,
    tags: ["로봇공학", "임베디드", "하드웨어", "대회"],
    isRecruiting: true,
    recruitDeadline: "2025-11-25",
    activities: [
      "로봇 설계 및 제작",
      "프로그래밍 교육",
      "전국 대회 참가",
      "기술 세미나",
    ],
    direction:
      "로봇 공학의 이론과 실무를 모두 배우며, 국내외 로봇 대회 입상을 목표로 합니다.",
    notices: [
      {
        id: "1",
        title: "신입 부원 모집 공고",
        content:
          "로봇에 관심있는 학생들을 모집합니다.\n경험 유무 무관하며, 열정만 있다면 누구나 환영합니다!",
        date: "2025-11-03",
        isImportant: true,
      },
    ],
  },
  {
    id: "7",
    name: "전자회로 연구회",
    type: "major",
    category: "공학",
    department: "전기전자공학과",
    adminId: "admin7",
    shortDescription: "전자회로 설계 및 제작",
    description:
      "전자회로 이론부터 실습까지, PCB 설계와 제작을 통해 실무 능력을 키우는 동아리입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1742767069929-0c663150b164?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMHRlY2hub2xvZ3klMjBwcm9qZWN0fGVufDF8fHx8MTc2Mjc1OTI4MHww&ixlib=rb-4.1.0&q=80&w=1080",
    members: 22,
    tags: ["전자회로", "PCB", "설계", "제작"],
    isRecruiting: true,
    recruitDeadline: "2025-11-28",
    activities: [
      "회로 설계 교육",
      "PCB 제작 실습",
      "프로젝트 진행",
      "기업 연계 활동",
    ],
    direction:
      "전자회로 설계 실무 능력을 키우고 산업체와 연계한 프로젝트를 수행합니다.",
    notices: [],
  },
  {
    id: "8",
    name: "스마트팩토리 연구회",
    type: "major",
    category: "공학",
    department: "스마트기계공학과",
    adminId: "admin8",
    shortDescription: "스마트 제조 시스템 연구",
    description:
      "IoT, 자동화, 데이터 분석을 활용한 스마트 제조 시스템을 연구하는 동아리입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1652696290920-ee4c836c711e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9ncmFtbWluZyUyMGNvZGUlMjBsYXB0b3B8ZW58MXx8fHwxNzYyNzI2NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
    members: 18,
    tags: ["스마트팩토리", "IoT", "자동화", "데이터"],
    isRecruiting: true,
    recruitDeadline: "2025-11-26",
    activities: [
      "IoT 시스템 구축",
      "자동화 프로젝트",
      "데이터 분석",
      "산학 협력",
    ],
    direction:
      "4차 산업혁명 시대의 스마트 제조 기술을 습득하고 실무 프로젝트를 수행합니다.",
    notices: [],
  },
  {
    id: "9",
    name: "임베디드 시스템 연구회",
    type: "major",
    category: "공학",
    department: "스마트전기전자공학과",
    adminId: "admin9",
    shortDescription: "임베디드 시스템 개발",
    description:
      "ARM, RTOS 등 임베디드 시스템 개발 능력을 키우는 전공 동아리입니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1742767069929-0c663150b164?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2JvdCUyMHRlY2hub2xvZ3klMjBwcm9qZWN0fGVufDF8fHx8MTc2Mjc1OTI4MHww&ixlib=rb-4.1.0&q=80&w=1080",
    members: 25,
    tags: ["임베디드", "ARM", "RTOS", "펌웨어"],
    isRecruiting: false,
    recruitDeadline: null,
    activities: [
      "임베디드 프로그래밍",
      "RTOS 학습",
      "하드웨어 제어",
      "프로젝트 개발",
    ],
    direction:
      "임베디드 시스템의 이론과 실무를 학습하여 전문 개발자로 성장합니다.",
    notices: [],
  },
  {
    id: "3",
    name: "밴드부",
    type: "general",
    category: "음악",
    department: null,
    adminId: "admin3",
    shortDescription: "록, 팝, 재즈 등 다양한 장르",
    description:
      "음악을 사랑하는 사람들이 모여 밴드를 결성하고 정기 공연을 하는 동아리입니다. 보컬, 기타, 베이스, 드럼, 키보드 등 모든 파트를 모집합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1561264819-1ccc1c6e0ae9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMGJhbmQlMjBwZXJmb3JtYW5jZXxlbnwxfHx8fDE3NjI3NTY0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    members: 20,
    tags: ["밴드", "공연", "음악", "합주"],
    isRecruiting: true,
    recruitDeadline: "2025-11-18",
    activities: [
      "주 2회 합주 연습",
      "학기별 정기 공연",
      "외부 공연 참가",
      "레코딩 경험",
    ],
    direction:
      "음악적 완성도를 높이며 학내외 공연 무대에서 실력을 발휘하는 것을 목표로 합니다.",
    notices: [
      {
        id: "1",
        title: "정기 공연 안내",
        content:
          "12월 10일 학생회관에서 정기 공연이 열립니다.\n많은 관심 부탁드립니다!",
        date: "2025-11-07",
        isImportant: true,
      },
    ],
  },
  {
    id: "4",
    name: "댄스 동아리",
    type: "general",
    category: "예술",
    department: null,
    adminId: "admin4",
    shortDescription: "K-POP, 힙합, 현대무용",
    description:
      "다양한 장르의 댄스를 배우고 정기 공연을 통해 실력을 뽐낼 수 있는 동아리입니다. 초보자도 환영합니다!",
    imageUrl:
      "https://images.unsplash.com/photo-1698824554771-293b5dcc42db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYW5jZSUyMHBlcmZvcm1hbmNlJTIwc3RhZ2V8ZW58MXx8fHwxNzYyNzE5NTIzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    members: 35,
    tags: ["댄스", "K-POP", "공연", "안무"],
    isRecruiting: true,
    recruitDeadline: "2025-11-22",
    activities: ["주 3회 연습", "안무 창작", "정기 공연", "댄스 배틀 참가"],
    direction:
      "다양한 장르의 댄스를 경험하고 무대 위에서 최고의 퍼포먼스를 선보이는 것을 목표로 합니다.",
    notices: [],
  },
  {
    id: "5",
    name: "FC 유나이티드",
    type: "general",
    category: "스포츠",
    department: null,
    adminId: "admin5",
    shortDescription: "축구 동아리, 리그전 참가",
    description:
      "축구를 사랑하는 학우들이 모여 친목을 다지고 대학 리그전에 참가하는 동아리입니다. 실력보다는 열정을 우선합니다!",
    imageUrl:
      "https://images.unsplash.com/photo-1752681304960-bd4e018a04bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzb2NjZXIlMjB0ZWFtfGVufDF8fHx8MTc2Mjc1OTI4MHww&ixlib=rb-4.1.0&q=80&w=1080",
    members: 30,
    tags: ["축구", "스포츠", "리그전", "친목"],
    isRecruiting: false,
    recruitDeadline: null,
    activities: ["주 2회 훈련", "리그전 참가", "친선 경기", "체력 훈련"],
    direction:
      "축구를 통한 건강한 대학 생활과 팀워크를 기르는 것을 목표로 합니다.",
    notices: [],
  },
  {
    id: "6",
    name: "독서 토론회",
    type: "general",
    category: "교양",
    department: null,
    adminId: "admin6",
    shortDescription: "월 1회 독서 모임",
    description:
      "매월 선정된 도서를 읽고 깊이 있는 토론을 나누는 동아리입니다. 인문학부터 과학, 경제까지 다양한 분야를 다룹니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1709280859130-a5368e00eca8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbHViJTIwbWVldGluZyUyMHN0dWRlbnRzfGVufDF8fHx8MTc2Mjc1OTI3OXww&ixlib=rb-4.1.0&q=80&w=1080",
    members: 15,
    tags: ["독서", "토론", "인문학", "교양"],
    isRecruiting: true,
    recruitDeadline: "2025-11-30",
    activities: [
      "월 1회 독서 모임",
      "저자 초청 강연",
      "독후감 작성",
      "북 콘서트 참가",
    ],
    direction:
      "독서를 통한 지적 성장과 깊이 있는 대화를 나누는 것을 목표로 합니다.",
    notices: [],
  },
];

export const mockApplications = [
  {
    id: "1",
    clubId: "1",
    clubName: "멋쟁이사자처럼",
    applicantId: "1",
    applicantName: "홍길동",
    studentId: "20231234",
    department: "컴퓨터공학과",
    phone: "010-1234-5678",
    status: "pending", // pending, document_passed, interview_scheduled, accepted, rejected
    answers: [
      {
        question: "지원 동기를 작성해주세요.",
        answer:
          "웹 개발에 관심이 많아 지원하게 되었습니다. 프로그래밍 기초는 있지만 실제 프로젝트 경험을 쌓고 싶어 지원했습니다.",
      },
      {
        question: "개발 경험이 있나요?",
        answer:
          "학교 수업에서 Python과 Java를 배웠고, 간단한 웹사이트를 만들어본 경험이 있습니다.",
      },
    ],
    appliedAt: "2025-11-05",
    interviewSlot: null,
  },
  {
    id: "2",
    clubId: "3",
    clubName: "밴드부",
    applicantId: "1",
    applicantName: "홍길동",
    studentId: "20231234",
    department: "컴퓨터공학과",
    phone: "010-1234-5678",
    status: "accepted",
    answers: [
      {
        question: "연주할 수 있는 악기가 있나요?",
        answer: "기타를 5년 정도 연주했습니다.",
      },
    ],
    appliedAt: "2025-11-03",
    interviewSlot: "2025-11-15 15:00",
    result: {
      status: "accepted",
      message:
        "합격을 축하드립니다! 카카오톡 오픈채팅방 링크: https://open.kakao.com/example",
      decidedAt: "2025-11-08",
    },
  },
  {
    id: "3",
    clubId: "2",
    clubName: "로봇 동아리",
    applicantId: "1",
    applicantName: "홍길동",
    studentId: "20231234",
    department: "컴퓨터공학과",
    phone: "010-1234-5678",
    status: "document_passed",
    answers: [
      {
        question: "로봇에 관심을 갖게 된 계기는?",
        answer:
          "어렸을 때부터 로봇에 관심이 많았고, 직접 만들어보고 싶어서 지원했습니다.",
      },
      {
        question: "프로그래밍 경험이 있나요?",
        answer:
          "C언어와 Python을 배웠고, 아두이노로 간단한 프로젝트를 만들어본 경험이 있습니다.",
      },
    ],
    appliedAt: "2025-11-06",
    interviewSlot: null,
    documentResult: {
      status: "passed",
      message: "서류 전형에 합격하셨습니다! 아래에서 면접 일정을 선택해주세요.",
      decidedAt: "2025-11-09",
    },
  },
];

export const mockInterviewSlots = [
  {
    id: "1",
    clubId: "1",
    date: "2025-11-15",
    startTime: "14:00",
    endTime: "14:30",
    duration: 30,
    capacity: 3,
    currentCount: 2,
  },
  {
    id: "2",
    clubId: "1",
    date: "2025-11-15",
    startTime: "15:00",
    endTime: "15:30",
    duration: 30,
    capacity: 3,
    currentCount: 1,
  },
  {
    id: "3",
    clubId: "1",
    date: "2025-11-16",
    startTime: "14:00",
    endTime: "14:30",
    duration: 30,
    capacity: 3,
    currentCount: 0,
  },
  {
    id: "4",
    clubId: "2",
    date: "2025-11-18",
    startTime: "10:00",
    endTime: "10:30",
    duration: 30,
    capacity: 2,
    currentCount: 0,
  },
  {
    id: "5",
    clubId: "2",
    date: "2025-11-18",
    startTime: "11:00",
    endTime: "11:30",
    duration: 30,
    capacity: 2,
    currentCount: 0,
  },
  {
    id: "6",
    clubId: "2",
    date: "2025-11-19",
    startTime: "14:00",
    endTime: "14:30",
    duration: 30,
    capacity: 2,
    currentCount: 0,
  },
];

export const mockNotifications = [
  {
    id: "1",
    type: "recruitment",
    title: "찜한 동아리 모집 시작",
    message: "멋쟁이사자처럼에서 신규 회원을 모집합니다!",
    clubId: "1",
    isRead: false,
    createdAt: "2025-11-10 10:00",
  },
  {
    id: "2",
    type: "interview",
    title: "면접 일정 확정",
    message: "밴드부 면접이 11월 15일 15:00으로 확정되었습니다.",
    clubId: "3",
    isRead: false,
    createdAt: "2025-11-08 14:30",
  },
  {
    id: "3",
    type: "result",
    title: "합격 결과 발표",
    message: "밴드부 합격을 축하드립니다!",
    clubId: "3",
    isRead: true,
    createdAt: "2025-11-08 18:00",
  },
];

export const mockQuestions = [
  {
    id: "1",
    clubId: "1",
    question: "지원 동기를 작성해주세요.",
    order: 1,
    maxLength: 500, // 답변 글자 수 제한
  },
  {
    id: "2",
    clubId: "1",
    question: "개발 경험이 있나요? 있다면 구체적으로 설명해주세요.",
    order: 2,
    maxLength: 500,
  },
  {
    id: "3",
    clubId: "1",
    question: "동아리 활동을 통해 이루고 싶은 목표가 있나요?",
    order: 3,
    maxLength: 500,
  },
];
