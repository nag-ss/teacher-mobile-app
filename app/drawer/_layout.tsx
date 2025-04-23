import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from '../login';
import Home from '../home';
import Settings from '../settings';
import { DrawerTabBarIcon, DrawerTabBarIconCustom, DrawerTabBarLogoIcon } from '@/components/navigation/TabBarIcon';
import { MaterialIcons } from '@expo/vector-icons';
import CustomDrawerContent from '@/components/navigation/Sidebar';

const Drawer = createDrawerNavigator();

const DrawerLayout = () => {
  return (
    <Drawer.Navigator initialRouteName="Login"
    drawerContent={() => <CustomDrawerContent />}
    
        screenOptions={{
            // animationEnabled: !reduceMotion,
            // headerShown: false, // Hide top header
            // drawerType: 'permanent',
            drawerStyle: {
            backgroundColor: '#f8f9fa',
            width: '30%', // Width for left menu
            borderRadius: 0,
            borderColor: 'red'
            },
        // animation: 'none', // Disable animations for Boox devices
      }}
    >
      <Drawer.Screen name="Login" component={Login} 
        options={{ 
            // title: 'Home',
            // drawerLabel: 'Login',
            drawerIcon: ({ color, focused, size }) => (
                // <DrawerTabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
                <DrawerTabBarIconCustom name={focused ? 'home' : 'home-outline'} color={color} size={size} focused={focused} title={'Login'} />
            ),
            drawerLabelStyle: {
                fontWeight: 'bold', // Make label bold
                fontSize: 14, // Font size of the label
                textAlign: 'center', // Center the label
                marginTop: 5, // Ensure there’s space below the icon
                color: '#000', // Make label color black for visibility
              },
              drawerItemStyle: {
                alignItems: 'center', // Center horizontally
                borderBlockColor: 'red',
                borderRadius: 0
              },
        }}
      />
      <Drawer.Screen name="Home" component={Home} 
      options={{ 
        title: 'Keshavareddy Internation Schools',
        // drawerLabel: 'Login',
        drawerIcon: ({ color, focused }) => (
            <DrawerTabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
        ),
        drawerLabelStyle: {
            fontWeight: 'bold', // Customize label style
            marginTop: 10,      // Adjust the margin to move the label to the top
            fontSize: 14,       // Font size of the label
            textAlign: 'center', // Center the label
            alignItems: 'center'
          },
          drawerItemStyle: {
            alignItems: 'center', // Center horizontally
          },
    }}
    />
      
    </Drawer.Navigator>
  );
};

export default DrawerLayout;
