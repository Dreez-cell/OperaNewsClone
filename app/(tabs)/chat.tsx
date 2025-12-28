import React, { useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useMessages } from '../../hooks/useMessages';
import { useAuth } from '@/template';
import { DirectMessage } from '../../types/readit';

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();
  const { conversations, loading } = useMessages();
  const [searchQuery, setSearchQuery] = useState('');

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return `${Math.floor(diffMs / (1000 * 60))}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 168) return `${Math.floor(diffHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getOtherUser = (message: DirectMessage) => {
    if (!user) return null;
    return message.sender_id === user.id ? message.receiver : message.sender;
  };

  const groupedConversations = conversations.reduce((acc, msg) => {
    const otherUser = getOtherUser(msg);
    if (!otherUser) return acc;
    
    const existingConv = acc.find(c => 
      (c.sender?.id === otherUser.id || c.receiver?.id === otherUser.id)
    );
    
    if (!existingConv) {
      acc.push(msg);
    }
    
    return acc;
  }, [] as DirectMessage[]);

  const renderConversation = ({ item }: { item: DirectMessage }) => {
    const otherUser = getOtherUser(item);
    if (!otherUser) return null;

    return (
      <TouchableOpacity
        style={[
          styles.conversationCard,
          {
            backgroundColor: isDark
              ? theme.colors.background.card.dark
              : theme.colors.background.card.light,
          },
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.avatarText}>
            {otherUser.username?.[0]?.toUpperCase() || 'U'}
          </Text>
        </View>
        
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text
              style={[
                styles.userName,
                { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
              ]}
            >
              {otherUser.username || otherUser.email}
            </Text>
            <Text
              style={[
                styles.time,
                { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
              ]}
            >
              {formatTime(item.created_at)}
            </Text>
          </View>
          
          <Text
            style={[
              styles.messagePreview,
              {
                color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light,
                fontWeight: item.is_read ? theme.typography.fontWeight.regular : theme.typography.fontWeight.semiBold,
              },
            ]}
            numberOfLines={1}
          >
            {item.content}
          </Text>
        </View>
        
        {!item.is_read && item.receiver_id === user?.id && (
          <View style={styles.unreadBadge} />
        )}
      </TouchableOpacity>
    );
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
        <View style={styles.emptyContainer}>
          <Ionicons
            name="chatbubbles-outline"
            size={80}
            color={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
          />
          <Text
            style={[
              styles.emptyTitle,
              { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
            ]}
          >
            Please Log In
          </Text>
          <Text
            style={[
              styles.emptyDescription,
              { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
            ]}
          >
            Log in to chat with other users
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
      
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
          ]}
        >
          Messages
        </Text>
        <TouchableOpacity>
          <Ionicons
            name="create-outline"
            size={24}
            color={isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
        />
        <TextInput
          style={[
            styles.searchInput,
            { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
          ]}
          placeholder="Search messages..."
          placeholderTextColor={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {groupedConversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="chatbubbles-outline"
            size={80}
            color={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
          />
          <Text
            style={[
              styles.emptyTitle,
              { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
            ]}
          >
            No Messages Yet
          </Text>
          <Text
            style={[
              styles.emptyDescription,
              { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
            ]}
          >
            Start chatting with other Readit users
          </Text>
        </View>
      ) : (
        <FlatList
          data={groupedConversations}
          renderItem={renderConversation}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
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
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    borderRadius: theme.borderRadius.full,
    gap: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  userName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  time: {
    fontSize: theme.typography.fontSize.xs,
  },
  messagePreview: {
    fontSize: theme.typography.fontSize.sm,
  },
  unreadBadge: {
    width: 10,
    height: 10,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: theme.typography.fontSize.base,
    marginTop: theme.spacing.md,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
  },
});
