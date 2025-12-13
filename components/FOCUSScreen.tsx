import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Vibration,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Audio} from 'expo-av';
import {CameraView, useCameraPermissions} from 'expo-camera';
import * as Haptics from 'expo-haptics';
import {theme} from '../config/theme';

const FOCUSScreen = () => {
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [whistlePlaying, setWhistlePlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [permission, requestPermission] = useCameraPermissions();
  const [torchEnabled, setTorchEnabled] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const soundRef = useRef<Audio.Sound | null>(null);
  const strobeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cameraRef = useRef<CameraView>(null);

  const ACTS_STEPS = [
    {
      letter: 'A',
      title: 'Awareness',
      description: 'Assess your situation. What is happening? Where are you? What are the immediate dangers?',
    },
    {
      letter: 'C',
      title: 'Choices',
      description: 'Identify your options. What can you do? What resources are available?',
    },
    {
      letter: 'T',
      title: 'Timing',
      description: 'Act quickly but calmly. Prioritize your actions. What needs to be done first?',
    },
    {
      letter: 'U',
      title: 'Understanding',
      description: 'Understand your environment. Know your exits, safe zones, and available help.',
    },
    {
      letter: 'S',
      title: 'Safety',
      description: 'Prioritize safety above all. Follow evacuation routes and emergency procedures.',
    },
  ];

  useEffect(() => {
    return () => {
      // Cleanup
      if (strobeIntervalRef.current) {
        clearInterval(strobeIntervalRef.current);
      }
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      // Turn off torch on cleanup
      if (torchEnabled) {
        setTorchEnabled(false);
      }
    };
  }, [torchEnabled]);

  useEffect(() => {
    if (breathingActive) {
      startBreathingCycle();
    } else {
      scaleAnim.setValue(1);
    }
  }, [breathingActive]);

  const startBreathingCycle = () => {
    const cycle = () => {
      // Inhale (4 seconds)
      setBreathPhase('inhale');
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 4000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Hold (2 seconds)
        setBreathPhase('hold');
        setTimeout(() => {
          // Exhale (4 seconds)
          setBreathPhase('exhale');
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true,
          }).start(() => {
            if (breathingActive) {
              cycle();
            }
          });
        }, 2000);
      });
    };
    cycle();
  };

  const toggleBreathing = () => {
    setBreathingActive(!breathingActive);
  };

  const toggleFlashlight = async () => {
    try {
      // Request permission if not granted
      if (!permission) {
        const result = await requestPermission();
        if (!result.granted) {
          Alert.alert(
            'Camera Permission Required',
            'Camera permission is needed to use the flashlight. Please enable it in settings.',
            [{text: 'OK'}]
          );
          return;
        }
      }

      if (flashlightOn) {
        // Turn off flashlight
        setFlashlightOn(false);
        setTorchEnabled(false);
        if (strobeIntervalRef.current) {
          clearInterval(strobeIntervalRef.current);
          strobeIntervalRef.current = null;
        }
      } else {
        // Turn on flashlight with strobe effect
        setFlashlightOn(true);
        setTorchEnabled(true);
        
        // Start strobe effect
        let strobeState = true;
        strobeIntervalRef.current = setInterval(() => {
          strobeState = !strobeState;
          setTorchEnabled(strobeState);
        }, 500);

        // Auto-stop after 30 seconds
        setTimeout(() => {
          if (strobeIntervalRef.current) {
            clearInterval(strobeIntervalRef.current);
            strobeIntervalRef.current = null;
          }
          setTorchEnabled(false);
          setFlashlightOn(false);
        }, 30000);
      }
    } catch (error) {
      console.error('Flashlight error:', error);
      Alert.alert(
        'Flashlight Error',
        'Unable to control flashlight. Make sure your device has a flashlight and camera permission is granted.'
      );
    }
  };

  const playWhistle = async () => {
    try {
      if (whistlePlaying) {
        // Stop whistle
        if (soundRef.current) {
          await soundRef.current.stopAsync();
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }
        setWhistlePlaying(false);
      } else {
        // Play whistle sound
        setWhistlePlaying(true);
        
        // Request audio mode
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        try {
          // Haptic feedback for better UX
          if (Platform.OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          
          // Create whistle sound using a data URI with generated audio
          // This creates a high-pitched whistle-like tone
          const sampleRate = 44100;
          const duration = 1.5; // seconds
          const frequency = 2800; // Hz - whistle frequency
          const numSamples = Math.floor(sampleRate * duration);
          const samples = new Float32Array(numSamples);
          
          // Generate whistle tone with amplitude modulation for realistic effect
          for (let i = 0; i < numSamples; i++) {
            const t = i / sampleRate;
            // Create a whistle pattern: quick bursts
            const burstPattern = Math.sin(t * 8) > 0 ? 1 : 0;
            const amplitude = burstPattern * Math.sin(t * Math.PI * 2 * frequency);
            // Add some harmonics for more realistic whistle sound
            const harmonic = Math.sin(t * Math.PI * 2 * frequency * 2) * 0.3;
            samples[i] = (amplitude + harmonic) * 0.5;
          }
          
          // Convert to WAV format
          const wavBuffer = new ArrayBuffer(44 + samples.length * 2);
          const view = new DataView(wavBuffer);
          
          // WAV header
          const writeString = (offset: number, string: string) => {
            for (let i = 0; i < string.length; i++) {
              view.setUint8(offset + i, string.charCodeAt(i));
            }
          };
          
          writeString(0, 'RIFF');
          view.setUint32(4, 36 + samples.length * 2, true);
          writeString(8, 'WAVE');
          writeString(12, 'fmt ');
          view.setUint32(16, 16, true);
          view.setUint16(20, 1, true);
          view.setUint16(22, 1, true);
          view.setUint32(24, sampleRate, true);
          view.setUint32(28, sampleRate * 2, true);
          view.setUint16(32, 2, true);
          view.setUint16(34, 16, true);
          writeString(36, 'data');
          view.setUint32(40, samples.length * 2, true);
          
          // Convert float samples to 16-bit PCM
          let offset = 44;
          for (let i = 0; i < samples.length; i++) {
            const s = Math.max(-1, Math.min(1, samples[i]));
            view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            offset += 2;
          }
          
          // Convert to base64 data URI
          const bytes = new Uint8Array(wavBuffer);
          let binary = '';
          for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
          }
          const base64 = btoa(binary);
          const dataUri = `data:audio/wav;base64,${base64}`;
          
          // Load and play the sound
          const {sound} = await Audio.Sound.createAsync(
            {uri: dataUri},
            {
              shouldPlay: true,
              isLooping: false,
              volume: 1.0,
            }
          );
          
          soundRef.current = sound;
          
          // Play the sound
          await sound.playAsync();
          
          // Auto-stop after sound finishes
          sound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.didJustFinish) {
              setWhistlePlaying(false);
              sound.unloadAsync();
              soundRef.current = null;
            }
          });
          
        } catch (error) {
          console.error('Error playing whistle:', error);
          // Fallback: Use vibration pattern as emergency signal
          Vibration.vibrate([0, 200, 100, 200, 100, 200, 100, 200]);
          if (Platform.OS === 'ios') {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }
          
          // Reset after vibration
          setTimeout(() => {
            setWhistlePlaying(false);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Whistle error:', error);
      // Fallback to vibration
      Vibration.vibrate([0, 200, 100, 200, 100, 200]);
      setWhistlePlaying(false);
    }
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      default:
        return 'Ready';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header - Logo Colors */}
        <View style={{backgroundColor: theme.primary.main}} className="px-6 py-4">
          <Text className="text-white text-2xl font-bold mb-1">F.O.C.U.S.</Text>
          <Text style={{color: '#FFE5D9'}} className="text-sm">Calm and Response Tool</Text>
        </View>

        {/* Breathing Exercise */}
        <View className="px-6 py-6">
          <Text className="text-gray-800 text-xl font-bold mb-4">Breathing Exercise</Text>
          <View className="bg-white rounded-xl p-6 items-center shadow-sm border border-gray-200 mb-4">
            <Animated.View
              style={{
                width: 150,
                height: 150,
                borderRadius: 75,
                backgroundColor: breathingActive
                  ? breathPhase === 'inhale'
                    ? theme.secondary.main
                    : breathPhase === 'hold'
                    ? theme.primary.light
                    : theme.secondary.dark
                  : '#E5E7EB',
                transform: [{scale: scaleAnim}],
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text className="text-white text-lg font-bold">
                {breathingActive ? getBreathInstruction() : 'Ready'}
              </Text>
            </Animated.View>
            <TouchableOpacity
              onPress={toggleBreathing}
              style={{
                marginTop: 24,
                paddingHorizontal: 32,
                paddingVertical: 12,
                borderRadius: 8,
                backgroundColor: breathingActive ? theme.primary.dark : theme.secondary.main,
              }}>
              <Text className="text-white font-bold text-base">
                {breathingActive ? 'Stop' : 'Start Breathing'}
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-600 text-sm mt-4 text-center">
              Follow the circle: Inhale (4s) → Hold (2s) → Exhale (4s)
            </Text>
          </View>
        </View>

        {/* Emergency Tools */}
        <View className="px-6 py-2">
          <Text className="text-gray-800 text-xl font-bold mb-4">Emergency Tools</Text>
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity
              onPress={toggleFlashlight}
              className={`flex-1 rounded-xl p-6 items-center mr-2 ${
                flashlightOn ? 'bg-yellow-400' : 'bg-gray-200'
              }`}>
              <Text className="text-4xl mb-2">🔦</Text>
              <Text className={`font-bold text-sm ${
                flashlightOn ? 'text-gray-800' : 'text-gray-600'
              }`}>
                Flashlight
              </Text>
              {flashlightOn && (
                <Text className="text-xs text-gray-600 mt-1">Strobe Active</Text>
              )}
              {permission && !permission.granted && (
                <Text className="text-xs text-red-600 mt-1">Permission Needed</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={playWhistle}
              className={`flex-1 rounded-xl p-6 items-center ml-2 ${
                whistlePlaying ? 'bg-red-500' : 'bg-gray-200'
              }`}>
              <Text className="text-4xl mb-2">📢</Text>
              <Text className={`font-bold text-sm ${
                whistlePlaying ? 'text-white' : 'text-gray-600'
              }`}>
                Emergency Whistle
              </Text>
              {whistlePlaying && (
                <Text className="text-xs text-white mt-1">Playing...</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ACTS Guide */}
        <View className="px-6 py-2">
          <Text className="text-gray-800 text-xl font-bold mb-4">ACTS Response Guide</Text>
          {ACTS_STEPS.map((step, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentStep(index)}
              className={`bg-white rounded-xl p-4 mb-3 shadow-sm border-2 ${
                currentStep === index ? 'border-blue-500' : 'border-gray-200'
              }`}>
              <View className="flex-row items-start">
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                  currentStep === index ? 'bg-blue-600' : 'bg-gray-200'
                }`}>
                  <Text className={`font-bold text-lg ${
                    currentStep === index ? 'text-white' : 'text-gray-600'
                  }`}>
                    {step.letter}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className={`font-bold text-base mb-1 ${
                    currentStep === index ? 'text-blue-600' : 'text-gray-800'
                  }`}>
                    {step.title}
                  </Text>
                  <Text className="text-gray-600 text-sm">{step.description}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tips */}
        <View className="px-6 py-4 mb-6">
          <View className="bg-green-50 border border-green-200 rounded-xl p-4">
            <Text className="text-green-800 font-semibold text-base mb-2">Staying Calm</Text>
            <Text className="text-green-700 text-sm leading-5">
              • Take deep breaths using the breathing exercise{'\n'}
              • Follow the ACTS guide step by step{'\n'}
              • Use emergency tools only when needed{'\n'}
              • Stay aware of your surroundings
            </Text>
          </View>
        </View>
      </ScrollView>
      
      {/* Hidden Camera for Flashlight Control */}
      {permission?.granted && (
        <CameraView
          ref={cameraRef}
          style={styles.hiddenCamera}
          facing="back"
          enableTorch={torchEnabled}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  hiddenCamera: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    zIndex: -1,
  },
});

export default FOCUSScreen;
