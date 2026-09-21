import SvgLoader from '@/utils/SvgLoader';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

type LogoutConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

const LogoutConfirmModal = ({ visible, onCancel, onConfirm }: LogoutConfirmModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View
        className="flex-1 items-center justify-center px-8"
        style={{ backgroundColor: 'rgba(26, 26, 26, 0.45)' }}
      >
        <View
          className="flex-col items-start flex-none"
          style={{
            width: 440,
            height: 316,
            padding: 32,
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.24,
            shadowRadius: 48,
            elevation: 24,
          }}
        >
          <View
            className="flex-row items-center justify-center flex-none"
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              backgroundColor: '#FDF2F1',
              padding: 0,
              marginBottom: 20,
            }}
          >
            <View
              className="flex-none"
              style={{
                width: 24,
                height: 24,
              }}
            >
              <SvgLoader svgFilePath="loginLogout" width={24} height={24} />
            </View>
          </View>

          <Text
            className="flex-none self-stretch"
            style={{
              width: 376,
              height: 24,
              fontFamily: 'Montserrat_700Bold',
              fontSize: 20,
              lineHeight: 24,
              color: '#1A1A1A',
              marginBottom: 8,
            }}
          >
            Log out of Super Slate?
          </Text>
          <Text
            className="flex-none self-stretch"
            style={{
              width: 376,
              height: 72,
              fontFamily: 'Inter_400Regular',
              fontSize: 16,
              lineHeight: 24,
              color: '#4A4844',
              marginBottom: 24,
            }}
          >
            You'll need your email and password to sign back in. Any unpublished class prep is saved automatically.
          </Text>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              className="flex-row items-center justify-center flex-none"
              style={{
                width: 100,
                height: 48,
                padding: 0,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#C8C6BE',
              }}
              onPress={onCancel}
              activeOpacity={0.8}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Montserrat_600SemiBold',
                  fontSize: 16,
                  lineHeight: 20,
                  color: '#1A1A1A',
                  includeFontPadding: false,
                  textAlignVertical: 'center',
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center justify-center flex-none"
              style={{
                width: 100,
                height: 48,
                padding: 0,
                borderRadius: 12,
                backgroundColor: '#D65B44',
              }}
              onPress={onConfirm}
              activeOpacity={0.8}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: 'Montserrat_600SemiBold',
                  fontSize: 16,
                  lineHeight: 20,
                  color: '#FFFFFF',
                  includeFontPadding: false,
                  textAlignVertical: 'center',
                }}
              >
                Log out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutConfirmModal;
