import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, Dimensions, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { Post } from '../../types/readit';

interface PostCardProps {
  post: Post;
  onPress: () => void;
  onUpvote: () => void;
  onDownvote: () => void;
  onJoin?: () => void;
  onSave?: () => void;
  onShare?: () => void;
  autoplayVideo?: boolean;
}

export function PostCard({
  post,
  onPress,
  onUpvote,
  onDownvote,
  onJoin,
  onSave,
  onShare,
  autoplayVideo = true,
}: PostCardProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { width: screenWidth } = Dimensions.get('window');
  
  // Video player setup
  const videoSource = post.post_type === 'video' && post.media_urls?.[0] 
    ? post.media_urls[0] 
    : null;
  
  const player = useVideoPlayer(videoSource || '', (player) => {
    player.loop = true;
    player.muted = true;
    if (autoplayVideo) {
      player.play();
    }
  });

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}m`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return `${Math.floor(diffMs / (1000 * 60))}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d`;
    return `${Math.floor(diffHours / 168)}w`;
  };

  const renderMedia = () => {
    if (post.post_type === 'video' && videoSource) {
      return (
        <VideoView
          style={styles.video}
          player={player}
          contentFit="cover"
          nativeControls={false}
        />
      );
    }

    if (post.post_type === 'image' && post.media_urls && post.media_urls.length > 0) {
      return (
        <View>
          <Image
            source={{ uri: post.media_urls[currentImageIndex] }}
            style={styles.image}
            contentFit="cover"
          />
          {post.media_urls.length > 1 && (
            <View style={styles.carousel}>
              <View style={styles.carouselDots}>
                {post.media_urls.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      {
                        backgroundColor:
                          index === currentImageIndex
                            ? theme.colors.primary
                            : isDark
                            ? theme.colors.text.tertiary.dark
                            : theme.colors.text.tertiary.light,
                      },
                    ]}
                  />
                ))}
              </View>
              <View style={styles.carouselButtons}>
                {currentImageIndex > 0 && (
                  <TouchableOpacity
                    style={[styles.carouselButton, { left: 8 }]}
                    onPress={() => setCurrentImageIndex(currentImageIndex - 1)}
                  >
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
                {currentImageIndex < post.media_urls.length - 1 && (
                  <TouchableOpacity
                    style={[styles.carouselButton, { right: 8 }]}
                    onPress={() => setCurrentImageIndex(currentImageIndex + 1)}
                  >
                    <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.imageCounter}>
                <Text style={styles.imageCounterText}>
                  {currentImageIndex + 1}/{post.media_urls.length}
                </Text>
              </View>
            </View>
          )}
        </View>
      );
    }

    return null;
  };

  const communityName = post.communities?.display_name || `r/${post.communities?.name || 'readit'}`;
  const username = post.user_profiles?.username || 'user';

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.communityInfo}>
          <View style={[styles.communityIcon, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.communityIconText}>
              {post.communities?.icon_url || '📰'}
            </Text>
          </View>
          <View style={styles.headerText}>
            <Text
              style={[
                styles.communityName,
                { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
              ]}
            >
              {communityName}
            </Text>
            <Text
              style={[
                styles.postMeta,
                { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
              ]}
            >
              u/{username} • {formatTime(post.created_at)}
            </Text>
          </View>
        </TouchableOpacity>
        
        {post.communities && onJoin && (
          <TouchableOpacity
            style={[
              styles.joinButton,
              {
                backgroundColor: post.is_joined
                  ? isDark
                    ? theme.colors.background.secondary.dark
                    : theme.colors.background.secondary.light
                  : theme.colors.join,
              },
            ]}
            onPress={onJoin}
          >
            <Text
              style={[
                styles.joinText,
                {
                  color: post.is_joined
                    ? isDark
                      ? theme.colors.text.primary.dark
                      : theme.colors.text.primary.light
                    : '#FFFFFF',
                },
              ]}
            >
              {post.is_joined ? 'Joined' : 'Join'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Title */}
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Text
          style={[
            styles.title,
            { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
          ]}
          numberOfLines={3}
        >
          {post.title}
        </Text>

        {/* Content */}
        {post.content && (
          <Text
            style={[
              styles.content,
              { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
            ]}
            numberOfLines={4}
          >
            {post.content}
          </Text>
        )}

        {/* Media */}
        {renderMedia()}
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.voteContainer}>
          <TouchableOpacity
            style={styles.voteButton}
            onPress={onUpvote}
          >
            <Ionicons
              name={post.user_vote === 'up' ? 'arrow-up' : 'arrow-up-outline'}
              size={24}
              color={post.user_vote === 'up' ? theme.colors.upvote : isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.voteCount,
              {
                color: post.user_vote === 'up'
                  ? theme.colors.upvote
                  : post.user_vote === 'down'
                  ? theme.colors.downvote
                  : isDark
                  ? theme.colors.text.primary.dark
                  : theme.colors.text.primary.light,
              },
            ]}
          >
            {formatCount(post.upvotes - post.downvotes)}
          </Text>
          <TouchableOpacity
            style={styles.voteButton}
            onPress={onDownvote}
          >
            <Ionicons
              name={post.user_vote === 'down' ? 'arrow-down' : 'arrow-down-outline'}
              size={24}
              color={post.user_vote === 'down' ? theme.colors.downvote : isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.actionButton} onPress={onPress}>
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
            {formatCount(post.comment_count)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
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
            {formatCount(post.share_count)}
          </Text>
        </TouchableOpacity>

        {onSave && (
          <TouchableOpacity style={styles.actionButton} onPress={onSave}>
            <Ionicons
              name={post.is_saved ? 'bookmark' : 'bookmark-outline'}
              size={20}
              color={post.is_saved ? theme.colors.primary : isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
    paddingVertical: theme.spacing.base,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.sm,
  },
  communityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  communityIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  communityIconText: {
    fontSize: 16,
  },
  headerText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  communityName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  postMeta: {
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
  joinButton: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  joinText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
    lineHeight: theme.typography.fontSize.lg * theme.typography.lineHeight.normal,
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.xs,
  },
  content: {
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
    paddingHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.sm,
  },
  image: {
    width: '100%',
    height: 300,
    marginTop: theme.spacing.sm,
  },
  video: {
    width: '100%',
    height: 300,
    marginTop: theme.spacing.sm,
  },
  carousel: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  carouselDots: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    justifyContent: 'center',
    gap: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: theme.borderRadius.full,
  },
  carouselButtons: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  carouselButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCounter: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.base,
  },
  imageCounterText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    marginTop: theme.spacing.sm,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.xs,
  },
  voteButton: {
    padding: theme.spacing.xs,
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
    gap: 4,
    padding: theme.spacing.xs,
  },
  actionText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
