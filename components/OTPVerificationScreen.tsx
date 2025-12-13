import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {authHelpers} from '../config/supabase';

interface OTPVerificationScreenProps {
  email: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
  otpCode?: string; // OTP code to display if email sending failed
}

const OTPVerificationScreen = ({
  email,
  onVerificationSuccess,
  onBack,
  otpCode,
}: OTPVerificationScreenProps) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length > 1) {
      // Handle paste
      const pastedOtp = numericValue.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus the last filled input or the last input
      const lastFilledIndex = Math.min(index + pastedOtp.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    } else {
      // Single digit input
      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);

      // Auto-focus next input
      if (numericValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      const {data, error} = await authHelpers.verifyOtp(email, otpString);

      if (error) {
        setLoading(false);
        Alert.alert(
          'Verification Failed',
          error.message || 'Invalid OTP code. Please try again.'
        );
        // Clear OTP on error
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
        return;
      }

      if (data?.user) {
        setLoading(false);
        Alert.alert(
          'Email Verified',
          'Your email has been successfully verified! You can now sign in.',
          [
            {
              text: 'OK',
              onPress: onVerificationSuccess,
            },
          ]
        );
      }
    } catch (error: any) {
      setLoading(false);
      console.error('OTP verification error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) {
      return;
    }

    setResendLoading(true);
    try {
      const result = await authHelpers.resendOtp(email);
      const {error} = result;

      setResendLoading(false);

      if (error) {
        Alert.alert(
          'Error',
          error.message || 'Failed to resend OTP. Please try again.'
        );
        return;
      }

      // Set cooldown to 60 seconds
      setResendCooldown(60);

      // Check if OTP code was returned (email sending failed)
      if (result?.otpCode) {
        // Show OTP code in alert since email failed
        Alert.alert(
          'Email Sending Failed',
          `Your new verification code is: ${result.otpCode}\n\nPlease enter this code below.`,
          [{text: 'OK'}]
        );
      } else {
        // Email was sent successfully
        Alert.alert(
          'OTP Resent',
          'A new OTP code has been sent to your email address.'
        );
      }
      
      // Clear current OTP
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      setResendLoading(false);
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <View className="flex-1 px-6 py-8">
          {/* Back Button */}
          <TouchableOpacity onPress={onBack} className="mb-6">
            <Text className="text-blue-600 font-semibold text-base">← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-3">
              Verify Your Email
            </Text>
            {otpCode ? (
              <>
                <Text className="text-base text-red-600 font-semibold mb-2">
                  Email sending failed. Your verification code is:
                </Text>
                <View className="bg-blue-50 border-2 border-blue-500 rounded-xl p-4 mb-4">
                  <Text className="text-4xl font-bold text-blue-600 text-center" style={{letterSpacing: 8}}>
                    {otpCode}
                  </Text>
                </View>
                <Text className="text-sm text-gray-600 text-center">
                  Please enter this code below to verify your email.
                </Text>
              </>
            ) : (
              <>
                <Text className="text-base text-gray-600">
                  We've sent a 6-digit verification code to
                </Text>
                <Text className="text-base font-semibold text-gray-900 mt-1">
                  {email}
                </Text>
              </>
            )}
          </View>

          {/* OTP Input Fields */}
          <View className="mb-8">
            <Text className="text-sm font-semibold text-gray-700 mb-4">
              Enter Verification Code
            </Text>
            <View className="flex-row justify-between">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={ref => (inputRefs.current[index] = ref)}
                  className="w-12 h-14 bg-gray-50 rounded-xl border-2 border-gray-200 text-center text-xl font-bold text-gray-900"
                  value={digit}
                  onChangeText={value => handleOtpChange(index, value)}
                  onKeyPress={({nativeEvent}) =>
                    handleKeyPress(index, nativeEvent.key)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  style={[
                    styles.otpInput,
                    digit && styles.otpInputFilled,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            disabled={loading || otp.join('').length !== 6}
            className={`bg-blue-600 rounded-xl py-4 items-center mb-4 ${
              loading || otp.join('').length !== 6
                ? 'opacity-50'
                : 'opacity-100'
            }`}>
            <Text className="text-white font-bold text-base">
              {loading ? 'Verifying...' : 'Verify Email'}
            </Text>
          </TouchableOpacity>

          {/* Resend OTP */}
          <View className="items-center">
            <Text className="text-gray-600 text-sm mb-2">
              Didn't receive the code?
            </Text>
            <TouchableOpacity
              onPress={handleResendOtp}
              disabled={resendLoading || resendCooldown > 0}
              className={`${
                resendLoading || resendCooldown > 0
                  ? 'opacity-50'
                  : 'opacity-100'
              }`}>
              <Text className="text-blue-600 font-semibold text-base">
                {resendLoading
                  ? 'Sending...'
                  : resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  otpInput: {
    borderColor: '#E5E7EB',
  },
  otpInputFilled: {
    borderColor: '#3B82F6',
    backgroundColor: '#EFF6FF',
  },
});

export default OTPVerificationScreen;

