import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

const SignupScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>It is SignupScreen</Text>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
