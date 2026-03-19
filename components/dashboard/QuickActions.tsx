import React from 'react';
import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { Colors } from '@/constants/Colors';
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
  containerStyle?: StyleProp<ViewStyle>;
  headerTextStyle?: StyleProp<TextStyle>;
  cardsContainerStyle?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  subTitleStyle?: StyleProp<TextStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonTitleStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<ImageStyle>;
  iconWrapperStyle?: StyleProp<ViewStyle>;
  showIconWrapper?: boolean;
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

const QuickActions = ({
  title = 'Quick Actions',
  items = defaultItems,
  containerStyle,
  headerTextStyle,
  cardsContainerStyle,
  cardStyle,
  titleStyle,
  subTitleStyle,
  buttonStyle,
  buttonTitleStyle,
  iconStyle,
  iconWrapperStyle,
  showIconWrapper = false,
}: QuickActionsProps) => (
  <View style={[styles.container, containerStyle]}>
    <Text style={[styles.headerText, headerTextStyle]}>{title}</Text>
    <View style={[styles.cardsContainer, cardsContainerStyle]}>
      {items.map((item) => (
        <View key={item.title} style={[styles.card, cardStyle]}>
          <View style={styles.cardHeader}>
            {showIconWrapper ? (
              <View style={[styles.iconWrapper, iconWrapperStyle]}>
                <Image style={[styles.icon, iconStyle]} source={item.icon} />
              </View>
            ) : (
              <Image style={[styles.icon, iconStyle]} source={item.icon} />
            )}
            <Text style={[styles.title, titleStyle]}>{item.title}</Text>
          </View>
          <Text style={[styles.subTitle, subTitleStyle]}>{item.description}</Text>
          <Button
            title={item.cta}
            buttonStyle={[styles.button, buttonStyle]}
            titleStyle={[styles.buttonTitle, buttonTitleStyle]}
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
    marginBottom: 5,
    borderRadius: 10,
    padding: 15,
  },
  headerText: {
    padding: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: 'lightgray',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 10,
    height: 40,
  },
  button: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: 5,
  },
  buttonTitle: {
    color: 'black',
  },
});

export default QuickActions;
