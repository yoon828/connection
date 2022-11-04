export interface UserInfoType {
  userId: number;
  name: string;
  githubId: string;
  backjoonId: null | string;
  email: string;
  imageUrl: string;
  tier: number;
  role: string;
  studyId: number;
  studyRole: "USER" | "LEADER" | "MEMBER";
  studyName: string;
  studyRepository: string;
  studyCode: string;
  ismember: boolean;
}
export interface InitialStateType {
  check: boolean;
  information: UserInfoType;
}
