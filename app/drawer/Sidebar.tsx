import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { usePathname } from 'expo-router';

const menuItems = [
  { icon: require('../../assets/images/sidebar/home.png'), label: 'Home', route: 'Home' },
  { icon: require('../../assets/images/sidebar/book.png'), label: 'Classes', route: 'Classes' },
  { icon: require('../../assets/images/sidebar/user.png'), label: 'Profile', route: 'Profile' },
  { icon: require('../../assets/images/sidebar/analytics.png'), label: 'Analytics', route: 'Analitics' },
  { icon: require('../../assets/images/sidebar/logout.png'), label: 'Logout', route: 'Logout' },
];
import { PixelRatio } from 'react-native';

const dpValue = 100;
const pxValue = PixelRatio.getPixelSizeForLayoutSize(dpValue);

const Sidebar = ({navigation}: any) =>  {
    
    const pathname  = usePathname();
  const [expanded, setExpanded] = useState(false);
  const widthAnim = useRef(new Animated.Value(expanded ? 220 : 48.5)).current;

  // const dpValue = 100;
// const pxValue = PixelRatio.getPixelSizeForLayoutSize(dpValue);
// console.log("pxValue", pxValue, "============================================")

  const toggleSidebar = () => {
    console.log("toggleing side bar ")
    Animated.timing(widthAnim, {
      toValue: expanded ? 48.5 : 220,
      duration: 260,
      useNativeDriver: false,
    }).start();
    setExpanded(prev => !prev);
  };

  return (
    <Animated.View style={[styles.sidebar, { width: widthAnim }]}>
      <TouchableOpacity style={styles.header} onPress={toggleSidebar}>
        {/* <MaterialCommunityIcons name="menu" size={28} color="#222" /> */}
        {   expanded &&
            <View style={styles.logoRow}>
            <Image  style={[styles.iconStyle, {width: 36, height: 36}]} source={require('../../assets/images/ss/Logo_F2.png')} />
            <Text style={styles.brand}>Super Slate</Text>
          </View>
        }
        <Image  style={[styles.iconStyle, {width: 36, height: 36}]} source={require('../../assets/images/sidebar/state-layer.png')} />
      </TouchableOpacity>
      
      {/* {expanded && <Text style={styles.caption}>DASHBOARD</Text>} */}
      {menuItems.map((item: any, idx) => (
        <TouchableOpacity
          key={item.label}
          style={[styles.menuItem, pathname == '/'+item.label ? styles.selectedMenu : {}, expanded ? {width: 200} : {justifyContent: 'center'}]}
          onPress={() => navigation.navigate(item.route)}
        >
          {/* <MaterialCommunityIcons name={item.icon} size={24} color="#222" /> */}
          <Image  style={[styles.iconStyle, {width: 36, height: 36}]} source={item.icon} />
          {expanded && <Text style={styles.menuLabel}>{item.label}</Text>}
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}
export default Sidebar
const styles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    left: 10,
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    // backgroundColor: 'red',
    zIndex: 100,
    elevation: 12,
    borderRightWidth: 1,
    borderRightColor: '#EFEFEF',
    alignItems: 'flex-start',
    paddingTop: 18,
    paddingHorizontal: 9.15
  },
  header: { 
    // marginLeft: 1, 
    marginBottom: 18, 
    flexDirection: 'row',
    //  backgroundColor:  'yellow' 
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 13, marginLeft: 13 },
  brand: { marginLeft: 10, fontWeight: 'bold', fontSize: 18 },
  caption: { marginLeft: 14, color: '#888', fontSize: 12, marginBottom: 13 },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    // justifyContent: 'center',
    // paddingVertical: 8, 
    paddingHorizontal: 0, 
    borderRadius: 8, 
    marginBottom: 16, 
    width: 27.4,
    height: 27.4
    // margin: 5 
  },
  menuLabel: { 
    marginLeft: 13, 
    fontSize: 16, color: '#222' },
  iconStyle: {
    // marginLeft: 3
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectedMenu: {
    backgroundColor: '#21C17C',
  }
});
