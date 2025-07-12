import React, { useState } from "react";
import {
  View,
  TextInput,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../assets/colors/color";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { AuthStackParamList } from "../../model/model";

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<AuthStackParamList>>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
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
        <TouchableOpacity style={styles.loginButton} onPress={() => {}}>
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

        <View style={styles.dividerWrapper}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>또는</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* 소셜 로그인 버튼 섹션 */}
        <View style={styles.socialContainer}>
          {/* Google 로그인 */}
          <TouchableOpacity style={styles.googleButton} onPress={() => {}}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/images/google_logo.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.socialText}>구글로 계속하기</Text>
            </View>
          </TouchableOpacity>

          {/* Kakao 로그인 */}
          <TouchableOpacity style={styles.kakaoButton} onPress={() => {}}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/images/kakao_logo.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.socialText}>카카오로 계속하기</Text>
            </View>
          </TouchableOpacity>

          {/* Naver 로그인 */}
          <TouchableOpacity style={styles.naverButton} onPress={() => {}}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/images/naver_logo.png")}
                style={styles.socialIcon}
              />
              <Text style={styles.socialText}>네이버로 계속하기</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 1,
    alignItems: "center",
  },
  bottomContainer: {
    flex: 2,
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
  socialContainer: {
    gap: 15,
  },
  googleButton: {
    backgroundColor: colors.white,
    borderColor: colors.gray_c0c0c0,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  kakaoButton: {
    backgroundColor: colors.kakako,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  naverButton: {
    backgroundColor: colors.naver,
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  socialText: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.black,
  },
  dividerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gray_d3d3d3,
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.gray_808080,
    fontSize: 15,
    fontWeight: "bold",
  },
});
