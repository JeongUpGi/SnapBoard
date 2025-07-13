import React from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { HeaderProps } from "../../model/model";
import { colors } from "../../assets/colors/color";

// 기본 헤더
const DefaultHeader: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  headerBackgroundColor,
  onPressLeft,
  onPressRight,
  titleStyle,
  leftIconStyle,
  rightIconStyle,
}) => {
  return (
    <View style={[styles.headerContainer, headerBackgroundColor]}>
      <TouchableOpacity style={styles.buttonWrapper} onPress={onPressLeft}>
        <Image source={leftIcon} style={leftIconStyle} />
      </TouchableOpacity>
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <TouchableOpacity style={styles.buttonWrapper} onPress={onPressRight}>
        <Image source={rightIcon} style={rightIconStyle} />
      </TouchableOpacity>
    </View>
  );
};

// 왼쪽 제목 헤더
const LeftTitleHeader: React.FC<HeaderProps> = ({
  title,
  leftIcon,
  rightIcon,
  headerBackgroundColor,
  onPressRight,
  titleStyle,
  leftIconStyle,
  rightIconStyle,
}) => {
  return (
    <View style={[styles.headerContainer, headerBackgroundColor]}>
      <View style={styles.rowWrapper}>
        <Image source={leftIcon} style={leftIconStyle} />
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>
      <TouchableOpacity style={styles.buttonWrapper} onPress={onPressRight}>
        <Image source={rightIcon} style={rightIconStyle} />
      </TouchableOpacity>
    </View>
  );
};

export const Header = {
  default: DefaultHeader,
  leftTitle: LeftTitleHeader,
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  rowWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonWrapper: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.black,
    fontSize: 17,
    fontWeight: "bold",
  },
});
