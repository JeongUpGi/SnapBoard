import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  LoginData,
  LoginResponse,
  SignupData,
  SignupResponse,
} from "../model/model";

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

    // Firestore Database에 저장
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      nickname: data.nickname,
      createdAt: new Date(),
    });

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

// FireBase 로그인
export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    const user = userCredential.user;

    if (!user.emailVerified) {
      return {
        success: false,
        message:
          "이메일 인증이 완료되지 않았습니다.\n가입하신 이메일을 확인하여 인증을 완료해주세요.",
      };
    }

    return {
      success: true,
      message: "로그인 성공",
      user: user,
    };
  } catch (error: any) {
    let errorMessage = "로그인 중 오류가 발생했습니다.";

    if (error.code === "auth/user-not-found") {
      errorMessage = "등록되지 않은 이메일입니다.";
    } else if (error.code === "auth/wrong-password") {
      errorMessage = "비밀번호가 올바르지 않습니다.";
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "유효하지 않은 이메일입니다.";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage =
        "너무 많은 로그인 시도가 있었습니다.\n잠시 후 다시 시도해주세요.";
    } else if (error.code === "auth/network-request-failed") {
      errorMessage = "네트워크 연결을 확인해주세요.";
    }

    return {
      success: false,
      message: errorMessage,
    };
  }
};
