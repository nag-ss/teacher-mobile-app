import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { DrawerNavigationProp } from '@react-navigation/drawer'; // Import navigation prop type
import { RootDrawerParamList } from './types'; // Define your types for the drawer screens
import SvgLoader from '@/utils/SvgLoader';

type NavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Home'>; // Specify the screen you are navigating to

const CustomDrawerContent = () => {
  const navigation = useNavigation<NavigationProp>(); // Hook with correct typing for navigation

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.iconItem} 
        onPress={() => navigation.navigate('Home')}>
        <View style={{ alignItems: 'center' }}>
            <SvgLoader svgFilePath="logo" width={50} height={50} />
            <Text>
            {'Super Slate'}
            </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconItem} 
        onPress={() => navigation.navigate('Home')}>
        <View style={{ alignItems: 'center' }}>
            <Ionicons size={18} style={[{ marginBottom: -3 }]} name="home" />;
            <Text>
            {'Dashboard'}
            </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconItem} 
        onPress={() => navigation.navigate('Settings')}>
        <View style={{ alignItems: 'center' }}>
            <Ionicons size={18} style={[{ marginBottom: -3 }]} name="settings" />;
            <Text>
            {'Settings'}
            </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconItem} 
        onPress={() => navigation.navigate('Profile')}>
        <View style={{ alignItems: 'center' }}>
            <Ionicons size={18} style={[{ marginBottom: -3 }]} name="person" />;
            <Text>
            {'User'}
            </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconItem} 
        onPress={() => navigation.navigate('SlipTest')}>
        <View style={{ alignItems: 'center' }}>
            <Ionicons size={18} style={[{ marginBottom: -3 }]} name="checkmark-circle" />;
            <Text>
            {'Slip Test'}
            </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingLeft: 15,
  },
  iconItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center'
  },
  iconLabel: {
    marginLeft: 10,
    fontSize: 18,
  },
});

export default CustomDrawerContent;
