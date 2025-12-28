import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { mockCommunities, recentlyVisited } from '../services/redditService';
import { useRouter } from 'expo-router';

export default function DrawerScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const games = [
    { id: '1', name: 'Farm Merge Valley', icon: '🎮' },
    { id: '2', name: 'Quiz Planet', icon: '🧩' },
    { id: '3', name: 'Sword & Supper', icon: '⚔️' },
  ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? theme.colors.background.card.dark : theme.colors.background.card.light },
      ]}
      edges={['top']}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons
            name="close"
            size={28}
            color={isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Games Section */}
        <View style={styles.section}>
          {games.map((game) => (
            <TouchableOpacity key={game.id} style={styles.item}>
              <Text style={styles.gameIcon}>{game.icon}</Text>
              <Text
                style={[
                  styles.itemText,
                  { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
                ]}
              >
                {game.name}
              </Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.item}>
            <Ionicons
              name="game-controller-outline"
              size={24}
              color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
            />
            <Text
              style={[
                styles.itemText,
                { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
              ]}
            >
              Discover More Games
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recently Visited */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
              ]}
            >
              Recently Visited
            </Text>
            <Text
              style={[
                styles.seeAll,
                { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
              ]}
            >
              See all
            </Text>
          </View>
          {recentlyVisited.map((community) => (
            <TouchableOpacity key={community.id} style={styles.item}>
              <Text style={styles.communityIcon}>{community.icon}</Text>
              <Text
                style={[
                  styles.itemText,
                  { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
                ]}
              >
                {community.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reddit Pro */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.expandableSection,
              { borderBottomColor: isDark ? theme.colors.border.dark : theme.colors.border.light },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
              ]}
            >
              Reddit Pro
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.item}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
            />
            <Text
              style={[
                styles.itemText,
                { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
              ]}
            >
              Trends
            </Text>
          </TouchableOpacity>
        </View>

        {/* Your Communities */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.expandableSection,
              { borderBottomColor: isDark ? theme.colors.border.dark : theme.colors.border.light },
            ]}
          >
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
              ]}
            >
              Your Communities
            </Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
            />
          </TouchableOpacity>

          {mockCommunities.map((community) => (
            <TouchableOpacity key={community.id} style={styles.communityItem}>
              <View style={styles.communityLeft}>
                <Text style={styles.communityIcon}>{community.icon}</Text>
                <Text
                  style={[
                    styles.itemText,
                    { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
                  ]}
                >
                  {community.name}
                </Text>
              </View>
              <Ionicons
                name={community.joined ? 'star' : 'star-outline'}
                size={20}
                color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
              />
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  section: {
    paddingVertical: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  seeAll: {
    fontSize: theme.typography.fontSize.sm,
  },
  expandableSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
  },
  gameIcon: {
    fontSize: 24,
  },
  communityIcon: {
    fontSize: 20,
  },
  itemText: {
    fontSize: theme.typography.fontSize.base,
    flex: 1,
  },
  communityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
  },
  communityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
});
