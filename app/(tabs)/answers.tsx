import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useAuth } from '@/template';
import { fetchTrending } from '../../services/readitService';
import { Hashtag, TrendingTopic } from '../../types/readit';

export default function AnswersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();
  const [trendingData, setTrendingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrending();
  }, []);

  const loadTrending = async () => {
    setLoading(true);
    const data = await fetchTrending();
    setTrendingData(data);
    setLoading(false);
  };

  const renderHashtag = ({ item }: { item: Hashtag }) => (
    <TouchableOpacity
      style={[
        styles.hashtagCard,
        {
          backgroundColor: isDark
            ? theme.colors.background.card.dark
            : theme.colors.background.card.light,
        },
      ]}
    >
      <View style={styles.hashtagIcon}>
        <Ionicons name="trending-up" size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.hashtagContent}>
        <Text
          style={[
            styles.hashtagText,
            { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
          ]}
        >
          #{item.tag}
        </Text>
        <Text
          style={[
            styles.hashtagCount,
            { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
          ]}
        >
          {item.use_count} posts
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
      />
    </TouchableOpacity>
  );

  const renderTopic = ({ item }: { item: TrendingTopic }) => (
    <View
      style={[
        styles.topicCard,
        {
          backgroundColor: isDark
            ? theme.colors.background.card.dark
            : theme.colors.background.card.light,
        },
      ]}
    >
      <Text
        style={[
          styles.topicTitle,
          { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
        ]}
      >
        {item.topic}
      </Text>
      <Text
        style={[
          styles.topicDescription,
          { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
        ]}
      >
        {item.description}
      </Text>
      <View style={styles.relevanceBadge}>
        <Ionicons name="flame" size={16} color={theme.colors.primary} />
        <Text style={[styles.relevanceText, { color: theme.colors.primary }]}>
          {Math.round(item.relevance * 100)}% relevant
        </Text>
      </View>
    </View>
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
      
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
          ]}
        >
          Trending
        </Text>
        <TouchableOpacity onPress={loadTrending}>
          <Ionicons
            name="refresh"
            size={24}
            color={isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light}
          />
        </TouchableOpacity>
      </View>

      {loading || !trendingData ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="trending-up-outline"
            size={80}
            color={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
          />
          <Text
            style={[
              styles.emptyText,
              { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
            ]}
          >
            Loading trending content...
          </Text>
        </View>
      ) : (
        <FlatList
          data={[]}
          renderItem={() => null}
          ListHeaderComponent={
            <>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
                ]}
              >
                AI-Powered Insights
              </Text>
              <FlatList
                data={trendingData.aiAnalysis?.trends || []}
                renderItem={renderTopic}
                keyExtractor={(item, index) => `topic-${index}`}
                scrollEnabled={false}
              />

              <Text
                style={[
                  styles.sectionTitle,
                  { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
                ]}
              >
                Trending Hashtags
              </Text>
              <FlatList
                data={trendingData.hashtags || []}
                renderItem={renderHashtag}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </>
          }
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
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
  },
  hashtagCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
  },
  hashtagIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    backgroundColor: 'rgba(255, 69, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  hashtagContent: {
    flex: 1,
  },
  hashtagText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  hashtagCount: {
    fontSize: theme.typography.fontSize.sm,
  },
  topicCard: {
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  topicTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  topicDescription: {
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
    marginBottom: theme.spacing.sm,
  },
  relevanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  relevanceText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxl,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});
