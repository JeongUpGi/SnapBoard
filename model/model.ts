import { TextStyle, ImageStyle } from "react-native";

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Profile: undefined;
  Post: undefined;
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
