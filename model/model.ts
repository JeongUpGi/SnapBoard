import { TextStyle, ImageStyle } from "react-native";

export type AuthStackParamList = {
  Login: undefined;
  SignUp: undefined;
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
