import React, { useState } from 'react';
import { View, FlatList, StyleSheet, useColorScheme, RefreshControl, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { PostCard } from '../../components/readit/PostCard';
import { useReadit } from '../../hooks/useReadit';
import { Post } from '../../types/readit';
import { useAuth } from '@/template';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { user } = useAuth();
  
  const [feedType, setFeedType] = useState<'home' | 'trending' | 'personalized'>('home');
  const { posts, loading, refreshing, handleRefresh, handleVote, handleJoin, handleSave, handleView } = useReadit(feedType);

  const handleArticlePress = (post: Post) => {
    handleView(post.id);
    router.push({
      pathname: '/post',
      params: { id: post.id, title: post.title },
    });
  };

  const openDrawer = () => {
    router.push('/drawer');
  };

  const openSettings = () => {
    router.push('/settings');
  };

  const renderHeader = () => (
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
      <View style={styles.headerLeft}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
          <Ionicons
            name="menu"
            size={28}
            color={isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light}
          />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>readit</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name="search-outline"
            size={24}
            color={isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarButton} onPress={openSettings}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </View>
          {user && <View style={styles.onlineDot} />}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFeedSelector = () => (
    <View
      style={[
        styles.feedSelector,
        {
          backgroundColor: isDark
            ? theme.colors.background.card.dark
            : theme.colors.background.card.light,
          borderBottomColor: isDark ? theme.colors.border.dark : theme.colors.border.light,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.feedButton,
          feedType === 'home' && styles.feedButtonActive,
        ]}
        onPress={() => setFeedType('home')}
      >
        <Ionicons
          name="home"
          size={20}
          color={feedType === 'home' ? theme.colors.primary : isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
        />
        <Text
          style={[
            styles.feedButtonText,
            {
              color: feedType === 'home'
                ? theme.colors.primary
                : isDark
                ? theme.colors.text.secondary.dark
                : theme.colors.text.secondary.light,
            },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.feedButton,
          feedType === 'trending' && styles.feedButtonActive,
        ]}
        onPress={() => setFeedType('trending')}
      >
        <Ionicons
          name="trending-up"
          size={20}
          color={feedType === 'trending' ? theme.colors.primary : isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
        />
        <Text
          style={[
            styles.feedButtonText,
            {
              color: feedType === 'trending'
                ? theme.colors.primary
                : isDark
                ? theme.colors.text.secondary.dark
                : theme.colors.text.secondary.light,
            },
          ]}
        >
          Trending
        </Text>
      </TouchableOpacity>

      {user && (
        <TouchableOpacity
          style={[
            styles.feedButton,
            feedType === 'personalized' && styles.feedButtonActive,
          ]}
          onPress={() => setFeedType('personalized')}
        >
          <Ionicons
            name="sparkles"
            size={20}
            color={feedType === 'personalized' ? theme.colors.primary : isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
          />
          <Text
            style={[
              styles.feedButtonText,
              {
                color: feedType === 'personalized'
                  ? theme.colors.primary
                  : isDark
                  ? theme.colors.text.secondary.dark
                  : theme.colors.text.secondary.light,
              },
            ]}
          >
            For You
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderItem = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onPress={() => handleArticlePress(item)}
      onUpvote={() => handleVote(item.id, 'up')}
      onDownvote={() => handleVote(item.id, 'down')}
      onJoin={() => handleJoin(item.id)}
      onSave={() => handleSave(item.id)}
    />
  );

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
      
      {renderHeader()}
      
      {loading && posts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderFeedSelector}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="newspaper-outline"
                size={80}
                color={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
                ]}
              >
                No posts yet. Be the first to post!
              </Text>
            </View>
          }
        />
      )}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  menuButton: {
    padding: theme.spacing.xs,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  iconButton: {
    padding: theme.spacing.xs,
  },
  avatarButton: {
    position: 'relative',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.success,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  feedSelector: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
    borderBottomWidth: 1,
  },
  feedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
  },
  feedButtonActive: {
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
  },
  feedButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});
