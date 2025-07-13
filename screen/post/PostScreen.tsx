import React, { useState } from "react";
import {
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { colors } from "../../assets/colors/color";

const PostScreen = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSubmit = async () => {};

  const handleAddImage = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior="padding"
        >
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* 제목 입력 섹션 */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>제목</Text>
              <TextInput
                placeholder="제목을 입력하세요"
                placeholderTextColor={colors.gray_c0c0c0}
                value={title}
                onChangeText={setTitle}
                style={styles.titleInput}
                maxLength={30}
              />
            </View>

            {/* 내용 입력 섹션 */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>내용</Text>
              <TextInput
                placeholder="내용을 입력하세요"
                placeholderTextColor={colors.gray_c0c0c0}
                value={content}
                onChangeText={setContent}
                multiline
                textAlignVertical="top"
                style={styles.contentInput}
                maxLength={500}
              />
            </View>

            {/* 이미지 첨부 섹션 */}
            <View style={styles.imageSection}>
              <Text style={styles.inputTitle}>이미지 첨부</Text>

              {selectedImage ? (
                <View style={styles.imageContainer}>
                  {/* 이미지 있을 경우 */}
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.addImageButton}
                  onPress={handleAddImage}
                >
                  <View style={styles.addImageContent}>
                    <Text style={styles.addImageIcon}>+</Text>
                    <Text style={styles.addImageText}>이미지 추가</Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* 등록하기 버튼 */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!title.trim() || !content.trim()) &&
                  styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!title.trim() || !content.trim()}
            >
              <Text style={styles.submitButtonText}>등록하기</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default PostScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 8,
  },
  titleInput: {
    borderWidth: 1,
    borderColor: colors.gray_dcdcdc,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: colors.white,
    color: colors.black,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentInput: {
    borderWidth: 1,
    borderColor: colors.gray_dcdcdc,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    height: 200,
    backgroundColor: colors.white,
    color: colors.black,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageSection: {
    marginBottom: 24,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  addImageButton: {
    borderWidth: 2,
    borderColor: colors.gray_dcdcdc,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    backgroundColor: colors.gray_f5f5f5,
  },
  addImageContent: {
    alignItems: "center",
  },
  addImageIcon: {
    fontSize: 32,
    color: colors.gray_808080,
    marginBottom: 8,
  },
  addImageText: {
    fontSize: 16,
    color: colors.gray_808080,
    fontWeight: "600",
    marginBottom: 4,
  },
  submitButton: {
    backgroundColor: colors.blue,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: colors.gray_dcdcdc,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
