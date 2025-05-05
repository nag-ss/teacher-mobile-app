import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { DrawerNavigationProp } from '@react-navigation/drawer'; // Import navigation prop type
import { RootDrawerParamList } from './types'; // Define your types for the drawer screens
import SvgLoader from '@/utils/SvgLoader';
import { usePathname, useRouter } from 'expo-router';

type NavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Home'>; // Specify the screen you are navigating to

const CustomDrawerContent = () => {
  const navigation = useNavigation<NavigationProp>(); // Hook with correct typing for navigation
  const pathname  = usePathname();
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.iconItem, {marginBottom: 20}]} 
        onPress={() => navigation.navigate('Home')}>
        <View style={styles.menuContent}>
            {/* <SvgLoader svgFilePath="logo" width={50} height={50} /> */}
            <Image  style={[styles.iconStyle, {width: 60, height: 60}]} source={require('../../assets/images/ss/Logo.png')} />
            <Text style={{fontSize: 25}}>
            {'Super Slate'}
            </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconItem} 
        onPress={() => navigation.navigate('Home')}>
        <View style={[styles.submenuContent, pathname == '/Home' ? styles.selectedMenu : {}]}>
            <Image  style={[styles.iconStyle, {width: 30, height: 30}]} source={require('../../assets/images/ss/home-menu.png')} />
            <Text style={styles.menuText}>
            {'Dashboard'}
            </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconItem} 
        onPress={() => navigation.navigate('Classes')}>
        <View style={[styles.submenuContent, pathname == '/Classes' ? styles.selectedMenu : {}]}>
            <Image  style={[styles.iconStyle, {width: 30, height: 30}]} source={require('../../assets/images/ss/classes-menu.png')} />
            <Text style={styles.menuText}>
            {'Classes'}
            </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconItem} 
        onPress={() => navigation.navigate('Analytics')}>
        <View style={[styles.submenuContent, pathname == '/Analytics' ? styles.selectedMenu : {}]}>
            <Image  style={[styles.iconStyle, {width: 30, height: 30}]} source={require('../../assets/images/ss/analytics-menu.png')} />
            <Text style={styles.menuText}>
            {'Analitics'}
            </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconItem} 
        onPress={() => navigation.navigate('Profile')}>
        <View style={[styles.submenuContent, pathname == '/profile' ? styles.selectedMenu : {}]}>
            <Image  style={[styles.iconStyle, {width: 30, height: 30}]} source={require('../../assets/images/ss/profile-menu.png')} />
            <Text style={styles.menuText}>
            {'Profile'}
            </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.iconItem} 
        onPress={() => navigation.navigate('Logout')}>
        <View style={[styles.submenuContent, pathname == '/Logout' ? styles.selectedMenu : {}]}>
            <Image  style={[styles.iconStyle, {width: 30, height: 30}]} source={require('../../assets/images/ss/logout-menu.png')} />
            <Text style={styles.menuText}>
            {'Log Out'}
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
    // backgroundColor: 'red'
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
  menuContent: { 
    alignItems: 'center', 
    flexDirection: 'row' ,
    // backgroundColor: 'yellow',
    width: '100%'
  },
  submenuContent: {
    alignItems: 'center', 
    flexDirection: 'row' ,
    // backgroundColor: 'yellow',
    width: '100%',
    paddingHorizontal: 15,
    marginRight: 15,
    height: 50,
    
    borderRadius: 5
  },
  iconStyle: {
    marginRight: 10
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  selectedMenu: {
    backgroundColor: '#21C17C',
  }
});

export default CustomDrawerContent;
