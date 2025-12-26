import React from 'react';
import { View, FlatList, Text, StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { NewsCard } from '../../components/news/NewsCard';
import { EmptyState } from '../../components/news/EmptyState';
import { useNews } from '../../hooks/useNews';
import { NewsArticle } from '../../types/news';

export default function SavedScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  
  const { articles, handleToggleSave } = useNews('all');
  const savedArticles = articles.filter((article) => article.saved);

  const handleArticlePress = (article: NewsArticle) => {
    router.push({
      pathname: '/article',
      params: { id: article.id, title: article.title },
    });
  };

  const renderItem = ({ item }: { item: NewsArticle }) => (
    <NewsCard
      article={item}
      onPress={() => handleArticlePress(item)}
      onSave={() => handleToggleSave(item.id)}
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
      
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
          ]}
        >
          Saved Articles
        </Text>
      </View>

      <FlatList
        data={savedArticles}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            title="No Saved Articles"
            description="Articles you save will appear here for easy access later."
          />
        }
      />
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
});
