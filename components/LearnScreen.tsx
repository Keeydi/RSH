import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {theme} from '../config/theme';

const {height: SCREEN_HEIGHT} = Dimensions.get('window');

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface EmergencyGuide {
  id: string;
  type: string;
  icon: string;
  color: string;
  steps: string[];
  checklist: ChecklistItem[];
}

const emergencyGuides: EmergencyGuide[] = [
  {
    id: 'fire',
    type: 'Fire',
    icon: '🔥',
    color: theme.primary.main,
    steps: [
      'R - Rescue/Response: Remove any persons from the immediate scene',
      'A - Alert/Activate: Pull the nearest alarm and call 911',
      'C - Confine: Close all doors to the hazard or fire area',
      'E - Extinguish/Evacuate: Use fire extinguisher if safe, then evacuate',
      'P.A.S.S. Method for Fire Extinguisher:',
      '  • Pull the pin while holding nozzle away',
      '  • Aim low at the base of the fire',
      '  • Squeeze the lever slowly and evenly',
      '  • Sweep the nozzle from side to side',
      'Evacuate to your designated meeting location',
    ],
    checklist: [
      {id: '1', text: 'Rescue/Remove persons from immediate scene', completed: false},
      {id: '2', text: 'Alert/Activate alarm and call 911', completed: false},
      {id: '3', text: 'Confine fire area by closing doors', completed: false},
      {id: '4', text: 'Extinguish using P.A.S.S. method or Evacuate', completed: false},
      {id: '5', text: 'Pull the pin while holding nozzle away', completed: false},
      {id: '6', text: 'Aim low at the base of the fire', completed: false},
      {id: '7', text: 'Squeeze the lever slowly and evenly', completed: false},
      {id: '8', text: 'Sweep the nozzle from side to side', completed: false},
      {id: '9', text: 'Evacuate to designated meeting location', completed: false},
    ],
  },
  {
    id: 'earthquake',
    type: 'Earthquake',
    icon: '🌍',
    color: theme.primary.dark,
    steps: [
      'BEFORE: Plan with family/classmates, secure heavy furniture, prepare survival kit',
      'DURING: Stay calm and do Duck, Cover, and Hold under sturdy table',
      'Stay away from windows, shelves, and heavy objects',
      'If outside, move to open area away from buildings and power lines',
      'If driving, pull over and stop; avoid bridges and overpasses',
      'If near shore, move to higher ground (tsunami risk)',
      'AFTER: Evacuate safely using stairs, check for injuries',
      'Go to open area or designated evacuation site',
      'Do not use phone unless for emergency help',
      'Listen to battery-powered radio for updates',
      'Do not enter damaged buildings due to aftershocks',
    ],
    checklist: [
      {id: '1', text: 'Plan with family/classmates and secure heavy furniture', completed: false},
      {id: '2', text: 'Do Duck, Cover, and Hold under sturdy table', completed: false},
      {id: '3', text: 'Stay away from windows, shelves, and heavy objects', completed: false},
      {id: '4', text: 'If outside, move to open area away from buildings', completed: false},
      {id: '5', text: 'If driving, pull over and stop; avoid bridges', completed: false},
      {id: '6', text: 'If near shore, move to higher ground', completed: false},
      {id: '7', text: 'Evacuate safely using stairs and check for injuries', completed: false},
      {id: '8', text: 'Go to open area or designated evacuation site', completed: false},
      {id: '9', text: 'Do not use phone unless for emergency help', completed: false},
      {id: '10', text: 'Listen to battery-powered radio for updates', completed: false},
      {id: '11', text: 'Do not enter damaged buildings due to aftershocks', completed: false},
    ],
  },
  {
    id: 'flood',
    type: 'Flood',
    icon: '🌊',
    color: theme.secondary.main,
    steps: [
      'BEFORE: Monitor PAGASA weather, know evacuation plan, prepare emergency kit',
      'Keep battery-operated radio, flashlight, and first aid kit ready',
      'DURING: Stay indoors, do not cross rivers above knee level',
      'Do not drive through flooded areas or streets',
      'Stay away from downed power lines',
      'Be alert for gas leaks - use flashlight, not lanterns',
      'Report flooded areas to Local DRRMC',
      'AFTER: Re-enter with caution using flashlight',
      'Be alert for fire hazards like broken electric wires',
      'Do not eat food or drink water until checked for contamination',
      'Report broken utility lines to authorities',
      'Do not turn on main switch until checked by electrician',
    ],
    checklist: [
      {id: '1', text: 'Monitor PAGASA weather and know evacuation plan', completed: false},
      {id: '2', text: 'Keep battery-operated radio, flashlight, and first aid kit ready', completed: false},
      {id: '3', text: 'Stay indoors, do not cross rivers above knee level', completed: false},
      {id: '4', text: 'Do not drive through flooded areas or streets', completed: false},
      {id: '5', text: 'Stay away from downed power lines', completed: false},
      {id: '6', text: 'Be alert for gas leaks - use flashlight, not lanterns', completed: false},
      {id: '7', text: 'Report flooded areas to Local DRRMC', completed: false},
      {id: '8', text: 'Re-enter with caution using flashlight', completed: false},
      {id: '9', text: 'Be alert for fire hazards like broken electric wires', completed: false},
      {id: '10', text: 'Do not eat food or drink water until checked', completed: false},
      {id: '11', text: 'Report broken utility lines to authorities', completed: false},
      {id: '12', text: 'Do not turn on main switch until checked by electrician', completed: false},
    ],
  },
  {
    id: 'typhoon',
    type: 'Typhoon',
    icon: '🌀',
    color: theme.secondary.dark,
    steps: [
      'BEFORE: Check house for damages, repair immediately',
      'Tie down roofs and objects that can be blown away',
      'Trim tree branches that may fall',
      'Ensure emergency go-bag is complete, charge phone and power bank',
      'Stay updated on typhoon signal warnings',
      'Evacuate immediately when advised by PAGASA or LGU',
      'If flood-prone, elevate appliances and belongings',
      'DURING: Stay updated with alerts from LGU and barangay',
      'Stay calm and stay indoors',
      'Keep emergency go-bag ready',
      'If evacuation needed, turn off electricity and gas, lock doors',
      'AFTER: Listen to news, ensure safe before going outside',
      'If evacuated, check if area is safe before returning',
      'Inspect power lines to ensure safe before use',
    ],
    checklist: [
      {id: '1', text: 'Check house for damages and repair immediately', completed: false},
      {id: '2', text: 'Tie down roofs and objects that can be blown away', completed: false},
      {id: '3', text: 'Trim tree branches that may fall', completed: false},
      {id: '4', text: 'Ensure emergency go-bag is complete, charge phone and power bank', completed: false},
      {id: '5', text: 'Stay updated on typhoon signal warnings', completed: false},
      {id: '6', text: 'Evacuate immediately when advised by PAGASA or LGU', completed: false},
      {id: '7', text: 'If flood-prone, elevate appliances and belongings', completed: false},
      {id: '8', text: 'Stay updated with alerts from LGU and barangay', completed: false},
      {id: '9', text: 'Stay calm and stay indoors', completed: false},
      {id: '10', text: 'Keep emergency go-bag ready', completed: false},
      {id: '11', text: 'If evacuation needed, turn off electricity and gas, lock doors', completed: false},
      {id: '12', text: 'Listen to news, ensure safe before going outside', completed: false},
      {id: '13', text: 'If evacuated, check if area is safe before returning', completed: false},
      {id: '14', text: 'Inspect power lines to ensure safe before use', completed: false},
    ],
  },
];

// Shuffle array (Fisher-Yates) - returns new array
const shuffleArray = <T,>(arr: T[]): T[] => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

// Get 4 multiple choice options for a quiz question (1 correct + 3 wrong)
const getQuizOptions = (
  currentGuide: EmergencyGuide,
  questionIndex: number
): {options: string[]; correctIndex: number} => {
  const correctAnswer = currentGuide.steps[questionIndex];
  const wrongPool: string[] = [];

  // Prefer wrong answers from OTHER guides
  emergencyGuides.forEach(guide => {
    if (guide.id !== currentGuide.id && guide.steps) {
      guide.steps.forEach(s => {
        if (s && s.length > 15 && s !== correctAnswer) wrongPool.push(s);
      });
    }
  });

  // If not enough, add from same guide (different question steps)
  if (wrongPool.length < 3 && currentGuide.steps) {
    currentGuide.steps.forEach((s, i) => {
      if (i !== questionIndex && s && s.length > 15 && s !== correctAnswer) {
        wrongPool.push(s);
      }
    });
  }

  const wrong = [...new Set(wrongPool)]
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const options = shuffleArray([correctAnswer, ...wrong]);
  const correctIndex = options.indexOf(correctAnswer);
  return {options, correctIndex};
};

// Reusable Guide Card - used in both Emergency Guides list and Practice Drills
const GuideCard = ({
  guide,
  onPress,
  variant = 'full',
}: {
  guide: EmergencyGuide;
  onPress: () => void;
  variant?: 'full' | 'compact';
}) =>
  variant === 'compact' ? (
    <TouchableOpacity onPress={onPress} style={styles.guideCardCompact}>
      <Text style={styles.guideIconCompact}>{guide.icon}</Text>
      <Text style={styles.guideTitleCompact}>{guide.type}</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity onPress={onPress} style={styles.guideCard}>
      <Text style={styles.guideIcon}>{guide.icon}</Text>
      <View style={styles.guideCardContent}>
        <Text style={styles.guideTitle}>{guide.type}</Text>
        <Text style={styles.guideSubtitle}>
          {guide.steps?.length || 0} steps • Tap to view guide
        </Text>
      </View>
      <Text style={styles.guideChevron}>›</Text>
    </TouchableOpacity>
  );

// Guide Info Modal - bottom sheet with steps
const GuideModal = ({
  visible,
  guide,
  onClose,
  onStartDrill,
}: {
  visible: boolean;
  guide: EmergencyGuide | null;
  onClose: () => void;
  onStartDrill: (g: EmergencyGuide) => void;
}) => {
  if (!guide) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent={Platform.OS === 'android'}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalPanel}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalIcon}>{guide.icon}</Text>
            <View style={styles.modalHeaderText}>
              <Text style={styles.modalTitle}>{guide.type}</Text>
              <Text style={styles.modalSubtitle}>Emergency Response Guide</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.stepsLabel}>Steps:</Text>
          <ScrollView
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator>
            {guide.steps.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View style={[styles.stepNumber, {backgroundColor: guide.color || theme.primary.main}]}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.drillBtn, {backgroundColor: guide.color || theme.primary.main}]}
              onPress={() => onStartDrill(guide)}>
              <Text style={styles.drillBtnText}>Start Practice Drill</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const LearnScreen = () => {
  const [selectedGuide, setSelectedGuide] = useState<EmergencyGuide | null>(null);
  const [drillMode, setDrillMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);

  const startDrill = useCallback((guide: EmergencyGuide) => {
    if (guide?.steps?.length > 0) {
      setSelectedGuide(guide);
      setDrillMode(true);
      setCurrentQuestionIndex(0);
      setSelectedOptionIndex(null);
    }
  }, []);

  const handleGuideSelect = useCallback((guide: EmergencyGuide) => {
    if (guide?.steps?.length > 0) {
      setSelectedGuide(guide);
    }
  }, []);

  const closeModal = useCallback(() => setSelectedGuide(null), []);

  const resetDrill = useCallback(() => {
    setDrillMode(false);
    setSelectedGuide(null);
    setCurrentQuestionIndex(0);
    setSelectedOptionIndex(null);
  }, []);

  const quizData = useMemo(() => {
    if (!selectedGuide || !drillMode) return null;
    const checklist = selectedGuide.checklist || [];
    const steps = selectedGuide.steps || [];
    const total = Math.min(checklist.length, steps.length);
    const {options, correctIndex} = getQuizOptions(selectedGuide, currentQuestionIndex);
    return {
      total,
      question: checklist[currentQuestionIndex]?.text,
      options,
      correctIndex,
      isLastQuestion: currentQuestionIndex >= total - 1,
      isComplete: currentQuestionIndex >= total,
    };
  }, [selectedGuide, drillMode, currentQuestionIndex]);

  const handleNext = useCallback(() => {
    if (!selectedGuide) return;
    const total = Math.min(selectedGuide.checklist?.length || 0, selectedGuide.steps?.length || 0);
    if (currentQuestionIndex < total - 1) {
      setCurrentQuestionIndex(i => i + 1);
      setSelectedOptionIndex(null);
    } else {
      setCurrentQuestionIndex(total);
      setSelectedOptionIndex(null);
    }
  }, [selectedGuide, currentQuestionIndex]);

  // Drill mode view - Quiz style: 1 question at a time with multiple choice
  if (drillMode && selectedGuide && quizData) {
    const {total, question, options, correctIndex, isLastQuestion, isComplete} = quizData;
    const currentNum = currentQuestionIndex + 1;
    const hasAnswered = selectedOptionIndex !== null;

    // Completion screen - shown after user taps "Finish" on last question
    if (isComplete) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={[styles.drillHeader, {backgroundColor: selectedGuide.color}]}>
            <Text style={styles.drillHeaderTitle}>Drill Complete!</Text>
            <Text style={styles.drillHeaderSubtitle}>{selectedGuide.type} Emergency</Text>
          </View>
          <View style={styles.quizCompleteContainer}>
            <Text style={styles.quizCompleteIcon}>{selectedGuide.icon}</Text>
            <Text style={styles.quizCompleteTitle}>Well done!</Text>
            <Text style={styles.quizCompleteText}>
              You've reviewed all {total} steps. Keep practicing to stay prepared.
            </Text>
            <TouchableOpacity
              onPress={resetDrill}
              style={[styles.primaryBtn, styles.quizCompleteBtn, {backgroundColor: selectedGuide.color}]}>
              <Text style={styles.primaryBtnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    // Quiz question screen - 1 question at a time
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.drillHeader, {backgroundColor: selectedGuide.color}]}>
          <TouchableOpacity onPress={resetDrill} style={styles.quizBackBtn}>
            <Text style={styles.quizBackText}>← Exit</Text>
          </TouchableOpacity>
          <Text style={styles.drillHeaderTitle}>Practice Drill</Text>
          <Text style={styles.drillHeaderSubtitle}>
            {selectedGuide.type} • Question {currentNum} of {total}
          </Text>
        </View>

        <View style={styles.quizProgressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${(currentNum / total) * 100}%`,
                  backgroundColor: selectedGuide.color,
                },
              ]}
            />
          </View>
        </View>

        <ScrollView style={styles.quizContent} showsVerticalScrollIndicator={false}>
          <View style={styles.quizCard}>
            <Text style={styles.quizQuestionLabel}>Question {currentNum}</Text>
            <Text style={styles.quizQuestionText}>{question}</Text>

            <Text style={styles.quizOptionsLabel}>Choose the correct answer:</Text>
            {options.map((option, index) => {
              const optionLabel = ['A', 'B', 'C', 'D'][index];
              const isCorrect = index === correctIndex;
              const isSelected = selectedOptionIndex === index;
              const showCorrect = hasAnswered && isCorrect;
              const showWrong = hasAnswered && isSelected && !isCorrect;

              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => !hasAnswered && setSelectedOptionIndex(index)}
                  disabled={hasAnswered}
                  style={[
                    styles.optionBtn,
                    showCorrect && styles.optionCorrect,
                    showWrong && styles.optionWrong,
                    isSelected && !hasAnswered && [styles.optionSelected, {borderColor: selectedGuide.color}],
                  ]}>
                  <View style={[
                    styles.optionLetter,
                    showCorrect && styles.optionLetterCorrect,
                    showWrong && styles.optionLetterWrong,
                    isSelected && !hasAnswered && {backgroundColor: selectedGuide.color},
                  ]}>
                    <Text style={[
                      styles.optionLetterText,
                      (showCorrect || showWrong || (isSelected && !hasAnswered)) && styles.optionLetterTextWhite,
                    ]}>
                      {optionLabel}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      showCorrect && styles.optionTextCorrect,
                      showWrong && styles.optionTextWrong,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.quizActions}>
            {hasAnswered ? (
              <TouchableOpacity
                onPress={handleNext}
                style={[styles.nextBtn, {backgroundColor: selectedGuide.color}]}>
                <Text style={styles.nextBtnText}>
                  {isLastQuestion ? 'Finish' : 'Next Question'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.quizHint}>Select an answer to continue</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Main Learn screen
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={[styles.header, {backgroundColor: theme.primary.main}]}>
          <Text style={styles.headerTitle}>Learn & Practice</Text>
          <Text style={styles.headerSubtitle}>Emergency guides and drill practice</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Guides</Text>
          {emergencyGuides.map(guide => (
            <GuideCard
              key={guide.id}
              guide={guide}
              onPress={() => handleGuideSelect(guide)}
              variant="full"
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Practice Drills</Text>
          <View style={styles.drillIntro}>
            <Text style={styles.drillIntroTitle}>Practice Makes Perfect</Text>
            <Text style={styles.drillIntroText}>
              Run through interactive drills to prepare for emergencies. Practice helps you react quickly and correctly.
            </Text>
            <Text style={styles.drillIntroLabel}>Select an emergency type to start:</Text>
            <View style={styles.drillGrid}>
              {emergencyGuides.map(guide => (
                <GuideCard
                  key={guide.id}
                  guide={guide}
                  onPress={() => startDrill(guide)}
                  variant="compact"
                />
              ))}
            </View>
          </View>
        </View>

        <GuideModal
          visible={selectedGuide !== null && !drillMode}
          guide={selectedGuide}
          onClose={closeModal}
          onStartDrill={startDrill}
        />

        <View style={styles.rememberBox}>
          <Text style={styles.rememberTitle}>Remember</Text>
          <Text style={styles.rememberText}>
            • All guides are available offline{'\n'}
            • Practice drills regularly{'\n'}
            • Follow instructions step by step{'\n'}
            • Stay calm during emergencies
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9FAFB'},
  scrollView: {flex: 1},
  header: {paddingHorizontal: 24, paddingVertical: 16},
  headerTitle: {color: '#FFFFFF', fontSize: 24, fontWeight: 'bold'},
  headerSubtitle: {color: '#FFE5D9', fontSize: 14},
  section: {paddingHorizontal: 24, paddingVertical: 24},
  sectionTitle: {color: '#1F2937', fontSize: 20, fontWeight: 'bold', marginBottom: 16},

  guideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  guideCardCompact: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  guideIcon: {fontSize: 36, marginRight: 16},
  guideIconCompact: {fontSize: 32, textAlign: 'center', marginBottom: 4},
  guideTitleCompact: {color: '#1F2937', fontSize: 12, fontWeight: '600', textAlign: 'center'},
  guideCardContent: {flex: 1},
  guideTitle: {color: '#1F2937', fontSize: 18, fontWeight: 'bold'},
  guideSubtitle: {color: '#6B7280', fontSize: 14},
  guideChevron: {color: '#9CA3AF', fontSize: 20},

  drillIntro: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 16,
  },
  drillIntroTitle: {color: '#92400E', fontWeight: '600', fontSize: 16, marginBottom: 8},
  drillIntroText: {color: '#A16207', fontSize: 14, marginBottom: 16},
  drillIntroLabel: {color: '#6B7280', fontSize: 12, marginBottom: 12},
  drillGrid: {flexDirection: 'row', flexWrap: 'wrap'},

  rememberBox: {
    marginHorizontal: 24,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
  },
  rememberTitle: {color: '#1E40AF', fontWeight: '600', fontSize: 16, marginBottom: 8},
  rememberText: {color: '#1D4ED8', fontSize: 14, lineHeight: 22},

  // Modal - explicit styles to prevent black screen
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalPanel: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.9,
    minHeight: 300,
    paddingBottom: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  modalHeader: {flexDirection: 'row', alignItems: 'center', padding: 24, paddingBottom: 16},
  modalIcon: {fontSize: 48, marginRight: 16},
  modalHeaderText: {flex: 1},
  modalTitle: {color: '#1F2937', fontSize: 24, fontWeight: 'bold'},
  modalSubtitle: {color: '#6B7280', fontSize: 14},
  modalCloseBtn: {width: 40, height: 40, alignItems: 'center', justifyContent: 'center'},
  modalCloseText: {color: '#9CA3AF', fontSize: 24},
  stepsLabel: {color: '#1F2937', fontSize: 16, fontWeight: 'bold', marginHorizontal: 24, marginBottom: 12},
  modalScrollView: {maxHeight: SCREEN_HEIGHT * 0.5},
  modalScrollContent: {paddingHorizontal: 24, paddingBottom: 16},
  stepRow: {flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start'},
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 4,
  },
  stepNumberText: {color: '#FFFFFF', fontSize: 12, fontWeight: 'bold'},
  stepText: {flex: 1, color: '#374151', fontSize: 16, lineHeight: 24},
  modalActions: {flexDirection: 'row', paddingHorizontal: 24, gap: 12, marginTop: 8},
  closeBtn: {flex: 1, backgroundColor: '#E5E7EB', borderRadius: 12, padding: 16, alignItems: 'center'},
  closeBtnText: {color: '#1F2937', fontWeight: 'bold', fontSize: 16},
  drillBtn: {flex: 1, borderRadius: 12, padding: 16, alignItems: 'center'},
  drillBtnText: {color: '#FFFFFF', fontWeight: 'bold', fontSize: 16},

  // Quiz / Drill mode
  drillHeader: {paddingHorizontal: 24, paddingVertical: 16},
  drillHeaderTitle: {color: '#FFFFFF', fontSize: 24, fontWeight: 'bold'},
  drillHeaderSubtitle: {color: 'rgba(255,255,255,0.9)', fontSize: 14},
  quizBackBtn: {position: 'absolute', top: 16, left: 24, padding: 4, zIndex: 1},
  quizBackText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
  quizProgressContainer: {paddingHorizontal: 24, paddingTop: 8, paddingBottom: 16},
  progressBar: {height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: 3},
  quizContent: {flex: 1, paddingHorizontal: 24, paddingBottom: 24},
  quizCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  quizQuestionLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  quizQuestionText: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    marginBottom: 20,
  },
  quizOptionsLabel: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  optionSelected: {borderWidth: 2},
  optionCorrect: {
    backgroundColor: '#F0FDF4',
    borderColor: '#22C55E',
  },
  optionWrong: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionLetterCorrect: {backgroundColor: '#22C55E'},
  optionLetterWrong: {backgroundColor: '#EF4444'},
  optionLetterText: {color: '#374151', fontSize: 14, fontWeight: 'bold'},
  optionLetterTextWhite: {color: '#FFFFFF'},
  optionText: {flex: 1, color: '#374151', fontSize: 15, lineHeight: 22},
  optionTextCorrect: {color: '#166534', fontWeight: '600'},
  optionTextWrong: {color: '#991B1B'},
  quizActions: {marginTop: 'auto', paddingBottom: 32},
  nextBtn: {borderRadius: 12, padding: 18, alignItems: 'center'},
  nextBtnText: {color: '#FFFFFF', fontWeight: 'bold', fontSize: 18},
  quizHint: {color: '#9CA3AF', fontSize: 14, textAlign: 'center'},
  quizCompleteContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizCompleteIcon: {fontSize: 80, marginBottom: 24},
  quizCompleteTitle: {color: '#1F2937', fontSize: 28, fontWeight: 'bold', marginBottom: 12},
  quizCompleteText: {
    color: '#6B7280',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  quizCompleteBtn: {minWidth: 200},
  primaryBtn: {borderRadius: 12, padding: 16, alignItems: 'center', minWidth: 200, alignSelf: 'center'},
  primaryBtnText: {color: '#FFFFFF', fontWeight: 'bold', fontSize: 16},
});

export default LearnScreen;
