import React from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

export default function ArticleScreen() {
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
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
            ]}
          >
            {params.title || 'Article Title'}
          </Text>

          <View style={styles.meta}>
            <Text
              style={[
                styles.source,
                {
                  color: isDark
                    ? theme.colors.text.secondary.dark
                    : theme.colors.text.secondary.light,
                },
              ]}
            >
              Sports Daily
            </Text>
            <View style={styles.dot} />
            <Text
              style={[
                styles.time,
                {
                  color: isDark
                    ? theme.colors.text.secondary.dark
                    : theme.colors.text.secondary.light,
                },
              ]}
            >
              2h ago
            </Text>
            <View style={styles.dot} />
            <Text
              style={[
                styles.readTime,
                {
                  color: isDark
                    ? theme.colors.text.secondary.dark
                    : theme.colors.text.secondary.light,
                },
              ]}
            >
              3 min read
            </Text>
          </View>

          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80' }}
            style={styles.featuredImage}
            contentFit="cover"
          />

          <Text
            style={[
              styles.body,
              { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
            ]}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            {'\n\n'}
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            {'\n\n'}
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            {'\n\n'}
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          </Text>
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
  content: {
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: theme.typography.fontSize.xxl * theme.typography.lineHeight.normal,
    marginBottom: theme.spacing.md,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  source: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.text.secondary.light,
    marginHorizontal: theme.spacing.sm,
  },
  time: {
    fontSize: theme.typography.fontSize.sm,
  },
  readTime: {
    fontSize: theme.typography.fontSize.sm,
  },
  featuredImage: {
    width: '100%',
    height: 220,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  body: {
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
  },
});
