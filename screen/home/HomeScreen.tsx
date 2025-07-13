import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { getPosts } from "../../network/network";
import { colors } from "../../assets/colors/color";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../../component/common/Header";

const HomeScreen = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getPosts((data) => {
      setPosts(data);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header.leftTitle
        title="SnapBoard"
        titleStyle={styles.headerTitle}
        leftIcon={require("../../assets/images/app_logo.png")}
        leftIconStyle={{ width: 40, height: 40 }}
      />

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      )}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.title}</Text>
            <Text>{item.content}</Text>
            <Text>
              by {item.authorName} |{" "}
              {item.createdAt?.toDate?.().toLocaleString?.() || ""}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

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
});
