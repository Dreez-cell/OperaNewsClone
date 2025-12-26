import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../constants/theme';

interface EmptyStateProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.container}>
      <Ionicons
        name={icon}
        size={64}
        color={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
      />
      <Text
        style={[
          styles.title,
          { color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.description,
          { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
        ]}
      >
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.xxxl,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: theme.spacing.base,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.typography.fontSize.base,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
  },
});
