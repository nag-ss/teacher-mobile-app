import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { Colors } from '@/constants/Colors';
import {
  PAGE_COUNT,
  FEEDBACK_QUESTIONS,
  initialForm,
  type FormState,
} from '@/constants/feedbackConstants';
import { FeedbackHeader } from '@/components/feedback/FeedbackHeader';
import FeedbackQuestionCard from '@/components/feedback/FeedbackQuestionCard';
import { RoleDropdown } from '@/components/feedback/RoleDropdown';
import SubmitFeedbackModal from '@/components/feedback/SubmitFeedbackModal';
import { submitFeedback as submitFeedbackThunk } from '@/store/feedbackSlice';

const Feedback = () => {
  const navigation = useNavigation<any>();
  const redirectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [requiredErrors, setRequiredErrors] = useState<Array<'name' | 'role' | 'school'>>([]);
  const dispatch = useDispatch<any>();

  const goToHome = () => {
    if (redirectTimerRef.current) {
      clearTimeout(redirectTimerRef.current);
      redirectTimerRef.current = null;
    }
    setShowSuccessModal(false);
    setForm(initialForm);
    setPage(1);
    navigation.navigate('Home');
  };

  useEffect(() => {
    if (showSuccessModal) {
      redirectTimerRef.current = setTimeout(goToHome, 3000);
    }
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
        redirectTimerRef.current = null;
      }
    };
  }, [showSuccessModal]);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'name' || key === 'role' || key === 'school') {
      setRequiredErrors((prev) => prev.filter((k) => k !== key));
    }
  };

  const next = () => {
    if (page < PAGE_COUNT) setPage(page + 1);
  };
  const prev = () => {
    if (page > 1) setPage(page - 1);
  };
  const onSavePress = () => {
    const missing: Array<'name' | 'role' | 'school'> = [];
    if (!form.name?.trim()) missing.push('name');
    if (!form.role?.trim()) missing.push('role');
    if (!form.school?.trim()) missing.push('school');
    if (missing.length > 0) {
      setRequiredErrors(missing);
      setPage(1);
      return;
    }
    setRequiredErrors([]);
    setShowSubmitModal(true);
  };

  const doSubmitFeedback = async () => {
    const user_type = form.role ? form.role.toLowerCase() : 'teacher';
    const feedback = JSON.stringify(form);

    const body = new FormData();
    body.append('user_type', user_type);
    body.append('feedback', feedback);

    const res = await dispatch(submitFeedbackThunk(body));
    if (submitFeedbackThunk.fulfilled.match(res)) {
      setShowSubmitModal(false);
      setShowSuccessModal(true);
    } else {
      const payload = res.payload as any;
      const message = payload?.message || payload?.detail || 'Failed to submit feedback. Please try again.';
      const displayMessage = typeof message === 'string' ? message : JSON.stringify(message);
      Alert.alert('Error', displayMessage);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={styles.safeArea}>
        <FeedbackHeader />

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Page 1: Name, Role, School */}
          {page === 1 && (
            <>
              <View style={styles.card}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder={requiredErrors.includes('name') ? 'This field is required' : 'Please enter your name'}
                  placeholderTextColor="#9E9E9E"
                  value={form.name}
                  onChangeText={(v) => update('name', v)}
                />
              </View>
              <RoleDropdown
                value={form.role}
                open={roleDropdownOpen}
                onToggle={() => setRoleDropdownOpen(!roleDropdownOpen)}
                onSelect={(r) => {
                  update('role', r);
                  setRoleDropdownOpen(false);
                }}
                hasError={requiredErrors.includes('role')}
                emptyPlaceholder="This field is required"
                defaultPlaceholder="Select role"
              />
              <View style={styles.card}>
                <Text style={styles.label}>School *</Text>
                <TextInput
                  style={styles.input}
                  placeholder={requiredErrors.includes('school') ? 'This field is required' : 'Enter school name'}
                  placeholderTextColor="#9E9E9E"
                  value={form.school}
                  onChangeText={(v) => update('school', v)}
                />
              </View>
            </>
          )}

          {/* Questions: single array, loop by current page */}
          {FEEDBACK_QUESTIONS.filter((q) => q.page === page).map((q) => (
            <FeedbackQuestionCard
              key={q.key}
              index={q.index}
              question={q.question}
              type={q.type}
              options={q.options}
              value={form[q.key]}
              onChange={(v) => update(q.key, v)}
              placeholder={q.placeholder}
            />
          ))}

          {/* Pagination & actions */}
          <View style={styles.nav}>
            <View style={styles.navLeft}>
              <TouchableOpacity style={styles.navButton} onPress={prev} disabled={page === 1}>
                <Image
                  source={require('../../assets/images/back-icon.png')}
                  style={styles.navArrowIcon}
                />
                <Text style={styles.navButtonText}>Previous</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.navCenter}>
              <View style={styles.pagination}>
                {Array.from({ length: PAGE_COUNT }, (_, i) => i + 1).map((p) => (
                  <TouchableOpacity
                    key={p}
                    style={[styles.pageDot, p === page && styles.pageDotActive]}
                    onPress={() => setPage(p)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[styles.pageDotText, p === page && styles.pageDotTextActive]}
                    >
                      {String(p).padStart(2, '0')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.navRight}>
              {page === PAGE_COUNT ? (
                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  onPress={onSavePress}
                >
                  <Text style={styles.nextButtonText}>Save</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[styles.navButton, styles.nextButton]}
                  onPress={next}
                >
                  <Text style={styles.nextButtonText}>Next</Text>
                  <Image
                    source={require('../../assets/images/arrow_forward_ios.png')}
                    style={styles.navArrowIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>

        <SubmitFeedbackModal
          visible={showSubmitModal}
          title="Submit Feedback"
          subtitle="Are you sure you want to proceed?"
          imageSource={require('../../assets/images/feedback_submit.png')}
          primaryButtonText="Submit"
          onCancel={() => setShowSubmitModal(false)}
          onSubmit={doSubmitFeedback}
        />
        <SubmitFeedbackModal
          visible={showSuccessModal}
          title="Thank You!"
          subtitle="Submitted Successfully!"
          imageSource={require('../../assets/images/feedback_submit.png')}
          primaryButtonText="OK"
          onCancel={goToHome}
          onSubmit={goToHome}
          singleButton
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  safeArea: {
    flex: 1,
    marginHorizontal: 14,
    marginTop: 13.7,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    paddingBottom: 24,
    alignItems: 'stretch',
    width: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    width: '100%',
    alignSelf: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: '#222',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Montserrat_400Regular',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 36,
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 4,
  },
  navLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  navCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  navArrowIcon: {
    width: 14,
    height: 14,
    marginHorizontal: 6,
  },
  navButtonText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#000',
  },
  nextButton: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  nextButtonText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageDot: {
    width: 48,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 0,
    flexShrink: 0,
  },
  pageDotActive: {
    backgroundColor: '#21C17C',
    borderColor: '#21C17C',
  },
  pageDotText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  pageDotTextActive: {
    fontFamily: 'Montserrat_400Regular',
    color: '#fff',
  },
});
