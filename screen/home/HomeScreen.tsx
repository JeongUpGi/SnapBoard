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
  Alert,
  TextInput,
} from "react-native";
import {
  getPosts,
  addLike,
  removeLike,
  addComment,
  getComments,
} from "../../network/network";
import { Post, PostComment, StackParamList } from "../../model/model";
import { auth } from "../../firebaseConfig";

import { NavigationProp, useNavigation } from "@react-navigation/native";

import { colors } from "../../assets/colors/color";
import { formatDate } from "../../utils/formatHelper";
import { Header } from "../../component/common/Header";

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<StackParamList>>();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const processingLikesRef = React.useRef<Set<string>>(new Set()); //중복처리 방지를 위한 Ref
  const [comments, setComments] = useState<{ [postId: string]: PostComment[] }>(
    {}
  );
  const [commentInputs, setCommentInputs] = useState<{
    [postId: string]: string;
  }>({});

  useEffect(() => {
    const unsubscribe = getPosts((data) => {
      setPosts(data);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // 댓글 실시간 get
  useEffect(() => {
    const unsubscribes: (() => void)[] = [];
    posts.forEach((post) => {
      const postComments = getComments(post.id, (commentList) => {
        setComments((prev) => ({ ...prev, [post.id]: commentList }));
      });
      unsubscribes.push(postComments);
    });
    return () => {
      unsubscribes.forEach((unsub) => unsub());
    };
  }, [posts]);

  // 좋아요 버튼 클릭 핸들러
  const handleLikePress = async (postId: string) => {
    if (!auth.currentUser || processingLikesRef.current.has(postId)) return;

    const user = auth.currentUser;
    processingLikesRef.current.add(postId);

    const prevPost = posts.find((post) => post.id === postId);
    // 현재 게시글 (isLiked의 경우 각 userId에 맞게 보관 중)
    const currentPost = posts.find((post) => post.id === postId);

    // UI 선업데이트
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post
      )
    );

    try {
      if (currentPost?.isLiked) {
        await removeLike(postId, user.uid);
      } else {
        await addLike(postId, user.uid);
      }
    } catch (error) {
      // 서버 오류 시 원래 상태로 롤백
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === postId ? prevPost! : post))
      );
      Alert.alert(
        "오류",
        "좋아요 처리 중 문제가 발생했습니다.\n잠시 후 다시 시도해주세요."
      );
    } finally {
      processingLikesRef.current.delete(postId);
    }
  };

  // 댓글 등록
  const handleAddComment = async (postId: string) => {
    const content = commentInputs[postId];
    if (!content || !auth.currentUser) return;

    const userId = auth.currentUser.uid;
    const userName = auth.currentUser.displayName || "익명"; // null 방지
    const userProfile = auth.currentUser.photoURL || null;

    try {
      setIsLoading(true);
      await addComment({
        postId,
        userId,
        userName,
        content,
        userProfile,
      });
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (error) {
      Alert.alert("오류", "댓글 작성 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 입력 핸들러
  const handleCommentInput = (postId: string, text: string) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: text }));
  };

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
        <TouchableOpacity
          style={styles.buttonWrapper}
          onPress={() => handleLikePress(item.id)}
          disabled={processingLikesRef.current.has(item.id)}
        >
          <Image
            source={
              item.isLiked
                ? require("../../assets/images/love.png")
                : require("../../assets/images/empty_love.png")
            }
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

      {/* 댓글 목록 */}
      <View style={styles.commentList}>
        {comments[item.id]?.map((item) => (
          <View key={item.id} style={styles.commentItem}>
            <View style={styles.commentContent}>
              <Text style={styles.commentUserName}>{item.userName}</Text>
              <Text style={styles.commentText}>{item.content}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* 댓글 입력창 */}
      <View style={styles.commentInputRow}>
        <TextInput
          style={styles.commentInput}
          value={commentInputs[item.id] || ""}
          onChangeText={(text) => handleCommentInput(item.id, text)}
          placeholder="댓글을 입력하세요"
        />
        <TouchableOpacity
          onPress={() => handleAddComment(item.id)}
          style={styles.commentSendBtn}
        >
          <Text style={{ color: colors.blue, fontWeight: "bold" }}>등록</Text>
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
        rightTitle="작성"
        rightIcon={require("../../assets/images/write.png")}
        rightIconStyle={{ width: 30, height: 30 }}
        onPressRight={() => navigation.navigate("PostStack")}
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
    justifyContent: "center",
    flex: 1,
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
  commentList: {
    marginTop: 15,
  },
  commentItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  commentContent: {
    flex: 1,
    flexDirection: "row",
  },
  commentUserName: {
    fontWeight: "bold",
    fontSize: 13,
    color: colors.black,
    marginRight: 7,
  },
  commentText: {
    fontSize: 13,
    color: colors.gray_333333,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#fafafa",
  },
  commentSendBtn: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});
