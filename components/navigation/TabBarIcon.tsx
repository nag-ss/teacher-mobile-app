// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';
import { type ComponentProps } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { SvgUri, SvgXml } from 'react-native-svg';
import { Asset } from 'expo-asset';
// import { Logo } from '../../assets/images/ss/';
import SvgLoader from '@/utils/SvgLoader';
// import {
//   Logo,
// } from "../../assets/images/ss";

export function TabBarIcon({ style, ...rest }: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  return <Ionicons size={28} style={[{ marginBottom: -3 }, style]} {...rest} />;
}

export function DrawerTabBarIcon({ style, ...rest }: IconProps<ComponentProps<typeof Ionicons>['name']>) {
  return <Ionicons size={16} style={[{ marginBottom: -3 }, style]} {...rest} />;
}

export function DrawerTabBarIconCustom({ style, title, size, focused, ...rest }: any) {
  return (
    <View style={{ alignItems: 'center' }}>
        <Ionicons size={16} style={[{ marginBottom: -3 }, style]} {...rest} />;
        <Text style={{ fontSize: size / 2, color: focused ? '#007AFF' : '#ccc' }}>
          {title}
        </Text>
      </View>
  )
  
}

export function DrawerTabBarLogoIcon({ style, title, size, focused, ...rest }: any) {
  return (
    <View style={{ alignItems: 'center' }}>
        {/* <Image source={require('../../assets/images/ss/Logo.svg')} style={{width: 100, height: 100, resizeMode: 'contain'}} /> */}
        
        <SvgLoader svgFilePath="logo" width={50} height={50} />
        {/* <Image source={require('../../assets/images/icon.png')} style={{width: 100, height: 100, resizeMode: 'contain'}} /> */}
        <Text style={{ fontSize: size / 2, color: focused ? '#007AFF' : '#ccc' }}>
          {'Super Slate'}
        </Text>
      </View>
  )
  
}

import { MaterialIcons } from '@expo/vector-icons';  // Import the icon library

const CustomDrawerContent = () => (
  <View style={styles.container}>
    <View style={{ alignItems: 'center' }}>
        {/* <Image source={require('../../assets/images/ss/Logo.svg')} style={{width: 100, height: 100, resizeMode: 'contain'}} /> */}
        
        <SvgLoader svgFilePath="logo" width={50} height={50} />
        {/* <Image source={require('../../assets/images/icon.png')} style={{width: 100, height: 100, resizeMode: 'contain'}} /> */}
        <Text>
          {'Super Slate'}
        </Text>
      </View>
  </View>
);

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
  },
  iconLabel: {
    marginLeft: 10,
    fontSize: 18,
  },
});

export default CustomDrawerContent;

