import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LegalSource } from '@/types';
import { Colors } from '@/constants/Colors';

interface Props {
  source: LegalSource;
}

export default function SourceCard({ source }: Props) {
  const [expanded, setExpanded] = useState(false);
  const relevanceScore = source.rel_score ? Math.round(source.rel_score * 100) : null;

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.lawTag}>
          <Text style={styles.lawTagText}>{source.law}</Text>
        </View>
        {relevanceScore && (
          <View style={styles.scoreTag}>
            <Text style={styles.scoreText}>{relevanceScore}%</Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>
        Section {source.section}: {source.section_title}
      </Text>

      <Text 
        style={styles.text}
        numberOfLines={expanded ? undefined : 2}
      >
        {source.text}
      </Text>

      <Text style={styles.expandHint}>
        {expanded ? 'Tap to collapse ▲' : 'Tap to expand ▼'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lawTag: {
    backgroundColor: '#dbeafe',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  lawTagText: {
    color: '#1e3a8a',
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scoreTag: {
    backgroundColor: '#d1fae5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scoreText: {
    color: '#065f46',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  text: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 19,
  },
  expandHint: {
    fontSize: 11,
    color: Colors.textLight,
    marginTop: 6,
    fontStyle: 'italic',
  },
});
