import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}><Text style={styles.headerTitle}>About LexNepal AI</Text></View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🇳🇵 What is LexNepal AI?</Text>
          <Text style={styles.text}>LexNepal AI is your intelligent assistant for understanding Nepal's legal system.</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚖️ Features</Text>
          <Text style={styles.text}>• Ask questions in plain English{'\n'}• Get answers based on Nepal's legal codes{'\n'}• Access information 24/7</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>Made with ❤️ for Nepal</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: 20, backgroundColor: Colors.primary },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  content: { flex: 1, padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  text: { fontSize: 15, color: Colors.textLight, lineHeight: 22 },
  footer: { alignItems: 'center', paddingVertical: 32 },
  footerText: { fontSize: 16, color: Colors.text, marginBottom: 8 },
  version: { fontSize: 12, color: Colors.textLight },
});
