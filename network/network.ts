import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { SignupData, SignupResponse } from "../model/model";

// Firebase 회원가입
export const signupUser = async (data: SignupData): Promise<SignupResponse> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const user = userCredential.user;

    await sendEmailVerification(user);

    return {
      success: true,
      message: `${data.email}로 인증 링크를 발송했습니다.`,
      user: user,
    };
  } catch (error: any) {
    let errorMessage = "회원가입 중 오류가 발생했습니다.";

    if (error.code === "auth/email-already-in-use") {
      errorMessage = "이미 사용 중인 이메일입니다.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "유효하지 않은 이메일입니다.";
    } else if (error.code === "auth/weak-password") {
      errorMessage = "비밀번호가 너무 약합니다.";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage = "네트워크 연결을 확인해주세요.";
    } else if (error.code === "auth/unauthorized-continue-url") {
      errorMessage =
        "이메일 인증 설정에 문제가 있습니다. 관리자에게 문의해주세요.";
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};
