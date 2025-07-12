import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

const SignupScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header.default
        title="회원가입"
        leftIcon={require("../../assets/images/previous_arrow.png")}
        onPressLeft={() => {
          navigation.goBack();
        }}
        leftIconStyle={{ width: 20, height: 20 }}
      />
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
