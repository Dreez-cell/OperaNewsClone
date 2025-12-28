import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Post } from '../../types/reddit';

interface PostCardProps {
  post: Post;
  onPress: () => void;
  onUpvote: () => void;
  onDownvote: () => void;
  onJoin: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPress, onUpvote, onDownvote, onJoin }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toString();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? theme.colors.background.card.dark
            : theme.colors.background.card.light,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.subredditInfo}>
          <Text style={styles.icon}>{post.subredditIcon}</Text>
          <View style={styles.headerText}>
            <Text
              style={[
                styles.subreddit,
                { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
              ]}
            >
              {post.subreddit}
            </Text>
            <Text
              style={[
                styles.meta,
                { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
              ]}
            >
              {post.postedAt}
            </Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          {!post.joined && (
            <TouchableOpacity style={styles.joinButton} onPress={onJoin}>
              <Text style={styles.joinText}>Join</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.menuButton}>
            <Ionicons
              name="ellipsis-vertical"
              size={20}
              color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
        <Text
          style={[
            styles.title,
            { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
          ]}
        >
          {post.title}
        </Text>

        {post.content && (
          <Text
            style={[
              styles.content,
              { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
            ]}
            numberOfLines={3}
          >
            {post.content}
          </Text>
        )}

        {post.imageUrl && (
          <Image source={{ uri: post.imageUrl }} style={styles.image} contentFit="cover" />
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <View style={styles.voteContainer}>
          <TouchableOpacity
            style={[
              styles.voteButton,
              post.userVote === 'up' && { backgroundColor: isDark ? '#2D2D2E' : '#F0F0F0' },
            ]}
            onPress={onUpvote}
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={post.userVote === 'up' ? theme.colors.upvote : isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.voteCount,
              {
                color: post.userVote === 'up'
                  ? theme.colors.upvote
                  : post.userVote === 'down'
                  ? theme.colors.downvote
                  : isDark
                  ? theme.colors.text.primary.dark
                  : theme.colors.text.primary.light,
              },
            ]}
          >
            {formatNumber(post.upvotes - post.downvotes)}
          </Text>
          <TouchableOpacity
            style={[
              styles.voteButton,
              post.userVote === 'down' && { backgroundColor: isDark ? '#2D2D2E' : '#F0F0F0' },
            ]}
            onPress={onDownvote}
          >
            <Ionicons
              name="arrow-down"
              size={20}
              color={post.userVote === 'down' ? theme.colors.downvote : isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
          />
          <Text
            style={[
              styles.actionText,
              { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
            ]}
          >
            {formatNumber(post.comments)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="arrow-redo-outline"
            size={20}
            color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
          />
          <Text
            style={[
              styles.actionText,
              { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
            ]}
          >
            {formatNumber(post.shares)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.md,
  },
  subredditInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  icon: {
    fontSize: 24,
  },
  headerText: {
    flex: 1,
  },
  subreddit: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  meta: {
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
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
  menuButton: {
    padding: theme.spacing.xs,
  },
  title: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.sm,
  },
  content: {
    fontSize: theme.typography.fontSize.sm,
    lineHeight: theme.typography.fontSize.sm * theme.typography.lineHeight.relaxed,
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.md,
  },
  image: {
    width: '100%',
    height: 250,
    marginTop: theme.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  voteButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  voteCount: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    minWidth: 32,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    padding: theme.spacing.xs,
  },
  actionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
