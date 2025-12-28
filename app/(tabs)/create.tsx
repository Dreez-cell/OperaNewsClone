import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useRouter } from 'expo-router';
import { useAuth } from '@/template';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { createPost, uploadImage, uploadVideo, moderateContent } from '../../services/readitService';

export default function CreateScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { user } = useAuth();

  const [postType, setPostType] = useState<'text' | 'image' | 'video' | 'link'>('text');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [mediaFiles, setMediaFiles] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  const handlePickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 3,
    });

    if (!result.canceled) {
      setMediaFiles(result.assets);
      setPostType('image');
    }
  };

  const handlePickVideo = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'video/*',
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets[0]) {
      const videoSize = result.assets[0].size || 0;
      if (videoSize > 10 * 1024 * 1024) {
        Alert.alert('Error', 'Video must be less than 10MB');
        return;
      }
      setMediaFiles([result.assets[0]]);
      setPostType('video');
    }
  };

  const handlePost = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to post');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    setUploading(true);

    try {
      // AI content moderation
      const moderation = await moderateContent(content, title);
      if (!moderation.safe) {
        Alert.alert('Content Flagged', `Your post contains inappropriate content: ${moderation.reason}`);
        setUploading(false);
        return;
      }

      let mediaUrls: string[] = [];

      // Upload media
      if (postType === 'image' && mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          const response = await fetch(file.uri);
          const blob = await response.blob();
          const fileName = file.fileName || `image_${Date.now()}.jpg`;
          
          const { url, error } = await uploadImage(user.id, blob, fileName);
          if (error) {
            Alert.alert('Upload Error', error);
            setUploading(false);
            return;
          }
          if (url) mediaUrls.push(url);
        }
      } else if (postType === 'video' && mediaFiles.length > 0) {
        const file = mediaFiles[0];
        const response = await fetch(file.uri);
        const blob = await response.blob();
        const fileName = file.name || `video_${Date.now()}.mp4`;
        
        const { url, error } = await uploadVideo(user.id, blob, fileName);
        if (error) {
          Alert.alert('Upload Error', error);
          setUploading(false);
          return;
        }
        if (url) mediaUrls.push(url);
      }

      // Create post
      const { data, error } = await createPost(
        user.id,
        title,
        content,
        postType,
        mediaUrls.length > 0 ? mediaUrls : undefined,
        linkUrl || undefined
      );

      if (error) {
        Alert.alert('Error', error);
      } else {
        Alert.alert('Success', 'Post created successfully!');
        setTitle('');
        setContent('');
        setLinkUrl('');
        setMediaFiles([]);
        setPostType('text');
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setUploading(false);
    }
  };

  if (!user) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          {
            backgroundColor: isDark
              ? theme.colors.background.dark
              : theme.colors.background.light,
          },
        ]}
        edges={['top']}
      >
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={styles.loginPrompt}>
          <Ionicons
            name="log-in-outline"
            size={80}
            color={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
          />
          <Text
            style={[
              styles.loginText,
              { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
            ]}
          >
            Please log in to create posts
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? theme.colors.background.dark
            : theme.colors.background.light,
        },
      ]}
      edges={['top']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark
              ? theme.colors.background.card.dark
              : theme.colors.background.card.light,
            borderBottomColor: isDark ? theme.colors.border.dark : theme.colors.border.light,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.cancelText, { color: theme.colors.primary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
          ]}
        >
          Create Post
        </Text>
        <TouchableOpacity onPress={handlePost} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Text style={[styles.postText, { color: theme.colors.primary }]}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.typeSelector}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              postType === 'text' && styles.typeButtonActive,
            ]}
            onPress={() => setPostType('text')}
          >
            <Ionicons name="text" size={20} color={postType === 'text' ? '#FFFFFF' : theme.colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              postType === 'image' && styles.typeButtonActive,
            ]}
            onPress={handlePickImages}
          >
            <Ionicons name="image" size={20} color={postType === 'image' ? '#FFFFFF' : theme.colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              postType === 'video' && styles.typeButtonActive,
            ]}
            onPress={handlePickVideo}
          >
            <Ionicons name="videocam" size={20} color={postType === 'video' ? '#FFFFFF' : theme.colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeButton,
              postType === 'link' && styles.typeButtonActive,
            ]}
            onPress={() => setPostType('link')}
          >
            <Ionicons name="link" size={20} color={postType === 'link' ? '#FFFFFF' : theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <TextInput
          style={[
            styles.titleInput,
            {
              color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light,
              backgroundColor: isDark ? theme.colors.background.card.dark : theme.colors.background.card.light,
            },
          ]}
          placeholder="Title"
          placeholderTextColor={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
          value={title}
          onChangeText={setTitle}
          maxLength={300}
        />

        <TextInput
          style={[
            styles.contentInput,
            {
              color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light,
              backgroundColor: isDark ? theme.colors.background.card.dark : theme.colors.background.card.light,
            },
          ]}
          placeholder="What's on your mind? (Use #hashtags)"
          placeholderTextColor={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={10}
          textAlignVertical="top"
        />

        {postType === 'link' && (
          <TextInput
            style={[
              styles.linkInput,
              {
                color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light,
                backgroundColor: isDark ? theme.colors.background.card.dark : theme.colors.background.card.light,
              },
            ]}
            placeholder="https://example.com"
            placeholderTextColor={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
            value={linkUrl}
            onChangeText={setLinkUrl}
            keyboardType="url"
            autoCapitalize="none"
          />
        )}

        {mediaFiles.length > 0 && (
          <View style={styles.mediaPreview}>
            <Text
              style={[
                styles.mediaCount,
                { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
              ]}
            >
              {mediaFiles.length} {postType === 'image' ? 'image(s)' : 'video'} selected
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  cancelText: {
    fontSize: theme.typography.fontSize.base,
  },
  postText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    padding: theme.spacing.base,
  },
  typeButton: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.base,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  titleInput: {
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.base,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  contentInput: {
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.base,
    fontSize: theme.typography.fontSize.base,
    minHeight: 200,
  },
  linkInput: {
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.base,
    fontSize: theme.typography.fontSize.base,
  },
  mediaPreview: {
    marginHorizontal: theme.spacing.base,
    padding: theme.spacing.base,
  },
  mediaCount: {
    fontSize: theme.typography.fontSize.sm,
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xxl,
  },
  loginText: {
    fontSize: theme.typography.fontSize.lg,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
});
