import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';
import { useAuth } from '@/template';
import { useRouter } from 'expo-router';
import { fetchUserAnalytics } from '../../services/readitService';
import { UserAnalytics } from '../../types/readit';

export default function InboxScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user } = useAuth();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user]);

  const loadAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    const data = await fetchUserAnalytics(user.id);
    setAnalytics(data);
    setLoading(false);
  };

  const StatCard = ({ icon, label, value, color }: any) => (
    <View
      style={[
        styles.statCard,
        {
          backgroundColor: isDark
            ? theme.colors.background.card.dark
            : theme.colors.background.card.light,
        },
      ]}
    >
      <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text
        style={[
          styles.statValue,
          { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
        ]}
      >
        {value.toLocaleString()}
      </Text>
      <Text
        style={[
          styles.statLabel,
          { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
        ]}
      >
        {label}
      </Text>
    </View>
  );

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
            name="person-outline"
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
            Log in to view your profile and analytics
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
          Profile
        </Text>
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Ionicons
            name="settings-outline"
            size={24}
            color={isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.avatarText}>
              {user.username?.[0]?.toUpperCase() || user.email[0]?.toUpperCase()}
            </Text>
          </View>
          <Text
            style={[
              styles.username,
              { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
            ]}
          >
            {user.username || user.email}
          </Text>
          <Text
            style={[
              styles.email,
              { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
            ]}
          >
            {user.email}
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : analytics ? (
          <>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
              ]}
            >
              Your Analytics
            </Text>
            
            <View style={styles.statsGrid}>
              <StatCard
                icon="star"
                label="Karma"
                value={analytics.karma_score}
                color={theme.colors.primary}
              />
              <StatCard
                icon="document-text"
                label="Posts"
                value={analytics.total_posts}
                color={theme.colors.secondary}
              />
              <StatCard
                icon="chatbubble"
                label="Comments"
                value={analytics.total_comments}
                color="#7C3AED"
              />
              <StatCard
                icon="arrow-up"
                label="Upvotes"
                value={analytics.total_upvotes_received}
                color={theme.colors.upvote}
              />
              <StatCard
                icon="people"
                label="Followers"
                value={analytics.total_followers}
                color="#10B981"
              />
              <StatCard
                icon="person-add"
                label="Following"
                value={analytics.total_following}
                color="#F59E0B"
              />
            </View>
          </>
        ) : null}

        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[
              styles.menuItem,
              {
                backgroundColor: isDark
                  ? theme.colors.background.card.dark
                  : theme.colors.background.card.light,
              },
            ]}
          >
            <Ionicons
              name="bookmark-outline"
              size={24}
              color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
            />
            <Text
              style={[
                styles.menuText,
                { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
              ]}
            >
              Saved Posts
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuItem,
              {
                backgroundColor: isDark
                  ? theme.colors.background.card.dark
                  : theme.colors.background.card.light,
              },
            ]}
          >
            <Ionicons
              name="time-outline"
              size={24}
              color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
            />
            <Text
              style={[
                styles.menuText,
                { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
              ]}
            >
              History
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
            />
          </TouchableOpacity>
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
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  username: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.typography.fontSize.base,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    paddingHorizontal: theme.spacing.base,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.base,
    gap: theme.spacing.sm,
  },
  statCard: {
    width: '48%',
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: theme.typography.fontSize.sm,
  },
  menuSection: {
    marginTop: theme.spacing.xl,
    paddingHorizontal: theme.spacing.base,
    gap: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.md,
  },
  menuText: {
    flex: 1,
    fontSize: theme.typography.fontSize.base,
  },
  loadingContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
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
  },
});
