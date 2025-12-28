import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, useColorScheme, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth, useAlert } from '@/template';
import { theme } from '../constants/theme';

export default function LoginScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const { signInWithPassword, signUpWithPassword, sendOTP, verifyOTPAndLogin, operationLoading } = useAuth();
  const { showAlert } = useAlert();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Error', 'Please enter email and password');
      return;
    }

    const { error } = await signInWithPassword(email, password);
    if (error) {
      showAlert('Login Failed', error);
    } else {
      router.replace('/(tabs)');
    }
  };

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      showAlert('Error', 'Please enter email and password');
      return;
    }

    if (password !== confirmPassword) {
      showAlert('Error', 'Passwords do not match');
      return;
    }

    if (!showOtp) {
      // Send OTP
      const { error } = await sendOTP(email);
      if (error) {
        showAlert('Error', error);
      } else {
        showAlert('Success', 'Verification code sent to your email');
        setShowOtp(true);
      }
    } else {
      // Verify OTP and register
      if (!otp.trim()) {
        showAlert('Error', 'Please enter verification code');
        return;
      }

      const { error } = await verifyOTPAndLogin(email, otp, { password });
      if (error) {
        showAlert('Error', error);
      } else {
        router.replace('/(tabs)');
      }
    }
  };

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
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.logo, { color: theme.colors.primary }]}>readit</Text>
            <Text
              style={[
                styles.subtitle,
                { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
              ]}
            >
              Join the conversation
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? theme.colors.background.card.dark : theme.colors.background.card.light,
                  color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light,
                  borderColor: isDark ? theme.colors.border.dark : theme.colors.border.light,
                },
              ]}
              placeholder="Email"
              placeholderTextColor={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? theme.colors.background.card.dark : theme.colors.background.card.light,
                  color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light,
                  borderColor: isDark ? theme.colors.border.dark : theme.colors.border.light,
                },
              ]}
              placeholder="Password"
              placeholderTextColor={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            {!isLogin && (
              <>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? theme.colors.background.card.dark : theme.colors.background.card.light,
                      color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light,
                      borderColor: isDark ? theme.colors.border.dark : theme.colors.border.light,
                    },
                  ]}
                  placeholder="Confirm Password"
                  placeholderTextColor={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />

                {showOtp && (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: isDark ? theme.colors.background.card.dark : theme.colors.background.card.light,
                        color: isDark ? theme.colors.text.primary.dark : theme.colors.text.primary.light,
                        borderColor: isDark ? theme.colors.border.dark : theme.colors.border.light,
                      },
                    ]}
                    placeholder="Verification Code"
                    placeholderTextColor={isDark ? theme.colors.text.tertiary.dark : theme.colors.text.tertiary.light}
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                )}
              </>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.primary }]}
              onPress={isLogin ? handleLogin : handleRegister}
              disabled={operationLoading}
            >
              {operationLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {isLogin ? 'Log In' : showOtp ? 'Verify & Register' : 'Send Code'}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => {
                setIsLogin(!isLogin);
                setShowOtp(false);
                setOtp('');
              }}
            >
              <Text
                style={[
                  styles.switchText,
                  { color: isDark ? theme.colors.text.secondary.dark : theme.colors.text.secondary.light },
                ]}
              >
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                <Text style={{ color: theme.colors.primary, fontWeight: theme.typography.fontWeight.bold }}>
                  {isLogin ? 'Sign Up' : 'Log In'}
                </Text>
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={[styles.skipText, { color: theme.colors.primary }]}>
                Continue as Guest
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  logo: {
    fontSize: 48,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
  },
  form: {
    gap: theme.spacing.base,
  },
  input: {
    height: 50,
    borderRadius: theme.borderRadius.base,
    paddingHorizontal: theme.spacing.base,
    fontSize: theme.typography.fontSize.base,
    borderWidth: 1,
  },
  button: {
    height: 50,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
  },
  switchButton: {
    alignItems: 'center',
    marginTop: theme.spacing.base,
  },
  switchText: {
    fontSize: theme.typography.fontSize.base,
  },
  skipButton: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  skipText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semiBold,
  },
});
