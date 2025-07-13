import { TextStyle, ImageStyle } from "react-native";

export type StackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Profile: undefined;
  Post: undefined;
  // 탭 네비게이션 타입 추가
  HomeStack: undefined;
  PostStack: undefined;
  ProfileStack: undefined;
};

export interface HeaderProps {
  title?: string;
  leftIcon?: undefined;
  rightIcon?: undefined;
  onPressLeft?: () => void;
  onPressRight?: () => void;

  titleStyle?: TextStyle;
  headerBackgroundColor?: TextStyle;
  leftIconStyle?: ImageStyle;
  rightIconStyle?: ImageStyle;
}

// 회원가입 데이터 인터페이스
export interface SignupData {
  email: string;
  password: string;
  nickname: string;
}

// 회원가입 응답 인터페이스
export interface SignupResponse {
  success: boolean;
  message: string;
  user?: any;
}

// 로그인 데이터 인터페이스
export interface LoginData {
  email: string;
  password: string;
}

// 로그인 응답 인터페이스
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: any;
}

// 게시글 데이터 인터페이스
export interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  likeCount: number;
  isLiked: boolean; // 현재 사용자가 좋아요를 눌렀는지 여부
}

// 게시글 댓글 인터페이스
export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  userProfile?: string; // 선택적 프로필 이미지 URL
  content: string;
  createdAt: Date;
}
