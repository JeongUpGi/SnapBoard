import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { colors } from "../../assets/colors/color";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackParamList } from "../../model/model";
import { loginUser } from "../../network/network";

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 로그인 처리
  const handleLogin = async () => {
    if (!email.trim()) {
      Alert.alert("오류", "이메일을 입력해주세요.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("오류", "비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await loginUser({
        email,
        password,
      });

      // 로그인 성공 시 app.tsx에서 구독 후 메인으로 route
      if (result.success) {
        setIsLoading(false);
      } else {
        Alert.alert("로그인 실패", result.message);
      }
    } catch (error) {
      Alert.alert("로그인 실패", "로그인 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <View style={styles.topContainer}>
            <Image
              source={require("../../assets/images/app_logo.png")}
              style={styles.appLogo}
            />
            <Text style={styles.description}>
              친구들의 사진과 게시물을 보려면 로그인하세요
            </Text>
          </View>
          <View style={styles.bottomContainer}>
            <TextInput
              style={styles.input}
              placeholder="이메일"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              placeholder="비밀번호"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* 로그인 */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>

            {/* 회원가입  */}
            <View style={styles.signUpTextContainer}>
              <Text style={styles.signUpText}>
                계정이 없으신가요?{" "}
                <Text
                  style={styles.signUpLink}
                  onPress={() => navigation.navigate("SignUp")}
                >
                  회원가입하기
                </Text>
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  topContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appLogo: {
    width: 250,
    height: 200,
    alignSelf: "center",
  },
  description: {
    color: colors.gray_808080,
    fontSize: 17,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray_c0c0c0,
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  loginButton: {
    backgroundColor: colors.blue,
    borderRadius: 5,
    paddingVertical: 14,
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },
  loginButtonDisabled: {
    backgroundColor: colors.gray_c0c0c0,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpTextContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  signUpText: {
    color: colors.gray_808080,
    fontSize: 15,
  },
  signUpLink: {
    color: colors.blue,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
