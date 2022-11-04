export type ProblemProps = {
  problem_id: number;
  problem_name: string;
  problem_solved: boolean[];
};
export type UserProps = {
  user_id: number;
  user_name: string;
  problem_cnt: number;
};
type DataProps = {
  problems: ProblemProps[];
  users: UserProps[];
  deadline: string[];
};

type DataArrProps = {
  inProgress: boolean;
  subjects: DataProps[];
};

export const data: DataProps = {
  problems: [
    {
      problem_id: 100,
      problem_name: "문제이름",
      problem_solved: [true, false, false, true, true, false]
    },
    {
      problem_id: 101,
      problem_name: "문제이름",
      problem_solved: [true, true, true, false, false, false]
    },
    {
      problem_id: 102,
      problem_name: "문제이름",
      problem_solved: [false, true, true, false, true, false]
    },
    {
      problem_id: 103,
      problem_name: "문제이름",
      problem_solved: [true, false, false, false, true, false]
    },
    {
      problem_id: 104,
      problem_name: "문제이름",
      problem_solved: [true, false, false, true, true, true]
    }
  ],
  users: [
    {
      user_id: 1,
      user_name: "김윤민",
      problem_cnt: 3
    },
    {
      user_id: 2,
      user_name: "김윤민",
      problem_cnt: 4
    },
    {
      user_id: 3,
      user_name: "김윤민",
      problem_cnt: 1
    },
    {
      user_id: 4,
      user_name: "김윤민",
      problem_cnt: 2
    },
    {
      user_id: 5,
      user_name: "김윤민",
      problem_cnt: 3
    },
    {
      user_id: 6,
      user_name: "김윤민",
      problem_cnt: 3
    }
  ],
  deadline: ["2022-12-12", "2022-12-20"]
};

// export const data: DataArrProps = {
//   inProgress: false,
//   subjects: [
//     {
//       problems: [
//         {
//           problem_id: 100,
//           problem_name: "문제이름",
//           problem_solved: [true, false, false, true, true, false]
//         },
//         {
//           problem_id: 101,
//           problem_name: "문제이름",
//           problem_solved: [true, true, true, false, false, false]
//         },
//         {
//           problem_id: 102,
//           problem_name: "문제이름",
//           problem_solved: [false, true, true, false, true, false]
//         },
//         {
//           problem_id: 103,
//           problem_name: "문제이름",
//           problem_solved: [true, false, false, false, true, false]
//         },
//         {
//           problem_id: 104,
//           problem_name: "문제이름",
//           problem_solved: [true, false, false, true, true, true]
//         }
//       ],
//       users: [
//         {
//           user_id: 1,
//           user_name: "김윤민",
//           problem_cnt: 3
//         },
//         {
//           user_id: 2,
//           user_name: "김윤민",
//           problem_cnt: 4
//         },
//         {
//           user_id: 3,
//           user_name: "김윤민",
//           problem_cnt: 1
//         },
//         {
//           user_id: 4,
//           user_name: "김윤민",
//           problem_cnt: 2
//         },
//         {
//           user_id: 5,
//           user_name: "김윤민",
//           problem_cnt: 3
//         },
//         {
//           user_id: 6,
//           user_name: "김윤민",
//           problem_cnt: 3
//         }
//       ],
//       deadline: ["2022-12-12", "2022-12-20"]
//     },
//     {
//       problems: [
//         {
//           problem_id: 100,
//           problem_name: "문제이름",
//           problem_solved: [true, false, false, true, true, false]
//         },
//         {
//           problem_id: 101,
//           problem_name: "문제이름",
//           problem_solved: [true, true, true, false, false, false]
//         },
//         {
//           problem_id: 102,
//           problem_name: "문제이름",
//           problem_solved: [false, true, true, false, true, false]
//         },
//         {
//           problem_id: 103,
//           problem_name: "문제이름",
//           problem_solved: [true, false, false, false, true, false]
//         },
//         {
//           problem_id: 104,
//           problem_name: "문제이름",
//           problem_solved: [true, false, false, true, true, true]
//         }
//       ],
//       users: [
//         {
//           user_id: 1,
//           user_name: "김윤민",
//           problem_cnt: 3
//         },
//         {
//           user_id: 2,
//           user_name: "김윤민",
//           problem_cnt: 4
//         },
//         {
//           user_id: 3,
//           user_name: "김윤민",
//           problem_cnt: 1
//         },
//         {
//           user_id: 4,
//           user_name: "김윤민",
//           problem_cnt: 2
//         },
//         {
//           user_id: 5,
//           user_name: "김윤민",
//           problem_cnt: 3
//         },
//         {
//           user_id: 6,
//           user_name: "김윤민",
//           problem_cnt: 3
//         }
//       ],
//       deadline: ["2022-12-12", "2022-12-20"]
//     },
//     {
//       problems: [
//         {
//           problem_id: 100,
//           problem_name: "문제이름",
//           problem_solved: [true, false, false, true, true, false]
//         },
//         {
//           problem_id: 101,
//           problem_name: "문제이름",
//           problem_solved: [true, true, true, false, false, false]
//         },
//         {
//           problem_id: 102,
//           problem_name: "문제이름",
//           problem_solved: [false, true, true, false, true, false]
//         },
//         {
//           problem_id: 103,
//           problem_name: "문제이름",
//           problem_solved: [true, false, false, false, true, false]
//         },
//         {
//           problem_id: 104,
//           problem_name: "문제이름",
//           problem_solved: [true, false, false, true, true, true]
//         }
//       ],
//       users: [
//         {
//           user_id: 1,
//           user_name: "김윤민",
//           problem_cnt: 3
//         },
//         {
//           user_id: 2,
//           user_name: "김윤민",
//           problem_cnt: 4
//         },
//         {
//           user_id: 3,
//           user_name: "김윤민",
//           problem_cnt: 1
//         },
//         {
//           user_id: 4,
//           user_name: "김윤민",
//           problem_cnt: 2
//         },
//         {
//           user_id: 5,
//           user_name: "김윤민",
//           problem_cnt: 3
//         },
//         {
//           user_id: 6,
//           user_name: "김윤민",
//           problem_cnt: 3
//         }
//       ],
//       deadline: ["2022-12-12", "2022-12-20"]
//     }
//   ]
// };
