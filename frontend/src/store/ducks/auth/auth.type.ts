export interface UserInfoType {
  id: string;
  nickname: string;
  area: string | null;
  followOpen: boolean;
  followerOpen: boolean;
  likeNotice: boolean;
  followNotice: boolean;
  commentNotice: boolean;
  replyNotice: boolean;
  profileMsg: string | null;
  profileImg: string | null;
  backgroundImg: string | null;
  categorys: Array<string>;
  social: string;
}
export interface InitialStateType {
  tmpId: string;
  userInfo: UserInfoType | null;
}
