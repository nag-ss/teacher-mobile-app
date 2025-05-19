import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Login from '../login';
import Home from '../home';
import Settings from '../settings';
import SlipTest from '../slip_test';
import { DrawerTabBarIcon, DrawerTabBarIconCustom, DrawerTabBarLogoIcon } from '@/components/navigation/TabBarIcon';
import { MaterialIcons } from '@expo/vector-icons';
import CustomDrawerContent from '@/components/navigation/Sidebar';
import Analytics from '../analytics';
import Classes from '../classes';
import Profile from '../profile';
import Logout from '../logout';
import LiveMonitoring from '../live-monitoring';
import { useSelector } from 'react-redux';

const Drawer = createDrawerNavigator();

const DrawerLayout = () => {
    const [activeStudentsCount, setActiveStudentsCount] = useState(0)
    const [totalStudentsCount, setTotalStudentsCount] = useState(0)
    const {user} = useSelector((state: any) => state.user)
    const { studentsData } = useSelector((state: any) => state.liveMonitor)
    console.log("user")
    console.log(user)
    useEffect(() => {
        setActiveStudentsCount(0)
        if(studentsData.length) {
            let aCount = 0
            for(let student of studentsData) {
                if(student.status == 'active') {
                    aCount = aCount + 1
                    
                }
            }
            setActiveStudentsCount(aCount)
            setTotalStudentsCount(studentsData.length)
        } else {
            setActiveStudentsCount(0)
            setTotalStudentsCount(0)
        }
    }, [studentsData])
  return (
    <Drawer.Navigator initialRouteName="Home"
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
      <Drawer.Screen name="Home" component={Home} 
       options={{ 
          title: user ? user.school_name : 'Keshavareddy Internation Schools',
          // drawerLabel: 'Login',
          drawerIcon: ({ color, focused }) => (
              <DrawerTabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
          drawerLabelStyle: {
              fontWeight: 'bold', // Customize label style
              marginTop: 10,      // Adjust the margin to move the label to the top
              fontSize: 14,       // Font size of the label
              textAlign: 'center', // Center the label
            },
            drawerItemStyle: {
              alignItems: 'center', // Center horizontally
            },
        }}
      />

    
      <Drawer.Screen name="Settings" component={Settings} 
            options={{ 
              // title: 'Home',
              // drawerLabel: 'Login',
              drawerIcon: ({ color, focused }) => (
                  <DrawerTabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
              ),
              drawerLabelStyle: {
                  fontWeight: 'bold', // Customize label style
                  marginTop: 10,      // Adjust the margin to move the label to the top
                  fontSize: 14,       // Font size of the label
                  textAlign: 'center', // Center the label
                },
                drawerItemStyle: {
                  alignItems: 'center', // Center horizontally
                },
          }}
          />
     <Drawer.Screen name="Analytics" component={Analytics} 
            options={{ 
              // title: 'Home',
              // drawerLabel: 'Login',
              drawerIcon: ({ color, focused }) => (
                  <DrawerTabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
              ),
              drawerLabelStyle: {
                  fontWeight: 'bold', // Customize label style
                  marginTop: 10,      // Adjust the margin to move the label to the top
                  fontSize: 14,       // Font size of the label
                  textAlign: 'center', // Center the label
                },
                drawerItemStyle: {
                  alignItems: 'center', // Center horizontally
                },
          }}
          />
    
    <Drawer.Screen name="Classes" component={Classes} 
            options={{ 
              // title: 'Home',
              // drawerLabel: 'Login',
              drawerIcon: ({ color, focused }) => (
                  <DrawerTabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
              ),
              drawerLabelStyle: {
                  fontWeight: 'bold', // Customize label style
                  marginTop: 10,      // Adjust the margin to move the label to the top
                  fontSize: 14,       // Font size of the label
                  textAlign: 'center', // Center the label
                },
                drawerItemStyle: {
                  alignItems: 'center', // Center horizontally
                },
          }}
          />

<Drawer.Screen name="Profile" component={Profile} 
            options={{ 
              // title: 'Home',
              // drawerLabel: 'Login',
              drawerIcon: ({ color, focused }) => (
                  <DrawerTabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
              ),
              drawerLabelStyle: {
                  fontWeight: 'bold', // Customize label style
                  marginTop: 10,      // Adjust the margin to move the label to the top
                  fontSize: 14,       // Font size of the label
                  textAlign: 'center', // Center the label
                },
                drawerItemStyle: {
                  alignItems: 'center', // Center horizontally
                },
          }}
          />

<Drawer.Screen name="live-monitoring" component={LiveMonitoring} 
            options={{ 
              title: `Live Monitoring                                                       Students: ${activeStudentsCount}/${totalStudentsCount}`,
              // drawerLabel: 'Login',
              drawerIcon: ({ color, focused }) => (
                  <DrawerTabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
              ),
              drawerLabelStyle: {
                  fontWeight: 'bold', // Customize label style
                  marginTop: 10,      // Adjust the margin to move the label to the top
                  fontSize: 14,       // Font size of the label
                  textAlign: 'center', // Center the label
                },
                drawerItemStyle: {
                  alignItems: 'center', // Center horizontally
                },
          }}
          />

<Drawer.Screen name="Logout" component={Logout} 
            options={{ 
              // title: 'Home',
              // drawerLabel: 'Login',
              drawerIcon: ({ color, focused }) => (
                  <DrawerTabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
              ),
              drawerLabelStyle: {
                  fontWeight: 'bold', // Customize label style
                  marginTop: 10,      // Adjust the margin to move the label to the top
                  fontSize: 14,       // Font size of the label
                  textAlign: 'center', // Center the label
                },
                drawerItemStyle: {
                  alignItems: 'center', // Center horizontally
                },
          }}
          />
      
      <Drawer.Screen name="SlipTest" component={SlipTest} 
          options={{ 
            // title: 'Home',
            // drawerLabel: 'Login',
            drawerIcon: ({ color, focused }) => (
                <DrawerTabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
            ),
            drawerLabelStyle: {
                fontWeight: 'bold', // Customize label style
                marginTop: 10,      // Adjust the margin to move the label to the top
                fontSize: 14,       // Font size of the label
                textAlign: 'center', // Center the label
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
