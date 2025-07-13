import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { getPosts } from "../../network/network";
import { Post } from "../../model/model";

import { colors } from "../../assets/colors/color";
import { formatDate } from "../../utils/formatHelper";
import { Header } from "../../component/common/Header";

const HomeScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getPosts((data) => {
      setPosts(data);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const renderPostCard = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.authorInfo}>
          <View style={styles.profile}>
            <Text style={styles.profileText}>
              {item.authorName?.charAt(0)?.toUpperCase() || "익명"}
            </Text>
          </View>
          <View style={styles.authorDetails}>
            <Text style={styles.authorName}>{item.authorName || "익명"}</Text>
            <Text style={styles.postTime}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* 게시글 내용 */}
      <View style={styles.postContent}>
        <Text style={styles.postTitle} numberOfLines={1}>
          {item.title}
        </Text>
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            style={styles.postImage}
            resizeMode="cover"
          />
        )}
        <Text style={styles.postText} numberOfLines={3}>
          {item.content}
        </Text>
      </View>

      {/* 버튼 섹션 (좋아요, 댓글) */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonWrapper}>
          <Image
            source={require("../../assets/images/empty_love.png")}
            style={styles.buttonIcon}
          />
          <Text style={styles.actionText}>{item.likeCount || 0}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonWrapper}>
          <Image
            source={require("../../assets/images/chat.png")}
            style={styles.buttonIcon}
          />
          <Text style={styles.actionText}>댓글</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={require("../../assets/images/write.png")}
        style={styles.buttonIcon}
      />
      <Text style={styles.emptyTitle}>아직 게시글이 없어요</Text>
      <Text style={styles.emptyText}>첫 번째 게시글을 작성해보세요!</Text>
    </View>
  );

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
        renderItem={renderPostCard}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listContainer: {
    padding: 15,
  },
  postCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blue,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: colors.gray_808080,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  postContent: {
    marginBottom: 16,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 8,
    lineHeight: 24,
  },
  postText: {
    fontSize: 14,
    color: colors.gray_333333,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: colors.gray_f5f5f5,
    paddingTop: 12,
  },
  buttonWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  actionText: {
    fontSize: 14,
    color: colors.gray_808080,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.gray_808080,
    textAlign: "center",
  },
});
