import React from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export default function PostScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const params = useLocalSearchParams();

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
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light}
          />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="bookmark-outline"
              size={24}
              color={isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="share-outline"
              size={24}
              color={isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[
            styles.postContainer,
            {
              backgroundColor: isDark
                ? theme.colors.background.card.dark
                : theme.colors.background.card.light,
            },
          ]}
        >
          <View style={styles.subredditHeader}>
            <Text style={styles.icon}>📰</Text>
            <View style={styles.subredditInfo}>
              <Text
                style={[
                  styles.subreddit,
                  { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
                ]}
              >
                r/AnythingGoesNews
              </Text>
              <Text
                style={[
                  styles.author,
                  { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
                ]}
              >
                u/NewsShare • 1d ago
              </Text>
            </View>
            <TouchableOpacity style={styles.joinButton}>
              <Text style={styles.joinText}>Join</Text>
            </TouchableOpacity>
          </View>

          <Text
            style={[
              styles.title,
              { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
            ]}
          >
            {params.title || 'Post Title'}
          </Text>

          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1495573258723-2c7be7a646ce?w=800&q=80' }}
            style={styles.image}
            contentFit="cover"
          />

          <Text
            style={[
              styles.content,
              { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
            ]}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            {'\n\n'}
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          </Text>

          <View style={styles.actions}>
            <View style={styles.voteContainer}>
              <TouchableOpacity style={styles.voteButton}>
                <Ionicons name="arrow-up" size={24} color={theme.colors.upvote} />
              </TouchableOpacity>
              <Text
                style={[
                  styles.voteCount,
                  { color: theme.colors.upvote },
                ]}
              >
                782
              </Text>
              <TouchableOpacity style={styles.voteButton}>
                <Ionicons
                  name="arrow-down"
                  size={24}
                  color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons
                name="chatbubble-outline"
                size={24}
                color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
              />
              <Text
                style={[
                  styles.actionText,
                  { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
                ]}
              >
                230
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons
                name="arrow-redo-outline"
                size={24}
                color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
              />
              <Text
                style={[
                  styles.actionText,
                  { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
                ]}
              >
                99
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text
            style={[
              styles.commentsHeader,
              { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
            ]}
          >
            Comments
          </Text>
          <View style={styles.emptyComments}>
            <Text
              style={[
                styles.emptyText,
                { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
              ]}
            >
              No comments yet. Be the first to comment!
            </Text>
          </View>
        </View>
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
  backButton: {
    padding: theme.spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  iconButton: {
    padding: theme.spacing.xs,
  },
  postContainer: {
    padding: theme.spacing.base,
    marginBottom: theme.spacing.sm,
  },
  subredditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  icon: {
    fontSize: 24,
  },
  subredditInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  subreddit: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  author: {
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: theme.colors.join,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  joinText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: theme.typography.fontSize.xl * theme.typography.lineHeight.normal,
    marginBottom: theme.spacing.md,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  content: {
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
    marginBottom: theme.spacing.lg,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.light,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  voteButton: {
    padding: theme.spacing.xs,
  },
  voteCount: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    minWidth: 40,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: theme.spacing.xs,
  },
  actionText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
  commentsSection: {
    padding: theme.spacing.base,
  },
  commentsHeader: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
  },
  emptyComments: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    textAlign: 'center',
  },
});
