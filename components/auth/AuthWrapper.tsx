import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import LoginScreen from './LoginScreen';
import SignupScreen from './SignupScreen';
import { Colors } from '@/constants/Colors';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [showLogin, setShowLogin] = useState(true);
  const { user, isLoading, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!user) {
    return showLogin ? (
      <LoginScreen onSwitch={() => setShowLogin(false)} />
    ) : (
      <SignupScreen onSwitch={() => setShowLogin(true)} />
    );
  }

  return <>{children}</>;
}
