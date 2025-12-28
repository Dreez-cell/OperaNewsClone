import React from 'react';
import { View, Text, StyleSheet, useColorScheme, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const [autoplay, setAutoplay] = React.useState(true);
  const [commentJump, setCommentJump] = React.useState(true);
  const [showMature, setShowMature] = React.useState(false);

  const settingsSections = [
    {
      title: 'GENERAL',
      items: [
        { id: 'account', icon: 'person-outline', label: 'Account settings for u/Negative-Ad5603', type: 'link' },
      ],
    },
    {
      title: 'REDDIT PREMIUM',
      items: [
        { id: 'premium', icon: 'shield-checkmark-outline', label: 'Get Premium', type: 'link' },
      ],
    },
    {
      title: 'LANGUAGE SETTINGS',
      items: [
        { id: 'language', icon: 'globe-outline', label: 'Language settings', type: 'link' },
      ],
    },
    {
      title: 'VIEW OPTIONS',
      items: [
        { id: 'view', icon: 'grid-outline', label: 'Default view', subtitle: 'Card', type: 'link' },
        { id: 'thumbnails', icon: 'image-outline', label: 'Thumbnails', subtitle: 'Community default', type: 'link' },
        { id: 'mature', icon: 'person-outline', label: 'Show mature content (I am over 18)', type: 'switch', value: showMature, onChange: setShowMature },
      ],
    },
    {
      title: 'DATA USAGE',
      items: [
        { id: 'data', icon: 'warning-outline', label: 'Low data mode', type: 'link' },
      ],
    },
    {
      title: 'ACCESSIBILITY',
      items: [
        { id: 'textsize', icon: 'text-outline', label: 'Increase text size', type: 'link' },
        { id: 'media', icon: 'play-circle-outline', label: 'Media and animations', type: 'link' },
        { id: 'talkback', icon: 'accessibility-outline', label: 'TalkBack customization', type: 'link' },
      ],
    },
    {
      title: 'DARK MODE',
      items: [
        { id: 'darkmode', icon: 'moon-outline', label: 'Auto Dark Mode', subtitle: 'Follow OS setting', type: 'link' },
      ],
    },
    {
      title: 'ABOUT',
      items: [
        { id: 'rules', icon: 'document-text-outline', label: 'Reddit rules', type: 'link' },
        { id: 'privacy', icon: 'shield-outline', label: 'Privacy policy', type: 'link' },
        { id: 'agreement', icon: 'person-circle-outline', label: 'User agreement', type: 'link' },
        { id: 'acknowledgements', icon: 'document-outline', label: 'Acknowledgements', type: 'link' },
      ],
    },
    {
      title: 'SUPPORT',
      items: [
        { id: 'help', icon: 'help-circle-outline', label: 'Help Center', type: 'link' },
        { id: 'bugs', icon: 'bug-outline', label: 'Visit r/bugs', type: 'link' },
        { id: 'report', icon: 'mail-outline', label: 'Report an issue', type: 'link' },
      ],
    },
    {
      title: 'BUILD INFORMATION',
      items: [
        { id: 'version', icon: 'information-circle-outline', label: '2025.46.0.2546130', type: 'link' },
      ],
    },
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
      
      <View
        style={[
          styles.header,
          {
            backgroundColor: isDark
              ? theme.colors.background.card.dark
              : theme.colors.background.card.light,
            borderBottomColor: isDark ? theme.colors.border.dark : theme.colors.border.light,
          },
        ]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
          ]}
        >
          Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
              ]}
            >
              {section.title}
            </Text>
            {section.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.settingItem,
                  {
                    backgroundColor: isDark
                      ? theme.colors.background.card.dark
                      : theme.colors.background.card.light,
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light}
                />
                <View style={styles.settingText}>
                  <Text
                    style={[
                      styles.settingLabel,
                      { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.subtitle && (
                    <Text
                      style={[
                        styles.settingSubtitle,
                        { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
                      ]}
                    >
                      {item.subtitle}
                    </Text>
                  )}
                </View>
                {item.type === 'link' && (
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
                  />
                )}
                {item.type === 'switch' && (
                  <Switch
                    value={item.value}
                    onValueChange={item.onChange}
                    trackColor={{ false: '#767577', true: theme.colors.join }}
                    thumbColor={'#FFFFFF'}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
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
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
  section: {
    marginTop: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
  },
  settingText: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  settingLabel: {
    fontSize: theme.typography.fontSize.base,
  },
  settingSubtitle: {
    fontSize: theme.typography.fontSize.sm,
    marginTop: 2,
  },
});
