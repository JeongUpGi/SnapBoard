import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, StyleSheet } from "react-native";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const HomeScreen = () => {
  const [nickname, setNickname] = useState<string | null>(null);

  useEffect(() => {
    const fetchNickname = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setNickname(userDoc.data().nickname);
        }
      }
    };
    fetchNickname();
  }, []);

  return (
    <SafeAreaView>
      <Text>{`안녕하세요, ${nickname}님!`}</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
