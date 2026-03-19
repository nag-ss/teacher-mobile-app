import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';

type CardProps = {
  title: string;
  description: string;
  cta: string;
  icon?: any;
};

const SuggestionCard = ({ title, description, cta, icon }: CardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconPlaceholder}>
        {icon ? <Image source={icon} style={styles.iconImg} /> : null}
      </View>

      <Text style={styles.cardTitle} numberOfLines={2}>
        {title}
      </Text>
      <Text style={styles.cardDesc} numberOfLines={3}>
        {description}
      </Text>

      <View style={styles.spacer} />

      <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.8}>
        <Text style={styles.ctaText}>{cta}</Text>
      </TouchableOpacity>
    </View>
  );
};

const AiSuggestionCard = () => {
  return (
    <View style={styles.wrap}>
      <SuggestionCard
        icon={require('@/assets/images/cast_for_education.png')}
        title="Reteach Trigonometry"
        description="30% of students scored below 50% in the last quiz."
        cta="Schedule Review"
      />
      <SuggestionCard
        icon={require('@/assets/images/ss/Warning.png')}
        title="Low Assignment Completion"
        description="40% of students missed the last two assignments."
        cta="Remind Students"
      />
      <SuggestionCard
        icon={require('@/assets/images/ss/p2p.png')}
        title="Provide 1-on-1 Support"
        description="3 students are struggling with recent topics."
        cta="Message Students"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  card: {
    flex: 1,
    minHeight: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#fff',
    padding: 14,
  },
  iconPlaceholder: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#9FD5C2',
    backgroundColor: '#fff',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImg: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  cardTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#111827',
    marginBottom: 6,
  },
  cardDesc: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  spacer: {
    flex: 1,
    minHeight: 10,
  },
  ctaBtn: {
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#9FD5C2',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  ctaText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 13,
    color: '#111827',
  },
});

export default AiSuggestionCard;

