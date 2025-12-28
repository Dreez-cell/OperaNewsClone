import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light,
        tabBarInactiveTintColor: isDark
          ? theme.colors.text.secondary.dark
          : theme.colors.text.secondary.light,
        tabBarStyle: {
          backgroundColor: isDark
            ? theme.colors.background.card.dark
            : theme.colors.background.card.light,
          borderTopColor: isDark ? theme.colors.border.dark : theme.colors.border.light,
          height: Platform.select({
            ios: insets.bottom + 60,
            android: insets.bottom + 60,
            default: 70,
          }),
          paddingTop: theme.spacing.sm,
          paddingBottom: Platform.select({
            ios: insets.bottom + theme.spacing.sm,
            android: insets.bottom + theme.spacing.sm,
            default: theme.spacing.sm,
          }),
          paddingHorizontal: theme.spacing.base,
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="answers"
        options={{
          title: 'Answers',
          tabBarIcon: ({ color, size }) => <Ionicons name="git-compare" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => <Ionicons name="chatbubbles" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: 'Inbox',
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications" size={size} color={color} />,
          tabBarBadge: 1,
        }}
      />
    </Tabs>
  );
}
