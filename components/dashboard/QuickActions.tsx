import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';

export type QuickActionItem = {
  title: string;
  description: string;
  cta: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
};

type QuickActionsProps = {
  title?: string;
  items?: QuickActionItem[];
};

const defaultItems: QuickActionItem[] = [
  {
    title: 'Auto Test Generator',
    description: 'Quickly create customized tests based on grade and topic.',
    cta: 'Create',
    icon: require('../../assets/images/ss/Icons-test.png'),
  },
  {
    title: 'Assignment Generator',
    description: 'Quickly create customized tests based on grade and topic.',
    cta: 'Create',
    icon: require('../../assets/images/ss/Icons-assignment.png'),
  },
  {
    title: 'Upload Materials',
    description: 'Add notes, Assignments,  materials to share with students.',
    cta: 'Upload',
    icon: require('../../assets/images/ss/Icons-upload.png'),
  },
];

const QuickActions = ({ title = 'Quick Actions', items = defaultItems }: QuickActionsProps) => (
  <View style={styles.container}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.cardsContainer}>
      {items.map((item, index) => (
        <View key={`${item.title}-${index}`} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconWrapper}>
              <Image style={styles.icon} source={item.icon} />
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.cardTitle}>
              {item.title}
            </Text>
          </View>
          <Text style={styles.cardDescription}>{item.description}</Text>
          <Button
            title={item.cta}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            onPress={item.onPress ?? (() => {})}
          />
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 5,
    marginTop: 10,
    padding: 20,
  },
  sectionTitle: {
    padding: 0,
    paddingBottom: 16,
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18.28,
    color: '#111827',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    flex: 1,
    padding: 16,
    marginHorizontal: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cardHeader: {
    alignItems: 'flex-start',
    paddingBottom: 8,
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#9FD5C2',
    backgroundColor: '#fff',
    marginRight: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 0,
  },
  titleContainer: {
    minHeight: 20,
    justifyContent: 'flex-start',
    paddingBottom: 6,
  },
  cardTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: '#111827',
    lineHeight: 16,
    includeFontPadding: false,
  },
  cardDescription: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 11,
    color: '#6B7280',
    height: 'auto',
    paddingBottom: 10,
    lineHeight: 16,
  },
  buttonContainer: {
    paddingVertical: 0,
    marginTop: 'auto',
  },
  button: {
    height: 'auto',
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#9FD5C2',
  },
  buttonTitle: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
    lineHeight: 16,
    includeFontPadding: false,
    textAlignVertical: 'center',
    color: '#111827',
  },
});

export default QuickActions;
