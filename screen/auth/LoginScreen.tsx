import React from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";

const LoginScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>It is LoginScreen</Text>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
