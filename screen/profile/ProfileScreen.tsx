import React from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const ProfileScreen = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      Alert.alert("로그아웃 실패", error?.message);
    }
  };

  return (
    <SafeAreaView>
      <Text>profileScreen</Text>
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: 20,
          padding: 12,
          backgroundColor: "#eee",
          borderRadius: 8,
        }}
      >
        <Text style={{ color: "#333", fontWeight: "bold" }}>로그아웃</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;
