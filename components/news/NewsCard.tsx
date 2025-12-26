import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { NewsArticle } from '../../types/news';

interface NewsCardProps {
  article: NewsArticle;
  onPress: () => void;
  onSave: () => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, onPress, onSave }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? theme.colors.background.card.dark
            : theme.colors.background.card.light,
          borderBottomColor: isDark ? theme.colors.border.dark : theme.colors.border.light,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
            ]}
            numberOfLines={3}
          >
            {article.title}
          </Text>
          
          <View style={styles.metaContainer}>
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
              {article.source}
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
              {article.publishedAt}
            </Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image source={{ uri: article.imageUrl }} style={styles.image} contentFit="cover" />
          <TouchableOpacity
            style={[
              styles.saveButton,
              {
                backgroundColor: isDark
                  ? theme.colors.background.card.dark
                  : theme.colors.background.card.light,
              },
            ]}
            onPress={onSave}
          >
            <Ionicons
              name={article.saved ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={article.saved ? theme.colors.primary : isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
  },
  content: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.normal,
    marginBottom: theme.spacing.sm,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  source: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.text.secondary.light,
    marginHorizontal: theme.spacing.xs,
  },
  time: {
    fontSize: theme.typography.fontSize.xs,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.base,
  },
  saveButton: {
    position: 'absolute',
    top: theme.spacing.xs,
    right: theme.spacing.xs,
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
});
