import React, { useState } from 'react';
import { View, FlatList, StyleSheet, useColorScheme, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { NewsCard } from '../../components/news/NewsCard';
import { CategoryTabs } from '../../components/news/CategoryTabs';
import { EmptyState } from '../../components/news/EmptyState';
import { useNews } from '../../hooks/useNews';
import { newsCategories } from '../../services/newsService';
import { NewsArticle } from '../../types/news';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const [activeCategory, setActiveCategory] = useState('all');
  const { articles, loading, refreshing, handleRefresh, handleToggleSave } = useNews(activeCategory);

  const handleArticlePress = (article: NewsArticle) => {
    router.push({
      pathname: '/article',
      params: { id: article.id, title: article.title },
    });
  };

  const renderHeader = () => (
    <CategoryTabs
      categories={newsCategories}
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
    />
  );

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
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={articles}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderHeader}
          stickyHeaderIndices={[0]}
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
            <EmptyState
              icon="newspaper-outline"
              title="No News Available"
              description="There are no articles in this category yet. Check back later!"
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
