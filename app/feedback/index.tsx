import React, { useState } from 'react';
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
} from 'react-native';
import { Colors } from '@/constants/Colors';
import FeedbackQuestionCard from '@/components/feedback/FeedbackQuestionCard';
import SubmitFeedbackModal from '@/components/feedback/SubmitFeedbackModal';

const ROLES = ['Principal', 'Teacher', 'Admin', 'Other'];

const LIKERT_OPTIONS = [
  'Highly Likely',
  'Very Likely',
  'Neutral',
  'Unlikely',
  'Highly Unlikely',
];

type FormState = {
  name: string;
  role: string;
  school: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
};

const initialForm: FormState = {
  name: '',
  role: 'Principal',
  school: '',
  q1: '',
  q2: '',
  q3: '',
  q4: '',
  q5: '',
  q6: '',
  q7: '',
  q8: '',
};

const Feedback = () => {
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<FormState>(initialForm);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const update = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => {
    if (page < 3) setPage(page + 1);
  };
  const prev = () => {
    if (page > 1) setPage(page - 1);
  };
  const onSavePress = () => {
    if (page === 3) {
      setShowSubmitModal(true);
    } else {
      doSubmitFeedback();
    }
  };

  const doSubmitFeedback = () => {
    // TODO: submit to API
    console.log('Feedback saved', form);
    setShowSubmitModal(false);
    setShowSuccessModal(true);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Feedback Session</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Image
                style={styles.headerIcon}
                source={require('../../assets/images/ss/search.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Image
                style={styles.headerIcon}
                source={require('../../assets/images/ss/Notification.png')}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Page 1: Name, Role, School + Q01–Q03 */}
          {page === 1 && (
            <>
              <View style={styles.card}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Please enter your name"
                  placeholderTextColor="#9E9E9E"
                  value={form.name}
                  onChangeText={(v) => update('name', v)}
                />
              </View>
              <View style={styles.card}>
                <Text style={styles.label}>Role</Text>
                <TouchableOpacity
                  style={[styles.input, roleDropdownOpen && styles.inputOpen]}
                  onPress={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.roleText, !form.role && styles.placeholder]}>
                    {form.role || 'Select role'}
                  </Text>
                  <Text style={[styles.chevron, roleDropdownOpen && styles.chevronUp]}>▼</Text>
                </TouchableOpacity>
                {roleDropdownOpen && (
                  <View style={styles.dropdownList}>
                    {ROLES.map((r) => (
                      <TouchableOpacity
                        key={r}
                        style={[styles.dropdownOption, r === form.role && styles.dropdownOptionSelected]}
                        onPress={() => {
                          update('role', r);
                          setRoleDropdownOpen(false);
                        }}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.dropdownOptionText}>{r}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.card}>
                <Text style={styles.label}>School</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter school name"
                  placeholderTextColor="#9E9E9E"
                  value={form.school}
                  onChangeText={(v) => update('school', v)}
                />
              </View>

              <FeedbackQuestionCard
                index={1}
                question="Do you like using our teacher app in the class ?"
                type="multiple_choice"
                options={LIKERT_OPTIONS}
                value={form.q1}
                onChange={(v) => update('q1', v)}
              />
              <FeedbackQuestionCard
                index={2}
                question="Do you think this will be helpful for the teachers to use in classroom?"
                type="multiple_choice"
                options={['Yes', 'No']}
                value={form.q2}
                onChange={(v) => update('q2', v)}
              />
              <FeedbackQuestionCard
                index={3}
                question="Was the navigation and flow intuitive/ feel natural to you?"
                type="multiple_choice"
                options={['Yes', 'No']}
                value={form.q3}
                onChange={(v) => update('q3', v)}
              />
            </>
          )}

          {/* Page 2: Q04–Q06 */}
          {page === 2 && (
            <>
              <FeedbackQuestionCard
                index={4}
                question="Will this help you to reduce the amount of time spent on correcting notes, assignments, and quizzes?"
                type="multiple_choice"
                options={LIKERT_OPTIONS}
                value={form.q4}
                onChange={(v) => update('q4', v)}
              />
              <FeedbackQuestionCard
                index={5}
                question="Which feature did you like the most in the teacher app and why?"
                type="text"
                value={form.q5}
                onChange={(v) => update('q5', v)}
                placeholder=""
              />
              <FeedbackQuestionCard
                index={6}
                question="What did you not like about the experience?"
                type="text"
                value={form.q6}
                onChange={(v) => update('q6', v)}
                placeholder=""
              />
            </>
          )}

          {/* Page 3: Q07–Q08 */}
          {page === 3 && (
            <>
              <FeedbackQuestionCard
                index={7}
                question="What are few things that you think if added to this app will help teachers the most?"
                type="text"
                value={form.q7}
                onChange={(v) => update('q7', v)}
                placeholder=""
              />
              <FeedbackQuestionCard
                index={8}
                question="Please write down your thoughts on using superslate teacher app:"
                type="text"
                value={form.q8}
                onChange={(v) => update('q8', v)}
                placeholder=""
              />
            </>
          )}

          {/* Pagination & actions */}
          <View style={styles.nav}>
            <TouchableOpacity style={styles.navButton} onPress={prev} disabled={page === 1}>
              <Image
                source={require('../../assets/images/back-icon.png')}
                style={styles.navArrowIcon}
              />
              <Text style={styles.navButtonText}>Previous</Text>
            </TouchableOpacity>
            <View style={styles.pagination}>
              {[1, 2, 3].map((p) => (
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
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={next}
              disabled={page === 3}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <Image
                source={require('../../assets/images/arrow_forward_ios.png')}
                style={styles.navArrowIcon}
              />
            </TouchableOpacity>
          </View>
          {page === 3 && (
          <TouchableOpacity style={styles.saveButton} onPress={onSavePress}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}
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
          onCancel={() => setShowSuccessModal(false)}
          onSubmit={() => setShowSuccessModal(false)}
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 64,
    borderRadius: 10,
    paddingHorizontal: 14,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  headerTitle: {
    fontWeight: '700',
    fontSize: 18,
    color: '#222',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
  },
  headerIcon: {
    width: 20,
    height: 20,
    marginLeft: 8,
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
    fontWeight: '700',
    fontSize: 13,
    color: '#222',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#222',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
  },
  inputOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  roleText: {
    fontSize: 14,
    color: '#222',
  },
  placeholder: {
    color: '#9E9E9E',
  },
  chevron: {
    fontSize: 10,
    color: '#666',
  },
  chevronUp: {
    transform: [{ rotate: '180deg' }],
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#E0E0E0',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  dropdownOptionSelected: {
    backgroundColor: '#F5F5F5',
  },
  dropdownOptionText: {
    fontSize: 14,
    color: '#222',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 12,
    width: '100%',
    paddingHorizontal: 4,
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
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  pageDotTextActive: {
    color: '#fff',
  },
  saveButton: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.primaryColor,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    marginRight: 4,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
