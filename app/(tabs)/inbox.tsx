import React from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function InboxScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const notifications = [
    {
      id: '1',
      type: 'upvote',
      icon: 'arrow-up-circle',
      color: theme.colors.upvote,
      title: 'Your post got 100 upvotes!',
      time: '2h ago',
      read: false,
    },
  ];

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
          Inbox
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationCard,
              {
                backgroundColor: notification.read
                  ? isDark
                    ? theme.colors.background.card.dark
                    : theme.colors.background.card.light
                  : isDark
                  ? theme.colors.background.secondary.dark
                  : theme.colors.background.secondary.light,
              },
            ]}
          >
            <Ionicons name={notification.icon as any} size={32} color={notification.color} />
            <View style={styles.notificationContent}>
              <Text
                style={[
                  styles.notificationTitle,
                  { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
                ]}
              >
                {notification.title}
              </Text>
              <Text
                style={[
                  styles.notificationTime,
                  { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
                ]}
              >
                {notification.time}
              </Text>
            </View>
            {!notification.read && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.base,
  },
  notificationContent: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  notificationTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.xs,
  },
  notificationTime: {
    fontSize: theme.typography.fontSize.sm,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
  },
});
