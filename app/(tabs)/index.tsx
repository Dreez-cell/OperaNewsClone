import React, { useState } from 'react';
import { View, FlatList, StyleSheet, useColorScheme, RefreshControl, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { PostCard } from '../../components/reddit/PostCard';
import { useReddit } from '../../hooks/useReddit';
import { Post } from '../../types/reddit';
import { DrawerLayout } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const drawerRef = React.useRef<DrawerLayout>(null);
  
  const { posts, loading, refreshing, handleRefresh, handleVote, handleJoin, handleSave } = useReddit();
  const [selectedSort, setSelectedSort] = useState('Popular near you');

  const handleArticlePress = (post: Post) => {
    router.push({
      pathname: '/post',
      params: { id: post.id, title: post.title },
    });
  };

  const openDrawer = () => {
    router.push('/drawer');
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
        <TouchableOpacity style={styles.logoContainer}>
          <Text style={styles.logo}>reddit</Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons
            name="search-outline"
            size={24}
            color={isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.avatarButton}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </View>
          <View style={styles.onlineDot} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSort = () => (
    <TouchableOpacity
      style={[
        styles.sortBar,
        {
          backgroundColor: isDark
            ? theme.colors.background.card.dark
            : theme.colors.background.card.light,
        },
      ]}
    >
      <Text
        style={[
          styles.sortText,
          { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
        ]}
      >
        {selectedSort}
      </Text>
      <Ionicons
        name="ellipsis-horizontal"
        size={20}
        color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
      />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onPress={() => handleArticlePress(item)}
      onUpvote={() => handleVote(item.id, 'up')}
      onDownvote={() => handleVote(item.id, 'down')}
      onJoin={() => handleJoin(item.id)}
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
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderSort}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
              colors={[theme.colors.primary]}
            />
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
    gap: theme.spacing.xs,
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
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  sortText: {
    fontSize: theme.typography.fontSize.base,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
