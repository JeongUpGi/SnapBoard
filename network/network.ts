import { auth } from "../firebaseConfig";
import { db } from "../firebaseConfig";
import { storage } from "../firebaseConfig";
import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  query,
  getDoc,
  deleteDoc,
  updateDoc,
  increment,
  getDocs,
  where,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import {
  LoginData,
  LoginResponse,
  SignupData,
  SignupResponse,
  Post,
  PostComment,
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

    await updateProfile(user, {
      displayName: data.nickname,
    });

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

export async function createPost({
  title,
  content,
  imageUrl,
}: {
  title: string;
  content: string;
  imageUrl?: string;
}) {
  if (!auth.currentUser) return;

  const user = auth.currentUser;

  await addDoc(collection(db, "posts"), {
    authorId: user.uid,
    authorName: user.displayName,
    title,
    content,
    imageUrl: imageUrl || null,
    createdAt: serverTimestamp(),
    likeCount: 0,
  });
}

// 게시글 get
export function getPosts(callback: (posts: Post[]) => void) {
  const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, async (snapshot) => {
    const posts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];

    // 현재 사용자의 좋아요 상태 확인 (post/postId/likes 에서 유저 id가 있는지 확인)
    if (auth.currentUser) {
      const postsWithLikeStatus = await Promise.all(
        posts.map(async (post) => {
          try {
            const likeDoc = await getDoc(
              doc(db, "posts", post.id, "likes", auth.currentUser!.uid)
            );
            return { ...post, isLiked: likeDoc.exists() };
          } catch (error) {
            console.error("좋아요 상태 확인 오류:", error);
            return { ...post, isLiked: false };
          }
        })
      );
      callback(postsWithLikeStatus);
    } else {
      callback(posts);
    }
  });
}

// 좋아요 추가
export async function addLike(postId: string, userId: string) {
  try {
    // 좋아요 문서 추가
    await setDoc(doc(db, "posts", postId, "likes", userId), {
      userId,
      postId,
      createdAt: serverTimestamp(),
    });

    // 게시글의 좋아요 수 증가
    await updateDoc(doc(db, "posts", postId), {
      likeCount: increment(1),
    });
  } catch (error) {
    console.error("좋아요 추가 오류:", error);
  }
}

// 좋아요 제거
export async function removeLike(postId: string, userId: string) {
  try {
    // 좋아요 문서 삭제
    await deleteDoc(doc(db, "posts", postId, "likes", userId));

    // 게시글의 좋아요 수 감소
    await updateDoc(doc(db, "posts", postId), {
      likeCount: increment(-1),
    });
  } catch (error) {
    console.error("좋아요 제거 오류:", error);
  }
}

// 댓글 추가
export async function addComment({
  postId,
  userId,
  userName,
  content,
  userProfile,
}: {
  postId: string;
  userId: string;
  userName: string;
  content: string;
  userProfile?: string | null;
}) {
  await addDoc(collection(db, "posts", postId, "comments"), {
    userId,
    userName,
    content,
    userProfile: userProfile || null, // 프로필이 없으면 null
    createdAt: serverTimestamp(),
  });
}

// 댓글 get
export function getComments(
  postId: string,
  callback: (comments: PostComment[]) => void
) {
  const q = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snapshot) => {
    const comments: PostComment[] = snapshot.docs.map((doc) => {
      const res = doc.data();
      return {
        id: doc.id,
        userId: res.userId,
        userName: res.userName,
        userProfile: res.userProfile,
        content: res.content,
        createdAt: res.createdAt?.toDate ? res.createdAt.toDate() : new Date(),
      };
    });
    callback(comments);
  });
}

// Firebase Storage 업로드 함수
export const uploadImageAsync = async (uri: string) => {
  if (!uri) return null;
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = `postImages/${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}.jpg`;
    const storageRef = ref(storage, filename);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (e) {
    return null;
  }
};

// 회원탈퇴 (계정 삭제)
export async function deleteUserAccount() {
  if (!auth.currentUser) throw new Error("로그인된 사용자가 없습니다.");
  try {
    await deleteDoc(doc(db, "users", auth.currentUser.uid));
    await deleteUser(auth.currentUser);
  } catch (error: any) {
    throw error;
  }
}

// 유저 존재 여부 확인 함수
export async function isUserExists(userId: string): Promise<boolean> {
  const userDoc = await getDoc(doc(db, "users", userId));
  return userDoc.exists();
}

// 닉네임 변경 시 모든 게시글/댓글의 닉네임도 변경
export async function updateNicknameEverywhere(
  userId: string,
  newNickname: string
) {
  // 1. 게시글 authorName 변경
  const postsQuery = query(
    collection(db, "posts"),
    where("authorId", "==", userId)
  );
  const postsSnapshot = await getDocs(postsQuery);
  const postUpdatePromises = postsSnapshot.docs.map((docSnap) =>
    updateDoc(doc(db, "posts", docSnap.id), { authorName: newNickname })
  );

  // 2. 각 게시글의 댓글 userName 변경
  const commentUpdatePromises: Promise<any>[] = [];
  for (const postDoc of postsSnapshot.docs) {
    const commentsQuery = query(
      collection(db, "posts", postDoc.id, "comments"),
      where("userId", "==", userId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    for (const commentDoc of commentsSnapshot.docs) {
      commentUpdatePromises.push(
        updateDoc(doc(db, "posts", postDoc.id, "comments", commentDoc.id), {
          userName: newNickname,
        })
      );
    }
  }

  await Promise.all([...postUpdatePromises, ...commentUpdatePromises]);
}
