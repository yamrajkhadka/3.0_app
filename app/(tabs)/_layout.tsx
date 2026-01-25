import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
import { Colors } from '@/constants/Colors';
export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: Colors.primary, headerShown: false, tabBarStyle: { height: 60, paddingBottom: 8, paddingTop: 8 } }}>
      <Tabs.Screen name="index" options={{ title: 'Chat', tabBarIcon: () => <Text style={{ fontSize: 26 }}>💬</Text> }} />
      <Tabs.Screen name="about" options={{ title: 'About', tabBarIcon: () => <Text style={{ fontSize: 26 }}>ℹ️</Text> }} />
    </Tabs>
  );
}
