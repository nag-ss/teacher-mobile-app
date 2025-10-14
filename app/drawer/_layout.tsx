import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Sidebar from './Sidebar'
import DrawerLayout from './menu';
import Home from '../home';
import Classes from '../classes';
import Analytics from '../analytics';
import Profile from '../profile';
import Logout from '../logout';
import LiveMonitoring from '../live-monitoring';

const Stack = createStackNavigator();

export default function App() {
    const navigation = useNavigation<any>()
  return (
        <View style={styles.container}>
        <Sidebar navigation={navigation} />
        <View style={[styles.content]}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Classes" component={Classes} />
            <Stack.Screen name="Analytics" component={Analytics} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="live-monitoring" component={LiveMonitoring} />
          </Stack.Navigator>
        </View>
      </View>
      
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  content: { flex: 1 }, // Adjust if sidebar width changes
});
