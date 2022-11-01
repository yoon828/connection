export interface UserInfoType {
  userIdx: number;
  name: string;
  githubId: string;
  backjoonId: null | string;
  email: string;
  imageUrl: string;
  tier: number;
  password: string | null;
  provider: string;
  role: string;
}
export interface InitialStateType {
  check: boolean;
  information: UserInfoType | null;
}
