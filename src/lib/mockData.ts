import type { Application } from "../types/application";
import type { NotificationItem } from "../types/notification";
import type { Notice } from "../types/notice";

export interface Club {
  activities: string[];
  adminId: string;
  category: string;
  department: string;
  description: string;
  direction: string;
  id: string;
  imageUrl: string;
  isRecruiting: boolean;
  members: number;
  name: string;
  notices: Notice[];
  recruitDeadline: string;
  shortDescription: string;
  tags: string[];
  type: "major" | "general";
}

export interface WishlistedProject {
  id: string;
  clubId: string;
  clubName: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  status: string;
  isRecruiting: boolean;
  thumbnail: string;
}

export const mockClubs: Club[] = [
  {
    id: "sg01",
    name: "스마트그리드 연구회",
    type: "major",
    category: "에너지/전력",
    department: "전기전자공학과",
    adminId: "sg_lead",
    shortDescription:
      "스마트그리드 핵심 기술과 국가 로드맵을 연구하는 전공 동아리",
    description:
      "스마트그리드 연구회는 스마트 전력망 전반의 구성 요소와 산업 현황을 분석하고, 국가 로드맵을 기반으로 핵심 기술을 연구하는 학술 동아리입니다. 스마트 전력·신재생·운송·소비자·전력 서비스 영역의 최신 기술을 이론과 실습으로 익힙니다.",
    imageUrl: "../../public/assets/smartGrid.png",
    members: 34,
    tags: ["스마트그리드", "에너지", "로드맵"],
    isRecruiting: true,
    recruitDeadline: "2025-11-30",
    activities: [
      "스마트그리드 구성요소 및 산업 동향 세미나",
      "국가 로드맵 핵심기술 분석 스터디",
      "모의 전력망 시뮬레이션 및 실습",
      "관련 기술 개발 미니 프로젝트",
    ],
    direction:
      "스마트그리드 인프라를 이해하고 실무에 적용 가능한 전문 지식을 축적하는 것이 목표입니다.",
    notices: [
      {
        id: "sg-notice-1",
        title: "2025년 1학기 정규 세미나 모집",
        content:
          "스마트 전력망과 스마트 transportation 트랙 중 하나를 선택하여 심화 세미나를 진행합니다.\n지원 기간: 11/01 ~ 11/20, 장소: 전기정보관 402호.",
        date: "2025-11-01",
        isImportant: true,
      },
      {
        id: "sg-notice-2",
        title: "국가 로드맵 스터디 OT",
        content:
          "국가 스마트그리드 로드맵 문서 기반 스터디 OT가 11월 7일 오후 7시에 열립니다.",
        date: "2025-11-05",
        isImportant: false,
      },
    ],
  },
  {
    id: "iot01",
    name: "IoT 연구회",
    type: "major",
    category: "임베디드/IoT",
    department: "전기전자공학과",
    adminId: "iot_lead",
    shortDescription: "사물인터넷 하드웨어·소프트웨어 융합 개발 동아리",
    description:
      "IoT 연구회는 센서와 통신, 보안 기술을 융합해 연결된 서비스를 구현합니다. Arduino 등 교육용 플랫폼으로 센서 디바이스를 직접 제작하고, 모바일 앱·네트워크·AI 분석까지 연계한 스마트홈·IoT 서비스를 실습합니다.",
    imageUrl: "../../public/assets/iotStudy.png",
    members: 41,
    tags: ["IoT", "Arduino", "네트워크"],
    isRecruiting: true,
    recruitDeadline: "2025-11-28",
    activities: [
      "C·Python 기반 임베디드 코딩 실습",
      "아두이노 H/W·S/W 개발 세션",
      "안드로이드 앱과 연동한 제어 프로젝트",
      "센서·모터 구동 및 통신 인터페이스 연구",
      "PAN/LAN 제어와 스마트홈 서비스 구현",
    ],
    direction:
      "IoT 에코시스템 전반을 이해하고 실무 수준의 구현 능력을 갖춘 엔지니어를 양성합니다.",
    notices: [
      {
        id: "iot-notice-1",
        title: "Arduino 기본 워크숍 안내",
        content:
          "신입 부원을 위한 Arduino & 센서 실습 워크숍이 11월 둘째 주에 진행됩니다. 참가 신청은 네이버 폼으로 접수합니다.",
        date: "2025-11-03",
        isImportant: true,
      },
    ],
  },
  {
    id: "ai01",
    name: "AI 인식 Lab",
    type: "major",
    category: "인공지능",
    department: "전기전자공학과",
    adminId: "ai_lead",
    shortDescription: "객체 탐지·영상 인식 프로젝트 기반 AI 연구 동아리",
    description:
      "AI 인식 Lab은 컴퓨터 비전과 딥러닝을 중심으로 객체 탐지, 영상 인식 모델을 직접 설계하고 응용 프로젝트를 수행합니다. 최신 AI 트렌드 리서치와 실무형 프로젝트를 병행해 산업에서 활용 가능한 모델을 만드는 것이 목표입니다.",
    imageUrl: "../../public/assets/aiLab.png",
    members: 29,
    tags: ["컴퓨터비전", "딥러닝", "Object Detection"],
    isRecruiting: false,
    recruitDeadline: "2025-10-31",
    activities: [
      "최신 객체 탐지 논문 리딩",
      "데이터셋 구축 및 전처리 스터디",
      "AI 모델 학습·튜닝 실습",
      "산업 응용 PoC 프로젝트",
    ],
    direction:
      "딥러닝 모델링 전 과정을 경험하며 실무에서 통용되는 컴퓨터 비전 역량을 확보합니다.",
    notices: [
      {
        id: "ai-notice-1",
        title: "Vision-Language 세션 모집",
        content:
          "영상 캡셔닝과 멀티모달 모델 실험에 참여할 인원을 11월 15일까지 모집합니다.",
        date: "2025-11-02",
        isImportant: false,
      },
    ],
  },
  {
    id: "eco01",
    name: "에코(E-CO)",
    type: "major",
    category: "친환경 모빌리티",
    department: "스마트전기전자공학과",
    adminId: "eco_lead",
    shortDescription: "친환경 전기차·발전 시스템을 연구하는 실습 중심 동아리",
    description:
      "에코(E-CO)는 친환경 자동차 및 발전 시스템을 설계·제작하는 동아리입니다. 전동 킥보드, 소형 전기차, 발전기 등을 직접 제작하며 전기전자 전공 지식을 심화합니다.",
    imageUrl: "../../public/assets/eco.png",
    members: 26,
    tags: ["전기차", "HEV/EV", "발전"],
    isRecruiting: true,
    recruitDeadline: "2025-11-22",
    activities: [
      "친환경 자동차 부품 구조 학습",
      "전동 킥보드 및 소형 전기자동차 제작",
      "풍력·수력·태양광 발전 실습",
      "자동차 전시회 참가 및 MT",
    ],
    direction:
      "전기·전자 전공 역량을 프로젝트에 적용해 친환경 모빌리티 기술을 개발합니다.",
    notices: [
      {
        id: "eco-notice-1",
        title: "전기차 구동계 집중 세미나",
        content:
          "모터·제어기·배터리 구조 심화 세미나를 11월 13일 진행합니다. 실습 장비 인원 제한으로 사전 신청 필수입니다.",
        date: "2025-11-06",
        isImportant: true,
      },
    ],
  },
  {
    id: "epl01",
    name: "EPL",
    type: "major",
    category: "임베디드 시스템",
    department: "스마트전기전자공학과",
    adminId: "epl_lead",
    shortDescription: "ARM 기반 임베디드 프로세서를 연구하는 전공 동아리",
    description:
      "EPL은 ARM 기반 SoC 구조와 임베디드 소프트웨어를 연구합니다. 하드웨어 기초부터 FreeRTOS 포팅까지 전 과정을 다루며 산업체에서 요구하는 실무 능력을 키웁니다.",
    imageUrl: "../../public/assets/epl.png",
    members: 31,
    tags: ["ARM", "임베디드", "RTOS"],
    isRecruiting: true,
    recruitDeadline: "2025-12-05",
    activities: [
      "ARM 기반 SoC 분석 세미나",
      "Board Schematic 학습",
      "Device Driver / Application 개발",
      "FreeRTOS 포팅 프로젝트",
    ],
    direction:
      "임베디드 하드웨어와 소프트웨어를 아우르는 커리큘럼으로 실전 시스템 개발 경험을 제공합니다.",
    notices: [
      {
        id: "epl-notice-1",
        title: "FreeRTOS 실습 조 편성",
        content:
          "겨울방학 FreeRTOS 집중 캠프 참가자를 모집합니다. 11월 18일까지 신청해주세요.",
        date: "2025-11-09",
        isImportant: false,
      },
    ],
  },
  {
    id: "pecs01",
    name: "Power & Energy Control System (PECS)",
    type: "major",
    category: "에너지 제어",
    department: "스마트전기전자공학과",
    adminId: "pecs_lead",
    shortDescription: "전력 시스템 제어 알고리즘과 시뮬레이션 연구 동아리",
    description:
      "PECS는 전력 설비 제어 알고리즘, 디지털 보호계전기, HVDC/MVDC/LVDC 그리드 모델링을 연구하며 실시간 시뮬레이터로 제어 로직을 검증합니다.",
    imageUrl: "../../public/assets/pecs.png",
    members: 24,
    tags: ["전력제어", "HVDC", "시뮬레이션"],
    isRecruiting: false,
    recruitDeadline: "2025-10-15",
    activities: [
      "재생에너지 연계 전력망 해석",
      "디지털 보호계전기 알고리즘 개발",
      "전압 등급별 DC 그리드 모델링",
      "실시간 시뮬레이터 기반 검증",
    ],
    direction:
      "전력·에너지 그리드 제어 이론과 실습을 통합하여 새로운 제어 기법을 제안합니다.",
    notices: [
      {
        id: "pecs-notice-1",
        title: "실시간 시뮬레이터 점검",
        content:
          "11월 셋째 주 장비 점검으로 Evening Session 일정이 변경됩니다.",
        date: "2025-11-04",
        isImportant: false,
      },
    ],
  },
  {
    id: "catia01",
    name: "CATIA",
    type: "major",
    category: "기계 설계",
    department: "기계공학과",
    adminId: "catia_lead",
    shortDescription: "CATIA 기반 3D 설계·제작 프로젝트 동아리",
    description:
      "CATIA 동아리는 CATIA를 활용한 3D 모델링과 도면 설계를 중심으로 작품을 제작하며 실무 설계 프로세스를 학습합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    members: 27,
    tags: ["CATIA", "3D설계", "프로토타입"],
    isRecruiting: true,
    recruitDeadline: "2025-11-18",
    activities: [
      "3D 모델링 워크숍",
      "설계 검토 및 피드백 세션",
      "산업체 과제 기반 작품 제작",
    ],
    direction:
      "설계 툴 숙련도 향상과 팀 기반 작품 제작 경험을 동시에 확보합니다.",
    notices: [
      {
        id: "catia-notice-1",
        title: "3D 설계 부문 전시 준비",
        content: "12월 전시회를 대비해 중간 점검 리뷰를 11월 20일 진행합니다.",
        date: "2025-11-10",
        isImportant: true,
      },
    ],
  },
  {
    id: "pneu01",
    name: "유공압",
    type: "major",
    category: "기계 시스템",
    department: "기계공학과",
    adminId: "pneu_lead",
    shortDescription: "유공압 장치를 활용한 작품 제작 프로젝트 동아리",
    description:
      "유공압 동아리는 공압·유압 요소 설계와 제어를 배우고 이를 적용한 작품 제작 프로젝트를 수행합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    members: 22,
    tags: ["유공압", "모션제어", "프로토타입"],
    isRecruiting: true,
    recruitDeadline: "2025-11-24",
    activities: [
      "유공압 회로 설계 스터디",
      "소규모 자동화 장치 제작",
      "산업체 연계 작품 발표",
    ],
    direction:
      "산업용 공압장비 설계를 실습하며 프로젝트 기획·제작 능력을 기릅니다.",
    notices: [
      {
        id: "pneu-notice-1",
        title: "공압제어 기본 교육",
        content:
          "신입 부원을 위한 공압 실습 교육을 11월 16일 기계관 실험실에서 진행합니다.",
        date: "2025-11-08",
        isImportant: false,
      },
    ],
  },
  {
    id: "project01",
    name: "프로젝트",
    type: "major",
    category: "기계 응용",
    department: "기계공학과",
    adminId: "project_lead",
    shortDescription: "기계공학 주제를 탐색하고 제작하는 실험 동아리",
    description:
      "프로젝트 동아리는 기계공학 전반의 주제를 정해 소규모 팀으로 탐색하고 시제품을 제작합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    members: 25,
    tags: ["기계설계", "시제품", "탐색"],
    isRecruiting: true,
    recruitDeadline: "2025-11-21",
    activities: [
      "주제 탐색 워크숍",
      "설계-제작-테스트 전 과정 실습",
      "학기말 성과 전시 참가",
    ],
    direction:
      "현장 문제를 자체 프로젝트로 정의하고 해결하는 전공 심화 경험을 제공합니다.",
    notices: [
      {
        id: "project-notice-1",
        title: "동계 캡스톤 주제 제안",
        content: "겨울방학 제작 주제를 11월 25일까지 Slack에 제출해주세요.",
        date: "2025-11-11",
        isImportant: false,
      },
    ],
  },
  {
    id: "mech01",
    name: "메커니즘",
    type: "major",
    category: "모션/공압",
    department: "기계공학과",
    adminId: "mechanism_lead",
    shortDescription: "공압장비 이해와 이동장비 제작을 목표로 하는 동아리",
    description:
      "메커니즘 동아리는 공압장비 구조를 학습하고 소규모 이동장비를 직접 제작합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1465153690352-10c1b29577f8?auto=format&fit=crop&w=1200&q=80",
    members: 19,
    tags: ["공압", "메커니즘", "모빌리티"],
    isRecruiting: false,
    recruitDeadline: "2025-09-30",
    activities: [
      "공압 구성품 분해/조립 실습",
      "미니 이동장비 제작 프로젝트",
      "제어 로직 튜닝 워크숍",
    ],
    direction: "기계 동역학 이해를 바탕으로 실제 움직이는 장비를 구현합니다.",
    notices: [
      {
        id: "mech-notice-1",
        title: "가을 전시 준비",
        content:
          "프로토타입 시험 주행 일정이 11월 14일에 있습니다. 참가 팀은 파워팩을 점검해 주세요.",
        date: "2025-11-07",
        isImportant: true,
      },
    ],
  },
  {
    id: "autocad01",
    name: "AutoCAD",
    type: "major",
    category: "CAD",
    department: "기계공학과",
    adminId: "autocad_lead",
    shortDescription: "AutoCAD 고급 명령어 학습과 세미나 진행 동아리",
    description:
      "AutoCAD 동아리는 Advanced 명령어와 실무 도면 작성 노하우를 학습하며 정기 세미나를 진행합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
    members: 20,
    tags: ["AutoCAD", "도면", "세미나"],
    isRecruiting: true,
    recruitDeadline: "2025-12-01",
    activities: [
      "Advanced 명령어 실습",
      "실무 사례 세미나",
      "도면 리뷰 및 피드백",
    ],
    direction: "CAD 실무 감각을 키워 다양한 분야에 적용합니다.",
    notices: [
      {
        id: "autocad-notice-1",
        title: "12월 세미나 발표자 모집",
        content: "외부 전문가 초청 세미나 발표자를 11월 22일까지 모집합니다.",
        date: "2025-11-12",
        isImportant: false,
      },
    ],
  },
  {
    id: "flow01",
    name: "흐름",
    type: "major",
    category: "열유체",
    department: "기계공학과",
    adminId: "flow_lead",
    shortDescription: "유체역학·열전달 기반 공정 개선을 연구하는 동아리",
    description:
      "흐름 동아리는 실험과 시뮬레이션을 통해 유체 제어, 열 관리, 공정 개선 아이디어를 탐구합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    members: 18,
    tags: ["유체", "열전달", "시뮬레이션"],
    isRecruiting: true,
    recruitDeadline: "2025-11-19",
    activities: [
      "유체 실험 장비 운용",
      "열·유동 해석 시뮬레이션",
      "공정 개선 아이디어 발표",
    ],
    direction:
      "이론과 실험을 병행하여 산업 현장의 흐름 제어 문제를 해결합니다.",
    notices: [
      {
        id: "flow-notice-1",
        title: "열유동 실험실 안전 교육",
        content: "신입 부원 대상 안전 교육을 11월 15일에 실시합니다.",
        date: "2025-11-05",
        isImportant: true,
      },
    ],
  },
  {
    id: "analysis01",
    name: "해석으로 대동단결",
    type: "major",
    category: "CAE/해석",
    department: "스마트기계공학과",
    adminId: "analysis_lead",
    shortDescription: "ANSYS 기반 구조·유체 해석 역량을 키우는 동아리",
    description:
      "해석으로 대동단결은 유한요소법과 전산유체역학 기본 교육을 바탕으로 구조·유체 해석 프로젝트를 진행합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80",
    members: 30,
    tags: ["ANSYS", "FEM", "해석"],
    isRecruiting: true,
    recruitDeadline: "2025-11-26",
    activities: [
      "정기 모임 및 실습",
      "ANSYS 구조 해석 교육",
      "실무형 해석 프로젝트",
      "연말 전시회 참가",
    ],
    direction:
      "해석 도구를 활용한 설계 검증 능력을 갖추어 산업 현장 대응력을 높입니다.",
    notices: [
      {
        id: "analysis-notice-1",
        title: "ANSYS 기본반 개강",
        content:
          "초급반이 11월 18일 개강합니다. 노트북에 라이선스 설치 바랍니다.",
        date: "2025-11-09",
        isImportant: false,
      },
    ],
  },
  {
    id: "nano01",
    name: "나노 메카",
    type: "major",
    category: "미세공정",
    department: "스마트기계공학과",
    adminId: "nano_lead",
    shortDescription:
      "반도체·디스플레이·이차전지 공정을 연구하는 미세 가공 동아리",
    description:
      "나노 메카는 반도체 8대 공정, 디스플레이, 이차전지 기술을 학습하고 비전통적 가공법 실습을 통해 제품 개발 프로젝트를 수행합니다.",
    imageUrl:
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1200&q=80",
    members: 23,
    tags: ["반도체", "디스플레이", "미세가공"],
    isRecruiting: true,
    recruitDeadline: "2025-12-03",
    activities: [
      "이론 세미나",
      "미세 형상 제작 실습",
      "공정 장비 활용 프로젝트",
      "전시회 출품",
    ],
    direction:
      "첨단 제조 공정에 대한 이론과 실습을 통합해 실무 역량을 확보합니다.",
    notices: [
      {
        id: "nano-notice-1",
        title: "클린룸 견학 안내",
        content:
          "디스플레이 공정 장비 견학이 11월 27일 예정입니다. 방진복 사이즈를 조사 중입니다.",
        date: "2025-11-13",
        isImportant: true,
      },
    ],
  },
  {
    id: "triples01",
    name: "TripleS",
    type: "major",
    category: "소프트웨어",
    department: "스마트소프트웨어학과",
    adminId: "triples_lead",
    shortDescription: "팀 프로젝트와 해커톤으로 함께 성장하는 개발 동아리",
    description:
      "TripleS는 실무형 팀 프로젝트와 각종 경진대회 참가를 통해 개발 실력을 끌어올리는 동아리입니다. 선후배가 함께하며 취업에 도움이 되는 포트폴리오를 만듭니다.",
    imageUrl: "../../public/assets/tripleS.png",
    members: 38,
    tags: ["팀프로젝트", "해커톤", "취업"],
    isRecruiting: true,
    recruitDeadline: "2025-11-29",
    activities: ["정기 팀 프로젝트", "경진대회·해커톤 참가", "선후배 멘토링"],
    direction:
      "함께 성장하는 문화 속에서 실무 중심 프로젝트 경험을 축적합니다.",
    notices: [
      {
        id: "triples-notice-1",
        title: "겨울 해커톤 준비 모임",
        content: "12월 예정인 교내 해커톤 대비 모임을 11월 17일에 진행합니다.",
        date: "2025-11-08",
        isImportant: true,
      },
    ],
  },
  {
    id: "openai01",
    name: "OpenAI",
    type: "major",
    category: "인공지능",
    department: "스마트소프트웨어학과",
    adminId: "openai_lead",
    shortDescription: "오픈소스를 활용해 AI 애플리케이션을 개발하는 동아리",
    description:
      "OpenAI 동아리는 오픈소스 프레임워크를 활용해 AI·컴퓨터비전 기술을 학습하고 응용합니다. 학기 말에는 프로젝트를 경진대회에 출품합니다.",
    imageUrl: "../../public/assets/openAi.png",
    members: 33,
    tags: ["AI", "오픈소스", "컴퓨터비전"],
    isRecruiting: true,
    recruitDeadline: "2025-11-25",
    activities: [
      "AI 오픈소스 스터디",
      "프로젝트 기반 애플리케이션 개발",
      "전공동아리 공모전 참가",
    ],
    direction:
      "AI 기술을 실서비스로 구현하는 과정을 반복해 실무 역량을 확보합니다.",
    notices: [
      {
        id: "openai-notice-1",
        title: "Vision Camp 참가자 모집",
        content: "컴퓨터비전 심화 캠프 신청은 11월 16일까지 받습니다.",
        date: "2025-11-05",
        isImportant: false,
      },
    ],
  },
  {
    id: "erpro01",
    name: "ERPro",
    type: "major",
    category: "ERP/비즈니스",
    department: "스마트소프트웨어학과",
    adminId: "erpro_lead",
    shortDescription: "SAP·ERPSIM 중심의 실무 역량을 기르는 ERP 동아리",
    description:
      "ERPro는 SAP, ERPSIM, ABAP 프로젝트와 자격증 스터디를 통해 ERP 전문가로 성장하는 것을 목표로 합니다.",
    imageUrl: "../../public/assets/erpro.png",
    members: 28,
    tags: ["SAP", "ERP", "ABAP"],
    isRecruiting: false,
    recruitDeadline: "2025-10-20",
    activities: [
      "SAP 모듈 스터디",
      "ERPSIM 시뮬레이션",
      "ABAP 프로젝트",
      "자격증 스터디",
    ],
    direction:
      "기업 실무에 필요한 ERP 프로세스 이해와 개발 역량을 동시에 갖춥니다.",
    notices: [
      {
        id: "erpro-notice-1",
        title: "SAP 인증 대비반",
        content:
          "겨울 자격증 대비반을 준비합니다. 신청자는 11월 12일까지 구글폼 제출!",
        date: "2025-11-04",
        isImportant: true,
      },
    ],
  },
  {
    id: "digital01",
    name: "Digital Playground",
    type: "major",
    category: "실전 프로젝트",
    department: "스마트소프트웨어학과",
    adminId: "digital_lead",
    shortDescription: "최신 기술로 자유롭게 실전 프로젝트를 수행하는 동아리",
    description:
      "Digital Playground는 웹/앱, AI, 프론트엔드 프레임워크 등 최신 기술을 즐겁게 실험하며 실전 프로젝트를 수행합니다. 정기 스터디, 외부 세미나, 멘토링으로 역량을 확장하고 공모전에 도전합니다.",
    imageUrl: "../../public/assets/digitalPlayground.png",
    members: 36,
    tags: ["웹앱", "AI", "프로젝트"],
    isRecruiting: true,
    recruitDeadline: "2025-12-10",
    activities: [
      "최신 기술 스터디",
      "팀 프로젝트 기획·구현",
      "외부 세미나 및 멘토링",
      "공모전/경진대회 출전",
    ],
    direction:
      "기술을 즐기는 문화를 바탕으로 실전 프로젝트 경험과 트렌드 적응력을 갖춘 개발자로 성장합니다.",
    notices: [
      {
        id: "digital-notice-1",
        title: "창의 프로젝트 제안서 접수",
        content:
          "학기말 전시를 위한 창의 프로젝트 제안서를 11월 24일까지 제출하세요.",
        date: "2025-11-10",
        isImportant: false,
      },
    ],
  },
];

export const mockWishlistedProjects: WishlistedProject[] = [
  {
    id: "wish-proj-1",
    clubId: "digital01",
    clubName: "Digital Playground",
    title: "AI 멀티모달 협업 노트",
    category: "실전 프로젝트",
    description:
      "AI 요약과 태깅으로 팀 기록을 자동 정리하는 협업 노트 서비스를 함께 만들고 있어요.",
    tags: ["AI", "웹앱", "협업"],
    status: "팀 매칭 중",
    isRecruiting: true,
    thumbnail: "../../public/assets/digitalPlayground.png",
  },
  {
    id: "wish-proj-2",
    clubId: "ai01",
    clubName: "AI 인식 Lab",
    title: "실시간 객체 인식 키오스크",
    category: "AI/컴퓨터비전",
    description:
      "Edge 디바이스에서 구동되는 실시간 객체 인식 키오스크를 위한 추론 엔진을 개발합니다.",
    tags: ["Computer Vision", "Edge", "서비스"],
    status: "데모 준비 중",
    isRecruiting: true,
    thumbnail: "../../public/assets/aiLab.png",
  },
  {
    id: "wish-proj-3",
    clubId: "triples01",
    clubName: "TripleS",
    title: "캠퍼스 라이프 캘린더",
    category: "팀 프로젝트",
    description:
      "학내 행사와 공지를 통합 관리하는 모바일 캘린더 앱을 React Native로 제작합니다.",
    tags: ["모바일", "React Native", "UX"],
    status: "디자인 검토 중",
    isRecruiting: false,
    thumbnail: "../../public/assets/tripleS.png",
  },
];

export const mockApplications: Application[] = [
  {
    id: "app-1",
    clubId: "sg01",
    clubName: "스마트그리드 연구회",
    applicantId: "stu-2025001",
    applicantName: "김하늘",
    studentId: "20251234",
    department: "전기전자공학과",
    phone: "010-1111-2222",
    status: "pending",
    answers: [
      {
        question: "스마트그리드 로드맵 중 관심 있는 분야는 무엇인가요?",
        answer:
          "스마트 소비자 분야에서 수요 반응 제어를 연구하고 싶습니다. 에너지 데이터를 분석해 맞춤형 제어를 구현해 보고자 합니다.",
      },
    ],
    appliedAt: "2025-11-05",
    interviewSlot: null,
    documentResult: {
      status: "passed",
      message: "서류 합격을 축하합니다! 인터뷰 가능한 일정을 선택해 주세요.",
      decidedAt: "2025-11-09",
    },
  },
  {
    id: "app-2",
    clubId: "iot01",
    clubName: "IoT 연구회",
    applicantId: "stu-2025002",
    applicantName: "박서준",
    studentId: "20252345",
    department: "전기전자공학과",
    phone: "010-3333-4444",
    status: "accepted",
    answers: [
      {
        question: "IoT 서비스를 구현하며 기대하는 역량은?",
        answer:
          "센서에서 수집한 데이터를 앱·클라우드까지 연동하는 풀스택 IoT 경험을 쌓고 싶습니다.",
      },
    ],
    appliedAt: "2025-11-02",
    interviewSlot: "2025-11-14 16:00",
    result: {
      status: "accepted",
      message:
        "최종 합격을 축하합니다! 11월 18일 오후 7시에 진행되는 오리엔테이션에 참석해주세요.",
      decidedAt: "2025-11-08",
    },
  },
  {
    id: "app-3",
    clubId: "triples01",
    clubName: "TripleS",
    applicantId: "stu-2025003",
    applicantName: "이가은",
    studentId: "20257890",
    department: "스마트소프트웨어학과",
    phone: "010-5555-6666",
    status: "document_passed",
    answers: [
      {
        question: "협업 프로젝트에서 맡고 싶은 역할은?",
        answer:
          "프론트엔드 리드 역할을 맡아 사용자 경험을 설계하고 싶습니다. 해커톤 경험을 공유하며 팀에 기여하겠습니다.",
      },
    ],
    appliedAt: "2025-11-06",
    interviewSlot: null,
    documentResult: {
      status: "passed",
      message: "서류 합격입니다. 면접 가능 시간을 캘린더에 표시해 주세요.",
      decidedAt: "2025-11-10",
    },
  },
];

export const mockInterviewSlots = [
  {
    id: "slot-1",
    clubId: "sg01",
    date: "2025-11-15",
    startTime: "14:00",
    endTime: "14:30",
    duration: 30,
    capacity: 4,
    currentCount: 3,
  },
  {
    id: "slot-2",
    clubId: "sg01",
    date: "2025-11-15",
    startTime: "15:00",
    endTime: "15:30",
    duration: 30,
    capacity: 4,
    currentCount: 2,
  },
  {
    id: "slot-3",
    clubId: "iot01",
    date: "2025-11-14",
    startTime: "16:00",
    endTime: "16:30",
    duration: 30,
    capacity: 3,
    currentCount: 1,
  },
  {
    id: "slot-4",
    clubId: "iot01",
    date: "2025-11-14",
    startTime: "17:00",
    endTime: "17:30",
    duration: 30,
    capacity: 3,
    currentCount: 0,
  },
  {
    id: "slot-5",
    clubId: "triples01",
    date: "2025-11-18",
    startTime: "19:00",
    endTime: "19:30",
    duration: 30,
    capacity: 5,
    currentCount: 4,
  },
  {
    id: "slot-6",
    clubId: "triples01",
    date: "2025-11-18",
    startTime: "20:00",
    endTime: "20:30",
    duration: 30,
    capacity: 5,
    currentCount: 2,
  },
];

export const mockNotifications: NotificationItem[] = [
  {
    id: "noti-1",
    type: "recruitment",
    title: "스마트그리드 연구회 모집",
    message: "스마트 전력망 심화 세미나 참여자를 11/20까지 모집합니다.",
    clubId: "sg01",
    isRead: false,
    createdAt: "2025-11-10 10:00",
  },
  {
    id: "noti-2",
    type: "interview",
    title: "IoT 연구회 면접 일정 안내",
    message: "면접 일정 선택 마감이 11/13 23:00이니 잊지 마세요.",
    clubId: "iot01",
    isRead: false,
    createdAt: "2025-11-09 14:30",
  },
  {
    id: "noti-3",
    type: "result",
    title: "TripleS 최종 결과 발표",
    message: "TripleS 2025 겨울 프로젝트 팀 최종 합격자를 확인하세요.",
    clubId: "triples01",
    isRead: true,
    createdAt: "2025-11-08 18:00",
  },
];

export const mockQuestions = [
  {
    id: "q-1",
    clubId: "sg01",
    question:
      "스마트그리드 연구에서 관심 있는 로드맵 분야와 이유를 작성해주세요.",
    order: 1,
    maxLength: 500,
  },
  {
    id: "q-2",
    clubId: "sg01",
    question: "에너지 데이터를 활용해 해결하고 싶은 문제는 무엇인가요?",
    order: 2,
    maxLength: 500,
  },
  {
    id: "q-3",
    clubId: "triples01",
    question:
      "협업 프로젝트 경험 중 가장 기억에 남는 사례와 역할을 공유해주세요.",
    order: 1,
    maxLength: 600,
  },
];
