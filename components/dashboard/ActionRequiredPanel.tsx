import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

type ActionItem = {
  id: string;
  subject: string;
  body: string;
  meta: string;
  cta: string;
};

/** Preview items — replace with API data when wired. */
const PREVIEW_ACTIONS: ActionItem[] = [
  {
    id: '1',
    subject: 'Geometry VII-B',
    body: ' reflection from yesterday',
    meta: 'Mon 1:30 · 3 taps',
    cta: 'Reflect',
  },
  {
    id: '2',
    subject: 'Trigonometry VII-A',
    body: ' tomorrow 9:10 is unprepped',
    meta: 'Plan written · starts on its own',
    cta: 'Prep class',
  },
];

const ActionRequiredPanel = () => {
  const actions = PREVIEW_ACTIONS;
  const hasActions = actions.length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Needs you</Text>
          {hasActions ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{actions.length}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.subtitle}>
          Things only you can do. Each clears itself when done.
        </Text>
      </View>

      {hasActions ? (
        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {actions.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={styles.dot} />
                <View style={styles.rowText}>
                  <Text style={styles.rowTitle} numberOfLines={2}>
                    <Text style={styles.rowSubject}>{item.subject}</Text>
                    {item.body}
                  </Text>
                  <Text style={styles.rowMeta} numberOfLines={1}>
                    {item.meta}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.ctaButton} activeOpacity={0.7}>
                <Text style={styles.ctaText} numberOfLines={1}>
                  {item.cta}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>You're all caught up</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    alignItems: 'stretch',
    paddingTop: 20,
    paddingBottom: 8,
    paddingHorizontal: 24,
    width: '100%',
    height: 458,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EDEBE6',
    borderRadius: 16,
    alignSelf: 'stretch',
    flexGrow: 0,
    marginTop: 'auto',
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 4,
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'stretch',
  },
  title: {
    height: 24,
    fontSize: 16,
    lineHeight: 24,
    color: '#1F1E1C',
    fontFamily: 'Montserrat_600SemiBold',
    fontStyle: 'normal',
    includeFontPadding: false,
    flexGrow: 0,
  },
  badge: {
    minWidth: 28,
    height: 28,
    paddingHorizontal: 8,
    borderRadius: 14,
    backgroundColor: '#F1EFEA',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    fontStyle: 'normal',
    includeFontPadding: false,
    textAlign: 'center',
    textAlignVertical: 'center',
    flexGrow: 0,
  },
  subtitle: {
    alignSelf: 'stretch',
    minHeight: 16,
    fontSize: 12,
    lineHeight: 16,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    fontStyle: 'normal',
    includeFontPadding: false,
    flexGrow: 0,
  },
  list: {
    flex: 1,
    alignSelf: 'stretch',
  },
  listContent: {
    paddingBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EDEBE6',
    alignSelf: 'stretch',
  },
  rowLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    minWidth: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D69A1E',
    marginTop: 6,
    flexShrink: 0,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'column',
    gap: 4,
  },
  rowTitle: {
    alignSelf: 'stretch',
    minHeight: 20,
    fontSize: 14,
    lineHeight: 20,
    color: '#1F1E1C',
    fontFamily: 'Inter_400Regular',
    fontStyle: 'normal',
    includeFontPadding: false,
    flexGrow: 0,
  },
  rowSubject: {
    fontFamily: 'Inter_700Bold',
    color: '#1F1E1C',
  },
  rowMeta: {
    alignSelf: 'stretch',
    minHeight: 16,
    fontSize: 12,
    lineHeight: 16,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    fontStyle: 'normal',
    includeFontPadding: false,
    flexGrow: 0,
  },
  ctaButton: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EDEBE6',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  ctaText: {
    fontSize: 12,
    lineHeight: 16,
    color: '#1F1E1C',
    fontFamily: 'Inter_600SemiBold',
    fontStyle: 'normal',
    includeFontPadding: false,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  emptyText: {
    minHeight: 20,
    fontSize: 14,
    lineHeight: 20,
    color: '#8A8880',
    fontFamily: 'Inter_400Regular',
    fontStyle: 'normal',
    includeFontPadding: false,
    textAlign: 'center',
    flexGrow: 0,
  },
});

export default ActionRequiredPanel;
