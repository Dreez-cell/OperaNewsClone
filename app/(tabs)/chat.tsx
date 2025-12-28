import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

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
          Chat
        </Text>
      </View>

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
            {
              color: isDark
                ? theme.colors.text.secondary.dark
                : theme.colors.text.secondary.light,
            },
          ]}
        >
          Start chatting with other Redditors
        </Text>
      </View>
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
