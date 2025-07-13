import React, { useState, useRef } from "react";
import {
  View,
  TextInput,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../assets/colors/color";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { StackParamList } from "../../model/model";
import { Header } from "../../component/common/Header";
import { validateEmail, validatePassword } from "../../utils/formatHelper";
import { signupUser } from "../../network/network";

const SignupScreen = () => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const nicknameRef = useRef<TextInput>(null);

  // 회원가입 처리
  const handleSignup = async () => {
    if (!email.trim() || !validateEmail(email)) {
      Alert.alert("오류", "올바른 이메일 형식을 입력해주세요.");
      return;
    }
    if (!password.trim() || !validatePassword(password)) {
      Alert.alert(
        "오류",
        "비밀번호는 대문자, 소문자, 숫자, 특수기호를 포함하여 6자 이상이어야 합니다."
      );
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!nickname.trim() || nickname.trim().length < 2) {
      Alert.alert("오류", "닉네임은 2자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);

    try {
      const result = await signupUser({
        email,
        password,
        nickname,
      });

      if (result.success) {
        Alert.alert("회원가입 완료", result.message, [
          {
            text: "확인",
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            },
          },
        ]);
      } else {
        Alert.alert("오류", result.message);
      }
    } catch (error) {
      Alert.alert("오류", "회원가입 중 오류가 발생했습니다.");
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
      <Header.default
        title="회원가입"
        leftIcon={require("../../assets/images/previous_arrow.png")}
        onPressLeft={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }}
        leftIconStyle={{ width: 20, height: 20 }}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior="padding"
      >
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/images/app_logo.png")}
              style={styles.appLogo}
            />
            <Text style={styles.description}>
              계정을 만들어 다양한 게시물을 확인해보세요
            </Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              ref={emailRef}
              style={styles.input}
              placeholder="이메일"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => passwordRef.current?.focus()}
            />
            <TextInput
              ref={passwordRef}
              style={styles.input}
              placeholder="비밀번호 (대문자, 소문자, 숫자, 특수기호를 포함하여 6자 이상)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
            />
            <TextInput
              ref={confirmPasswordRef}
              style={styles.input}
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              returnKeyType="next"
              blurOnSubmit={false}
              onSubmitEditing={() => nicknameRef.current?.focus()}
            />
            <TextInput
              ref={nicknameRef}
              style={styles.input}
              placeholder="닉네임"
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />
            <TouchableOpacity
              style={[
                styles.signupButton,
                isLoading && styles.signupButtonDisabled,
              ]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              <Text style={styles.signupButtonText}>회원가입</Text>
            </TouchableOpacity>

            <View style={styles.loginTextContainer}>
              <Text style={styles.loginText}>
                이미 계정이 있으신가요?{" "}
                <Text
                  style={styles.loginLink}
                  onPress={() =>
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "Login" }],
                    })
                  }
                >
                  로그인하기
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignupScreen;

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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  appLogo: {
    width: 180,
    height: 140,
    marginBottom: 20,
  },
  description: {
    color: colors.gray_808080,
    fontSize: 17,
    fontWeight: "bold",
  },
  formContainer: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray_c0c0c0,
    padding: 15,
    marginBottom: 13,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  signupButton: {
    backgroundColor: colors.blue,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  signupButtonDisabled: {
    backgroundColor: colors.gray_c0c0c0,
  },
  signupButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  loginTextContainer: {
    alignItems: "center",
  },
  loginText: {
    color: colors.gray_808080,
    fontSize: 15,
  },
  loginLink: {
    color: colors.blue,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
