import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { APP_CONFIG } from '@/constants/Config';

interface Props {
  onSelectQuestion: (question: string) => void;
}

export default function SampleQuestions({ onSelectQuestion }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>⚖️</Text>
      </View>
      
      <Text style={styles.title}>Nepal Legal AI Assistant</Text>
      <Text style={styles.subtitle}>
        Get instant answers about Nepal's National Penal Code, 2017
      </Text>

      <View style={styles.divider} />

      <Text style={styles.sampleHeader}>Try asking:</Text>
      
      {APP_CONFIG.SAMPLE_QUESTIONS.map((question, idx) => (
        <TouchableOpacity
          key={idx}
          style={styles.sampleButton}
          onPress={() => onSelectQuestion(question)}
          activeOpacity={0.7}
        >
          <Text style={styles.sampleIcon}>💬</Text>
          <Text style={styles.sampleText}>{question}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 48,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 22,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 24,
  },
  sampleHeader: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  sampleButton: {
    backgroundColor: Colors.cardBackground,
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    width: '100%',
    borderWidth: 2,
    borderColor: '#dbeafe',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sampleIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  sampleText: {
    fontSize: 15,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
});
