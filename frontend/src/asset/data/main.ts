export interface BoxDataProp {
  category: string;
  title: string[];
  content: string[];
}

export const studyInfos: BoxDataProp[] = [
  {
    category: "스터디 가입",
    title: ["혼자가 아닌", "같이 성장할 수 있도록"],
    content: [
      "스터디를 생성하면 스터디 코드와",
      "깃 레포지토리가 자동으로 생성돼요",
      " 스터디원들은 코드를 입력해서 스터디에 들어올 수 있어요"
    ]
  },
  {
    category: "문제 풀기",
    title: ["같은 문제를", "풀면서 같은 목표로"],
    content: [
      "스터디원이 함께 선정한 문제를",
      "제한된 시간 안에 풀면서 함께 공부할 수 있어요",
      "문제를 가장 빠르게 푼 사람 순으로 랭킹이 선정돼요"
    ]
  },
  {
    category: "문제 리뷰",
    title: ["문제에 대한 평가를", "나만의 난이도로"],
    content: [
      "문제를 다 풀고 나면",
      "나만의 난이도로 평가할 수 있어요",
      "평가는 다른 사람들이 문제를 고르는데 도움을 주고 있어요!"
    ]
  },
  {
    category: "챌린지",
    title: ["스터디원들이", "함께 일룬 발자국들"],
    content: [
      "문제를 푼 스터디원 수에 따라",
      "잔디의 색이 달라져요",
      "챌린지는 스터디 랭킹에도 반영돼요"
    ]
  },
  {
    category: "스터디 관리",
    title: ["스터디 활동을", "한 눈에 볼 수 있도록"],
    content: [
      "스터디 관리 페이지에서",
      "챌린지, 랭킹, 과제 등을 한 눈에 확인할 수 있어요"
    ]
  }
];

export const etcInfos: BoxDataProp[] = [
  {
    category: "문제 추천",
    title: ["사용자에 의한,", "사용자를 위한 문제 추천 "],
    content: [
      "푼지 오래된 유형, 취준생을 위한 문제들만",
      "쏙쏙 뽑아서 추천해주는 유용한 기능"
    ]
  },
  {
    category: "문제집",
    title: ["단 하나의 스터디만을 위한", "유일한 문제집"],
    content: [
      "스터디원들과 같이 선별한 문제를",
      "문제집에 차곡차곡 모아서 문제풀이, 과제 등에",
      "활용할 수 있어요"
    ]
  },
  {
    category: "Github 연동",
    title: ["제출한 코드를", "자동으로 Github에"],
    content: [
      "문제풀이, 과제에 제출한 코드를",
      "Github Repository에 업로드하는",
      "귀찮은 일은 저희가 할게요"
    ]
  }
];
