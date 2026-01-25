import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/types';
import { Colors } from '@/constants/Colors';
import SourceCard from './SourceCard';

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.type === 'user';

  return (
    <View style={styles.container}>
      <View style={[
        styles.messageBubble,
        isUser ? styles.userBubble : styles.aiBubble
      ]}>
        <Text style={isUser ? styles.userText : styles.aiText}>
          {message.text}
        </Text>
      </View>

      {message.sources && message.sources.length > 0 && (
        <View style={styles.sourcesContainer}>
          <Text style={styles.sourcesHeader}>📚 Legal References:</Text>
          {message.sources.slice(0, 3).map((source, idx) => (
            <SourceCard key={idx} source={source} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  messageBubble: {
    maxWidth: '85%',
    padding: 14,
    borderRadius: 18,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.userBubble,
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.aiBubble,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 4,
  },
  userText: {
    color: Colors.userText,
    fontSize: 15,
    lineHeight: 22,
  },
  aiText: {
    color: Colors.aiText,
    fontSize: 15,
    lineHeight: 22,
  },
  sourcesContainer: {
    marginTop: 12,
    marginLeft: 8,
  },
  sourcesHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 10,
  },
});
