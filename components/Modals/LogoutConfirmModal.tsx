import { useLoginLayout } from '@/hooks/useLoginLayout';
import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type LogoutConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const LogoutConfirmModal = ({ visible, onCancel, onConfirm }: LogoutConfirmModalProps) => {
  const { dialogWidth, dialogHeight, dialogPadding } = useLoginLayout();
  
  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { width: dialogWidth, maxWidth: 440, minHeight: dialogHeight, padding: dialogPadding }]}>
          <View style={styles.iconBox}>
            <View style={styles.icon}>
              <SvgLoader svgFilePath="loginLogout" width={24} height={24} />
            </View>
          </View>

          <Text style={styles.title}>Log out of Super Slate?</Text>
          <Text style={styles.body}>
            You'll need your email and password to sign back in. Any unpublished class prep is saved automatically.
          </Text>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.8}>
              <Text numberOfLines={1} style={styles.cancelText}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={onConfirm} activeOpacity={0.8}>
              <Text numberOfLines={1} style={styles.logoutText}>
                Log out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: 'rgba(26, 26, 26, 0.45)',
  },
  dialog: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.24,
    shadowRadius: 48,
    elevation: 24,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#FDF2F1',
    padding: 0,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    width: '100%',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    lineHeight: 24,
    color: '#1A1A1A',
    marginBottom: 8,
  },
  body: {
    width: '100%',
    minHeight: 72,
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: '#4A4844',
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cancelBtn: {
    width: 100,
    height: 48,
    padding: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#C8C6BE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    lineHeight: 20,
    color: '#1A1A1A',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  logoutBtn: {
    width: 100,
    height: 48,
    padding: 0,
    borderRadius: 12,
    backgroundColor: '#D65B44',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    lineHeight: 20,
    color: '#FFFFFF',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default LogoutConfirmModal;
