import React from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface MenuItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
}

const menuItems: MenuItem[] = [
  { id: 'notifications', icon: 'notifications-outline', title: 'Notifications', subtitle: 'Manage your alerts' },
  { id: 'interests', icon: 'heart-outline', title: 'My Interests', subtitle: 'Personalize your feed' },
  { id: 'language', icon: 'globe-outline', title: 'Language', subtitle: 'English' },
  { id: 'settings', icon: 'settings-outline', title: 'Settings', subtitle: 'App preferences' },
  { id: 'privacy', icon: 'shield-checkmark-outline', title: 'Privacy', subtitle: 'Data and security' },
  { id: 'help', icon: 'help-circle-outline', title: 'Help & Support' },
  { id: 'about', icon: 'information-circle-outline', title: 'About Opera News' },
];

export default function ProfileScreen() {
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
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
            ]}
          >
            Profile
          </Text>
        </View>

        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: isDark
                ? theme.colors.background.card.dark
                : theme.colors.background.card.light,
            },
          ]}
        >
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>
          </View>
          <Text
            style={[
              styles.userName,
              { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
            ]}
          >
            Guest User
          </Text>
          <TouchableOpacity style={styles.signInButton}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                {
                  backgroundColor: isDark
                    ? theme.colors.background.card.dark
                    : theme.colors.background.card.light,
                  borderBottomColor: isDark ? theme.colors.border.dark : theme.colors.border.light,
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
                />
                <View style={styles.menuItemText}>
                  <Text
                    style={[
                      styles.menuItemTitle,
                      {
                        color: isDark
                          ? theme.colors.text.primary.dark
                          : theme.colors.text.primary.light,
                      },
                    ]}
                  >
                    {item.title}
                  </Text>
                  {item.subtitle && (
                    <Text
                      style={[
                        styles.menuItemSubtitle,
                        {
                          color: isDark
                            ? theme.colors.text.secondary.dark
                            : theme.colors.text.secondary.light,
                        },
                      ]}
                    >
                      {item.subtitle}
                    </Text>
                  )}
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.versionContainer}>
          <Text
            style={[
              styles.versionText,
              {
                color: isDark
                  ? theme.colors.text.tertiary.dark
                  : theme.colors.text.tertiary.light,
              },
            ]}
          >
            Opera News v1.0.0
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
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  profileCard: {
    marginHorizontal: theme.spacing.base,
    marginTop: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  avatarContainer: {
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.md,
  },
  signInButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  menuSection: {
    marginTop: theme.spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
  menuItemSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    marginTop: 2,
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  versionText: {
    fontSize: theme.typography.fontSize.sm,
  },
});
