import React from 'react';
import { View, Text, StyleSheet, useColorScheme, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

export default function CreateScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const createOptions = [
    { id: 'post', icon: 'document-text-outline', title: 'Create Post', description: 'Share text, images, videos, and links' },
    { id: 'poll', icon: 'stats-chart-outline', title: 'Create Poll', description: 'Get opinions from the community' },
    { id: 'image', icon: 'image-outline', title: 'Upload Image', description: 'Share photos with Reddit' },
    { id: 'video', icon: 'videocam-outline', title: 'Upload Video', description: 'Share video content' },
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
          Create
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {createOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              {
                backgroundColor: isDark
                  ? theme.colors.background.card.dark
                  : theme.colors.background.card.light,
              },
            ]}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: isDark ? theme.colors.background.secondary.dark : theme.colors.background.secondary.light },
              ]}
            >
              <Ionicons
                name={option.icon as any}
                size={32}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.optionText}>
              <Text
                style={[
                  styles.optionTitle,
                  { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
                ]}
              >
                {option.title}
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
                ]}
              >
                {option.description}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
            />
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
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    marginBottom: theme.spacing.xs,
  },
  optionDescription: {
    fontSize: theme.typography.fontSize.sm,
  },
});
