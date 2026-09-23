import LogoutConfirmModal from '@/components/Modals/LogoutConfirmModal';
import { logout } from '@/store/authSlice';
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import Sidebar from './Sidebar'
import Home from '../home';
import Classes from '../classes';
import Analytics from '../analytics';
import Profile from '../profile';
import Logout from '../logout';
import Feedback from '../feedback';
import LiveMonitoring from '../live-monitoring';
import Calendar from '../calendar';
import { PaperProvider } from "react-native-paper";
import { useDispatch } from 'react-redux';

const Stack = createStackNavigator();

export default function App() {
    const navigation = useNavigation<any>()
    const dispatch = useDispatch<any>()
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [currentRoute, setCurrentRoute] = useState('Home')

  return (
    <PaperProvider>
        <View style={styles.container}>
        <Sidebar
          navigation={navigation}
          currentRoute={currentRoute}
          onLogoutPress={() => setShowLogoutModal(true)}
        />
        <View style={[styles.content]}>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            screenListeners={{
              state: (e) => {
                const state = e.data.state;
                const routeName = state?.routes?.[state.index]?.name;
                if (routeName) setCurrentRoute(routeName);
              },
            }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Classes" component={Classes} />
            <Stack.Screen name="Calendar" component={Calendar} />
            <Stack.Screen name="Analytics" component={Analytics} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen
              name="Feedback"
              component={Feedback}
              options={{
                cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
              }}
            />
            <Stack.Screen name="live-monitoring" component={LiveMonitoring} />
          </Stack.Navigator>
        </View>
        <LogoutConfirmModal
          visible={showLogoutModal}
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={() => {
            setShowLogoutModal(false);
            dispatch(logout());
          }}
        />
      </View>
      </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row' },
  content: { flex: 1 },
});
