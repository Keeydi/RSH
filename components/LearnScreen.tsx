import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {theme} from '../config/theme';

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

// Define emergencyGuides outside component to ensure it's always available in production builds
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

// Helper function to get full guide data from emergencyGuides array
const getFullGuide = (guideId: string): EmergencyGuide | null => {
  return emergencyGuides.find(g => g.id === guideId) || null;
};

const LearnScreen = () => {
  const [selectedGuide, setSelectedGuide] = useState<EmergencyGuide | null>(null);
  const [drillMode, setDrillMode] = useState(false);
  const [drillStep, setDrillStep] = useState(0);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);

  const startDrill = useCallback((guide: EmergencyGuide) => {
    const fullGuide = getFullGuide(guide.id) || guide;
    if (fullGuide?.steps?.length > 0) {
      setSelectedGuide(fullGuide);
      setDrillMode(true);
      setDrillStep(0);
      setChecklist(fullGuide.checklist?.map(item => ({...item, completed: false})) || []);
    }
  }, []);

  const completeChecklistItem = useCallback((id: string) => {
    setChecklist(prev =>
      prev.map(item => (item.id === id ? {...item, completed: !item.completed} : item))
    );
  }, []);

  const nextDrillStep = useCallback(() => {
    if (selectedGuide && drillStep < selectedGuide.steps.length - 1) {
      setDrillStep(drillStep + 1);
    } else {
      setDrillMode(false);
      setDrillStep(0);
    }
  }, [selectedGuide, drillStep]);

  const resetDrill = useCallback(() => {
    setDrillMode(false);
    setDrillStep(0);
    setSelectedGuide(null);
    setChecklist([]);
  }, []);

  const handleGuideSelect = useCallback((guide: EmergencyGuide) => {
    const fullGuide = getFullGuide(guide.id);
    if (fullGuide?.steps?.length > 0) {
      setSelectedGuide(fullGuide);
    } else if (guide?.steps?.length > 0) {
      setSelectedGuide(guide);
    }
  }, []);

  const closeModal = useCallback(() => {
    setSelectedGuide(null);
  }, []);

  // Memoize drill calculations
  const drillStats = useMemo(() => {
    if (!selectedGuide || !drillMode) return null;
    
    const completedCount = checklist.filter(item => item.completed).length;
    const totalChecklistItems = checklist.length;
    const progress = totalChecklistItems > 0 ? completedCount / totalChecklistItems : 0;
    const firstIncompleteIndex = checklist.findIndex(item => !item.completed);
    
    return {
      completedCount,
      totalChecklistItems,
      progress,
      firstIncompleteIndex,
      isComplete: completedCount === totalChecklistItems,
    };
  }, [checklist, selectedGuide, drillMode]);

  if (drillMode && selectedGuide && drillStats) {
    const {completedCount, totalChecklistItems, progress, isComplete} = drillStats;

    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1">
          {/* Header */}
          <View className={`px-6 py-4`} style={{backgroundColor: selectedGuide.color}}>
            <Text className="text-white text-2xl font-bold mb-1">Drill Practice</Text>
            <Text className="text-white/90 text-sm">{selectedGuide.type} Emergency</Text>
          </View>

          {/* Drill Content */}
          <ScrollView className="flex-1 px-6 py-6">
            {/* Completed Steps Display */}
            {completedCount > 0 && (
              <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
                <Text className="text-gray-800 font-bold text-base mb-3">
                  Completed Steps ({completedCount}/{totalChecklistItems})
                </Text>
                {checklist
                  .filter((item, index) => item.completed && index < selectedGuide.steps.length)
                  .map((item, index) => (
                    <View key={item.id} className="mb-3 pb-3 border-b border-gray-100">
                      <View className="flex-row items-start mb-2">
                        <View className="w-6 h-6 rounded-full bg-green-500 items-center justify-center mr-3 mt-1">
                          <Text className="text-white text-xs font-bold">✓</Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-gray-600 text-xs mb-1">Step {index + 1}</Text>
                          <Text className="text-gray-800 text-sm font-semibold mb-1">
                            {item.text}
                          </Text>
                          <Text className="text-gray-700 text-sm">
                            {selectedGuide.steps[index]}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
              </View>
            )}

            {/* Current Step (if not all completed) */}
            {completedCount < totalChecklistItems && (
              <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-4">
                <View className="items-center mb-6">
                  <Text className="text-6xl mb-4">{selectedGuide.icon}</Text>
                  <Text className="text-gray-600 text-sm mb-2">
                    Progress: {completedCount} of {totalChecklistItems} steps completed
                  </Text>
                  <View className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <View
                      className="h-2 rounded-full"
                      style={{
                        width: `${progress * 100}%`,
                        backgroundColor: selectedGuide.color,
                      }}
                    />
                  </View>
                </View>
                <View className="items-center">
                  <Text className="text-gray-600 text-base text-center mb-2">
                    Complete the checklist item below to reveal the step instructions
                  </Text>
                  <Text className="text-gray-400 text-sm text-center">
                    {completedCount} of {totalChecklistItems} completed
                  </Text>
                </View>
              </View>
            )}

            {/* Checklist */}
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
              <Text className="text-gray-800 font-bold text-base mb-3">
                Checklist ({completedCount}/{totalChecklistItems} completed)
              </Text>
              {checklist.map((item, index) => {
                const isCompleted = item.completed;
                const showStepForItem = isCompleted && index < selectedGuide.steps.length;
                
                return (
                  <View key={item.id} className="mb-3">
                    <TouchableOpacity
                      onPress={() => completeChecklistItem(item.id)}
                      className="flex-row items-center">
                      <View
                        className={`w-6 h-6 rounded border-2 mr-3 items-center justify-center ${
                          isCompleted
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300'
                        }`}>
                        {isCompleted && <Text className="text-white text-xs">✓</Text>}
                      </View>
                      <Text
                        className={`flex-1 ${
                          isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
                        }`}>
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                    {showStepForItem && selectedGuide.steps[index] && (
                      <View className="ml-9 mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Text className="text-blue-800 text-xs font-semibold mb-1">
                          Step {index + 1} Answer:
                        </Text>
                        <Text className="text-blue-900 text-sm">
                          {selectedGuide.steps[index]}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Actions */}
            {completedCount === totalChecklistItems ? (
              <View className="flex-row justify-center">
                <TouchableOpacity
                  onPress={resetDrill}
                  className={`rounded-xl p-4`}
                  style={{backgroundColor: selectedGuide.color, minWidth: 200}}>
                  <Text className="text-white font-bold text-center text-base">
                    Complete - Start Over
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <Text className="text-blue-800 text-sm text-center">
                  ✓ Check off each item as you complete it to reveal the step instructions
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header - Logo Colors */}
        <View style={{backgroundColor: theme.primary.main}} className="px-6 py-4">
          <Text className="text-white text-2xl font-bold mb-1">Learn & Practice</Text>
          <Text style={{color: '#FFE5D9'}} className="text-sm">
            Emergency guides and drill practice
          </Text>
        </View>

        {/* Emergency Guides */}
        <View className="px-6 py-6">
          <Text className="text-gray-800 text-xl font-bold mb-4">
            Emergency Guides
          </Text>
          {emergencyGuides?.length > 0 ? (
            emergencyGuides.map(guide => (
              <TouchableOpacity
                key={guide.id}
                onPress={() => handleGuideSelect(guide)}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-200">
                <View className="flex-row items-center">
                  <Text className="text-4xl mr-4">{guide.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-lg mb-1">
                      {guide.type}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {guide.steps?.length || 0} steps • Tap to view guide
                    </Text>
                  </View>
                  <Text className="text-gray-400 text-xl">›</Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <Text className="text-yellow-800 font-semibold text-base mb-2">
                No Emergency Guides Available
              </Text>
              <Text className="text-yellow-700 text-sm">
                Emergency guides are loading. Please refresh the app.
              </Text>
            </View>
          )}
        </View>

        {/* Drill Practice */}
        <View className="px-6 py-2">
          <Text className="text-gray-800 text-xl font-bold mb-4">Practice Drills</Text>
          <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <Text className="text-yellow-800 font-semibold text-base mb-2">
              Practice Makes Perfect
            </Text>
            <Text className="text-yellow-700 text-sm mb-4">
              Run through interactive drills to prepare for emergencies. Practice helps you react quickly and correctly.
            </Text>
            <Text className="text-gray-600 text-xs mb-4">Select an emergency type to start:</Text>
            <View className="flex-row flex-wrap">
              {emergencyGuides.map(guide => (
                <TouchableOpacity
                  key={guide.id}
                  onPress={() => startDrill(guide)}
                  className="bg-white rounded-lg p-3 mr-2 mb-2 border border-gray-200"
                  style={{minWidth: 100}}>
                  <Text className="text-2xl text-center mb-1">{guide.icon}</Text>
                  <Text className="text-gray-800 font-semibold text-xs text-center">
                    {guide.type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Guide Detail Modal */}
        <Modal
          visible={selectedGuide !== null && !drillMode}
          transparent={true}
          animationType="slide"
          onRequestClose={closeModal}>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
              activeOpacity={1}
              onPress={closeModal}
            />
            <View
              style={{
                backgroundColor: '#FFFFFF',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                maxHeight: '90%',
                width: '100%',
              }}>
              <SafeAreaView edges={['bottom']} style={{flex: 1}}>
                <ScrollView
                  style={{flex: 1}}
                  contentContainerStyle={{padding: 24, paddingBottom: 32}}
                  showsVerticalScrollIndicator={true}
                  bounces={false}>
                  {selectedGuide && (
                    <View>
                      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 24}}>
                        <Text style={{fontSize: 48, marginRight: 16}}>
                          {selectedGuide.icon}
                        </Text>
                        <View style={{flex: 1}}>
                          <Text style={{color: '#1F2937', fontSize: 24, fontWeight: 'bold'}}>
                            {selectedGuide.type}
                          </Text>
                          <Text style={{color: '#6B7280', fontSize: 14}}>
                            Emergency Response Guide
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={closeModal}
                          style={{
                            width: 40,
                            height: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text style={{color: '#9CA3AF', fontSize: 24}}>✕</Text>
                        </TouchableOpacity>
                      </View>

                      <Text style={{color: '#1F2937', fontSize: 16, fontWeight: 'bold', marginBottom: 16}}>
                        Steps:
                      </Text>
                      {selectedGuide.steps?.length > 0 ? (
                        selectedGuide.steps.map((step, index) => (
                          <View
                            key={`step-${index}`}
                            style={{
                              flexDirection: 'row',
                              marginBottom: 16,
                              alignItems: 'flex-start',
                            }}>
                            <View
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 12,
                                marginTop: 4,
                                backgroundColor: selectedGuide.color || theme.primary.main,
                              }}>
                              <Text style={{color: '#FFFFFF', fontSize: 12, fontWeight: 'bold'}}>
                                {index + 1}
                              </Text>
                            </View>
                            <Text style={{flex: 1, color: '#374151', fontSize: 16, lineHeight: 24}}>
                              {step}
                            </Text>
                          </View>
                        ))
                      ) : (
                        <View style={{
                          backgroundColor: '#FEF3C7',
                          borderWidth: 1,
                          borderColor: '#FDE68A',
                          borderRadius: 12,
                          padding: 16,
                          marginBottom: 16,
                        }}>
                          <Text style={{color: '#92400E', fontWeight: '600', fontSize: 14}}>
                            No steps available for this guide. Please try again.
                          </Text>
                        </View>
                      )}

                      <View style={{flexDirection: 'row', marginTop: 24, gap: 12}}>
                        <TouchableOpacity
                          onPress={closeModal}
                          style={{
                            flex: 1,
                            backgroundColor: '#E5E7EB',
                            borderRadius: 12,
                            padding: 16,
                          }}>
                          <Text style={{color: '#1F2937', fontWeight: 'bold', textAlign: 'center', fontSize: 16}}>
                            Close
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => selectedGuide?.steps?.length > 0 && startDrill(selectedGuide)}
                          style={{
                            flex: 1,
                            borderRadius: 12,
                            padding: 16,
                            backgroundColor: selectedGuide.color || theme.primary.main,
                          }}>
                          <Text style={{color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center', fontSize: 16}}>
                            Start Practice Drill
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </ScrollView>
              </SafeAreaView>
            </View>
          </View>
        </Modal>

        {/* Info */}
        <View className="px-6 py-2 mb-6">
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Text className="text-blue-800 font-semibold text-base mb-2">Remember</Text>
            <Text className="text-blue-700 text-sm leading-5">
              • All guides are available offline{'\n'}
              • Practice drills regularly{'\n'}
              • Follow instructions step by step{'\n'}
              • Stay calm during emergencies
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LearnScreen;

