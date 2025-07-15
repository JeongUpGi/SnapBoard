import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  View,
  Image,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../../firebaseConfig";
import { colors } from "../../assets/colors/color";
import { Header } from "../../component/common/Header";
import {
  deleteUserAccount,
  deletePost,
  uploadImageAsync,
  updateNicknameEverywhere,
  updateProfileImageEverywhere,
} from "../../network/network";
import { updateProfile } from "firebase/auth";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { useFocusEffect } from "@react-navigation/native";

const ProfileScreen = () => {
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [myPosts, setMyPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      if (!auth.currentUser) return;
      const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setNickname(data.nickname || "");
        setProfileImage(data.profileImage || null);
      }
      setIsLoading(false);
    };
    fetchUserProfile();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchMyPosts = async () => {
        if (!auth.currentUser) return;
        const q = query(
          collection(db, "posts"),
          where("authorId", "==", auth.currentUser.uid)
        );
        const snap = await getDocs(q);
        setMyPosts(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      };
      fetchMyPosts();
    }, [nickname])
  );

  // 게시글 삭제
  const handleDeletePost = (postId: string) => {
    Alert.alert("게시글 삭제", "게시글을 삭제하시겠습니까?", [
      { text: "취소", style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          try {
            await deletePost(postId);
            setMyPosts((prev) => prev.filter((p) => p.id !== postId));
          } catch (error: any) {
            Alert.alert(
              "오류",
              error?.message || "게시글 삭제 중 오류가 발생했습니다."
            );
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert("로그아웃 실패", error?.message);
    }
  };

  const handleSaveNickname = async () => {
    if (!auth.currentUser) return;
    const newNickname = nicknameInput.trim();
    if (!newNickname) {
      Alert.alert("닉네임을 입력하세요");
      return;
    }
    if (newNickname === nickname) {
      setEditingNickname(false);
      return;
    }
    setIsLoading(true);
    try {
      // 1. Firebase Auth 프로필 업데이트
      await updateProfile(auth.currentUser, { displayName: newNickname });

      // 2. Firestore users/{uid} 닉네임 업데이트
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        nickname: newNickname,
      });

      // 3. 모든 게시글/댓글 닉네임 업데이트
      await updateNicknameEverywhere(auth.currentUser.uid, newNickname);
      setNickname(newNickname);
      setEditingNickname(false);
      Alert.alert("닉네임이 변경되었습니다.");
    } catch (error: any) {
      Alert.alert("닉네임 변경 실패", error?.message || "알 수 없는 오류");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!auth.currentUser) return;
    Alert.alert(
      "회원탈퇴",
      "정말로 회원탈퇴 하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴",
          style: "destructive",
          onPress: async () => {
            try {
              setIsLoading(true);
              await deleteUserAccount();
              Alert.alert("탈퇴 완료", "계정이 삭제되었습니다.");
            } catch (error: any) {
              if (error.code === "auth/requires-recent-login") {
                Alert.alert(
                  "재로그인 필요",
                  "보안을 위해 다시 로그인 후 탈퇴를 시도해 주세요."
                );
              } else {
                Alert.alert("탈퇴 실패", error?.message || "알 수 없는 오류");
              }
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // 프로필 이미지 변경
  const handlePickProfileImage = async () => {
    if (!auth.currentUser) return;

    // 권한 요청
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "권한 필요",
        "이미지 선택을 위해 갤러리 접근 권한이 필요합니다."
      );
      return;
    }

    // 이미지 선택
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled) return;
    setIsLoading(true);
    try {
      // 리사이즈/크롭
      const manipResult = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 300, height: 300 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      const downloadURL = await uploadImageAsync(manipResult.uri);
      if (!downloadURL) throw new Error("이미지 업로드 실패");

      // Firestore, Auth 업데이트
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        profileImage: downloadURL,
      });
      await updateProfile(auth.currentUser, { photoURL: downloadURL });
      // 모든 게시글/댓글 프로필 이미지 업데이트
      await updateProfileImageEverywhere(auth.currentUser.uid, downloadURL);
      setProfileImage(downloadURL);
      Alert.alert("프로필 이미지가 변경되었습니다.");
    } catch (e: any) {
      Alert.alert("오류", e?.message || "이미지 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
      <Header.default title="프로필 수정" titleStyle={styles.headerTitle} />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      )}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            {/* 프로필 이미지 */}
            <View style={styles.profileWrapper}>
              <TouchableOpacity
                onPress={handlePickProfileImage}
                activeOpacity={0.7}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profile}
                  />
                ) : (
                  <View style={styles.profilePlaceholderWrapper}>
                    <Text style={{ color: colors.white, fontSize: 25 }}>?</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {/* 닉네임 표시/수정 */}
            <View style={styles.nicknameWrapper}>
              <Text style={styles.nickname}>닉네임</Text>
              {editingNickname ? (
                <>
                  <TextInput
                    style={styles.nicknameInput}
                    value={nicknameInput}
                    onChangeText={setNicknameInput}
                    placeholder="닉네임을 입력하세요"
                    maxLength={16}
                    autoFocus
                  />
                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={handleSaveNickname}
                  >
                    <Text style={styles.saveBtnText}>저장</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.nicknameText}>{nickname}</Text>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => {
                      setNicknameInput("");
                      setEditingNickname(true);
                    }}
                  >
                    <Text style={styles.editBtnText}>수정</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>

          {/* 내가 작성한 게시글 리스트 */}
          <View style={{ marginBottom: 30 }}>
            <Text
              style={{ fontWeight: "bold", fontSize: 16, marginBottom: 10 }}
            >
              내가 작성한 게시글
            </Text>
            {myPosts.length === 0 ? (
              <Text style={{ color: colors.gray_808080, marginBottom: 10 }}>
                작성한 게시글이 없습니다.
              </Text>
            ) : (
              myPosts.map((post) => (
                <View
                  key={post.id}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                    backgroundColor: colors.gray_f5f5f5,
                    borderRadius: 8,
                    padding: 10,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{ fontWeight: "bold", fontSize: 15 }}
                      numberOfLines={1}
                    >
                      {post.title}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.gray_808080 }}>
                      {post.createdAt?.toDate
                        ? post.createdAt.toDate().toLocaleString()
                        : ""}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeletePost(post.id)}
                    style={{ paddingHorizontal: 10 }}
                  >
                    <Image
                      source={require("../../assets/images/delete.png")}
                      style={styles.deleteImage}
                    />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* 로그아웃/회원탈퇴 버튼 */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
              <Text style={styles.logoutBtnText}>로그아웃</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDeleteAccount}
            >
              <Text style={styles.deleteBtnText}>회원탈퇴</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
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
  profileContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  profileWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  profile: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.gray_808080,
  },
  profilePlaceholderWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  nicknameWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 8,
  },
  nickname: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
    color: "#333",
  },
  nicknameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 7,
    fontSize: 15,
    backgroundColor: colors.gray_f5f5f5,
    marginRight: 8,
  },
  nicknameText: {
    flex: 1,
    fontSize: 16,
    color: colors.gray_333333,
    marginRight: 8,
  },
  saveBtn: {
    backgroundColor: colors.blue,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  saveBtnText: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  editBtn: {
    backgroundColor: colors.gray_dcdcdc,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  editBtnText: {
    color: colors.blue,
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 30,
  },
  logoutBtn: {
    backgroundColor: colors.gray_f5f5f5,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 16,
  },
  logoutBtnText: {
    color: colors.gray_333333,
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteBtn: {
    backgroundColor: colors.red_fff0f0,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.red_ffb3b3,
  },
  deleteBtnText: {
    color: colors.red_ff3b30,
    fontWeight: "bold",
    fontSize: 16,
  },
  deleteImage: {
    width: 30,
    height: 30,
  },
});
