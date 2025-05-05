import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ProfileField from '@/components/profile/ProfileField';
import ProfileImage from '@/components/profile/ProfileImage';
import { useSelector } from 'react-redux';
import { Button } from 'react-native-elements';
import { Colors } from '@/constants/Colors';

const Profile = () => {
    const {user} = useSelector((state: any) => state.user)
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <ProfileImage />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Settings</Text>
        <View style={styles.row}>
          <ProfileField label="First Name" value={user.first_name} />
          <ProfileField label="Employee ID" value="28" editable={false} />
        </View>
        <View style={styles.row}>
          <ProfileField label="Grade" value="VII" />
          <ProfileField label="Subjects" value={user.subjects} />
        </View>
        <View style={styles.row}>
          <ProfileField label="School" value={user.school_name}  editable={false} />
          <ProfileField label="Email Address" value={user.email}  editable={false} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        <View style={styles.row}>
          <ProfileField label="Change Password" value="********"  editable={false} />
          <ProfileField label="Availability" value="Yes"  editable={false} />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Cancel" buttonStyle={[styles.button, {backgroundColor: '#ccc'}]} titleStyle={styles.buttonTitle} onPress={() => {}} />
        <Button title="Save Changes" buttonStyle={[styles.button]} titleStyle={styles.buttonTitle} onPress={() => {}} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  section: { marginVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 12,
  },
  button: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 5
  },
  buttonTitle: {

  }
});

export default Profile;
