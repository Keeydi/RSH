import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Alert,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, TextInput as PaperInput} from 'react-native-paper';
import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';
import {authHelpers} from '../config/supabase';
import {theme} from '../config/theme';

interface LoginScreenProps {
  onLogin?: () => void;
}

const LoginScreen = ({onLogin}: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [isAppleAvailable, setIsAppleAvailable] = useState(false);

  // Check if Apple Authentication is available
  useEffect(() => {
    const checkAppleAuth = async () => {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      setIsAppleAvailable(isAvailable);
    };
    checkAppleAuth();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const {data, error} = await authHelpers.signIn(email.trim(), password);

      if (error) {
        setLoading(false);
        Alert.alert(
          'Login Failed',
          error.message || 'Invalid email or password. Please try again.'
        );
        return;
      }

      if (data?.user) {
        setLoading(false);
        console.log('Login successful:', data.user.email);
        // Call onLogin callback to navigate to dashboard
        if (onLogin) {
          onLogin();
        }
      }
    } catch (error: any) {
      setLoading(false);
      console.error('Login error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);

      // Google OAuth configuration
      const GOOGLE_CLIENT_ID = '805752149773-q95vbsf2t6jv2ddhgj9tdhgs9gieeesl.apps.googleusercontent.com';
      
      // Validate client ID
      if (!GOOGLE_CLIENT_ID) {
        setGoogleLoading(false);
        Alert.alert(
          'Configuration Required',
          'Google Client ID is not configured.',
          [{text: 'OK'}]
        );
        return;
      }

      const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true,
      });

      // Log redirect URI for debugging (remove in production)
      console.log('Redirect URI:', redirectUri);

      const discovery = {
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
        tokenEndpoint: 'https://oauth2.googleapis.com/token',
        revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
      };

      // Create auth request (using implicit flow for simplicity)
      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        responseType: AuthSession.ResponseType.Token,
        redirectUri,
        // Add additional parameters to ensure proper request format
        extraParams: {},
        usePKCE: false,
      });

      // Start authentication
      const result = await request.promptAsync(discovery);

      if (result.type === 'success') {
        // Check for access token
        if (result.params?.access_token) {
          const accessToken = result.params.access_token;

          // Fetch user info from Google
          try {
            const userInfoResponse = await fetch(
              'https://www.googleapis.com/oauth2/v2/userinfo',
              {
                headers: {Authorization: `Bearer ${accessToken}`},
              }
            );

            if (!userInfoResponse.ok) {
              throw new Error(`HTTP error! status: ${userInfoResponse.status}`);
            }

            const userInfo = await userInfoResponse.json();

            setGoogleLoading(false);
            console.log('Google Sign In Success:', userInfo);
            
            // Here you would typically send the user info to your backend
            // to create/login the user in your system
            
            // Navigate to dashboard after successful login
            if (onLogin) {
              onLogin();
            }
          } catch (fetchError) {
            setGoogleLoading(false);
            console.error('Error fetching user info:', fetchError);
            Alert.alert('Error', 'Failed to fetch user information from Google.');
          }
        } else {
          setGoogleLoading(false);
          console.error('No access token in response:', result.params);
          Alert.alert('Error', 'Google sign-in completed but no access token was received.');
        }
      } else if (result.type === 'error') {
        setGoogleLoading(false);
        const errorMessage = result.params?.error_description || result.params?.error || 'Unknown error';
        console.error('Google OAuth Error:', result.params);
        Alert.alert('Sign In Error', `Google sign-in failed: ${errorMessage}`);
      } else if (result.type === 'dismiss' || result.type === 'cancel') {
        setGoogleLoading(false);
        // User cancelled, no need to show error - just silently return
        console.log('Google sign-in cancelled by user');
      } else {
        setGoogleLoading(false);
        console.error('Unexpected result type:', result);
        // Don't show alert for cancel/dismiss types
        if (result.type !== 'cancel' && result.type !== 'dismiss') {
          Alert.alert('Error', 'Google sign-in was cancelled or failed');
        }
      }
    } catch (error: any) {
      setGoogleLoading(false);
      console.error('Google Sign In Error:', error);
      const errorMessage = error?.message || 'Unknown error occurred';
      Alert.alert(
        'Error',
        `Failed to sign in with Google: ${errorMessage}\n\nPlease ensure:\n1. Your Google Client ID is correctly configured\n2. The redirect URI is added to your Google Cloud Console\n3. OAuth consent screen is properly set up`
      );
    }
  };

  const handleAppleSignIn = async () => {
    try {
      setAppleLoading(true);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      setAppleLoading(false);
      
      // Apple authentication successful
      const displayName = credential.fullName
        ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
        : credential.email || 'User';

      console.log('Apple Sign In Success:', {
        user: credential.user,
        email: credential.email,
        fullName: credential.fullName,
      });

      // Here you would typically send the credential to your backend
      // to create/login the user in your system
      
      // Navigate to dashboard after successful login
      if (onLogin) {
        onLogin();
      }
    } catch (error: any) {
      setAppleLoading(false);
      if (error.code === 'ERR_CANCELED') {
        // User cancelled, don't show error
        return;
      }
      console.error('Apple Sign In Error:', error);
      Alert.alert('Error', 'Failed to sign in with Apple. Please try again.');
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleResetPassword = async () => {
    if (!resetEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setResetLoading(true);
    try {
      const {error} = await authHelpers.resetPassword(resetEmail.trim());

      setResetLoading(false);
      setShowForgotPassword(false);
      setResetEmail('');

      if (error) {
        Alert.alert(
          'Error',
          error.message || 'Failed to send password reset email. Please try again.'
        );
        return;
      }

      Alert.alert(
        'Password Reset Sent',
        'We have sent a password reset link to your email address. Please check your inbox.',
        [{text: 'OK'}]
      );
    } catch (error: any) {
      setResetLoading(false);
      console.error('Password reset error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const closeForgotPasswordModal = () => {
    setShowForgotPassword(false);
    setResetEmail('');
  };

  const handleSignUp = () => {
    setShowSignUp(true);
  };

  const handleCreateAccount = async () => {
    // Validation
    if (!signUpName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    if (!signUpEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!signUpPassword) {
      Alert.alert('Error', 'Please enter a password');
      return;
    }

    if (signUpPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept the terms and conditions');
      return;
    }

    setSignUpLoading(true);
    try {
      const {data, error} = await authHelpers.signUp(
        signUpEmail.trim(),
        signUpPassword,
        signUpName.trim()
      );

      setSignUpLoading(false);

      if (error) {
        Alert.alert(
          'Sign Up Failed',
          error.message || 'Failed to create account. Please try again.'
        );
        return;
      }

      // Reset form
      setShowSignUp(false);
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpConfirmPassword('');
      setTermsAccepted(false);

      // Check if email confirmation is required
      if (data?.user && !data.session) {
        Alert.alert(
          'Account Created',
          'Your account has been created! Please check your email to verify your account before signing in.',
          [{text: 'OK'}]
        );
      } else {
        Alert.alert(
          'Account Created',
          'Your account has been created successfully! You can now sign in.',
          [{text: 'OK'}]
        );
        // Auto login if session is available
        if (data?.session && onLogin) {
          onLogin();
        }
      }
    } catch (error: any) {
      setSignUpLoading(false);
      console.error('Sign up error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const closeSignUpModal = () => {
    setShowSignUp(false);
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setSignUpConfirmPassword('');
    setTermsAccepted(false);
  };


  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1">
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="handled">
          <View className="flex-1 justify-center px-6 py-12">
            {/* Logo */}
            <View className="items-center mb-8">
              <Image
                source={require('../images/logo.jpg')}
                style={{
                  width: 200,
                  height: 200,
                  resizeMode: 'contain',
                }}
              />
            </View>

            {/* Form */}
            <View className="mb-6">
              {/* Email Input */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Email
                </Text>
                <View className="bg-gray-50 rounded-xl border border-gray-200">
                  <TextInput
                    className="px-4 py-4 text-base text-gray-900"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                  />
                </View>
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Password
                </Text>
                <View className="bg-gray-50 rounded-xl border border-gray-200 flex-row items-center">
                  <TextInput
                    className="flex-1 px-4 py-4 text-base text-gray-900"
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    className="px-4">
                    <Text style={{color: theme.secondary.main}} className="font-semibold">
                      {showPassword ? 'Hide' : 'Show'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity 
                onPress={handleForgotPassword}
                className="self-end mb-6">
                <Text style={{color: theme.secondary.main}} className="font-semibold text-sm">
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading || !email || !password}
                style={{backgroundColor: theme.primary.main}}
                className={`rounded-xl py-4 items-center ${
                  loading || !email || !password
                    ? 'opacity-50'
                    : 'opacity-100'
                }`}>
                <Text className="text-white font-bold text-base">
                  {loading ? 'Signing in...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="px-4 text-gray-500 text-sm">OR</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Login */}
            <View>
              <TouchableOpacity
                onPress={handleGoogleSignIn}
                disabled={googleLoading}
                className={`bg-white border border-gray-300 rounded-xl py-4 items-center flex-row justify-center mb-3 ${
                  googleLoading ? 'opacity-50' : 'opacity-100'
                }`}>
                <Text className="text-gray-700 font-semibold text-base">
                  {googleLoading ? 'Signing in...' : 'Continue with Google'}
                </Text>
              </TouchableOpacity>
              {isAppleAvailable && (
                <TouchableOpacity
                  onPress={handleAppleSignIn}
                  disabled={appleLoading}
                  className={`bg-black rounded-xl py-4 items-center flex-row justify-center ${
                    appleLoading ? 'opacity-50' : 'opacity-100'
                  }`}>
                  <Text className="text-white font-semibold text-base">
                    {appleLoading ? 'Signing in...' : 'Continue with Apple'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={handleSignUp}>
                <Text style={{color: theme.secondary.main}} className="font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPassword}
        transparent={true}
        animationType="slide"
        onRequestClose={closeForgotPasswordModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <View className="flex-1 bg-black/50 justify-center px-6">
            <View className="bg-white rounded-2xl p-6">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                Reset Password
              </Text>
              <Text className="text-base text-gray-600 mb-6">
                Enter your email address and we'll send you a link to reset your password.
              </Text>

              {/* Email Input */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Email
                </Text>
                <View className="bg-gray-50 rounded-xl border border-gray-200">
                  <TextInput
                    className="px-4 py-4 text-base text-gray-900"
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={resetEmail}
                    onChangeText={setResetEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoFocus={true}
                  />
                </View>
              </View>

              {/* Buttons */}
              <View className="flex-row">
                <TouchableOpacity
                  onPress={closeForgotPasswordModal}
                  className="flex-1 bg-gray-100 rounded-xl py-4 items-center mr-2">
                  <Text className="text-gray-700 font-semibold text-base">
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleResetPassword}
                  disabled={resetLoading || !resetEmail.trim()}
                  className={`flex-1 bg-blue-600 rounded-xl py-4 items-center ml-2 ${
                    resetLoading || !resetEmail.trim()
                      ? 'opacity-50'
                      : 'opacity-100'
                  }`}>
                  <Text className="text-white font-semibold text-base">
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Sign Up Modal */}
      <Modal
        visible={showSignUp}
        transparent={true}
        animationType="slide"
        onRequestClose={closeSignUpModal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1">
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            keyboardShouldPersistTaps="handled">
            <View className="flex-1 bg-black/50 justify-center px-6 py-8">
              <View className="bg-white rounded-2xl p-6">
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  Create Account
                </Text>
                <Text className="text-base text-gray-600 mb-6">
                  Sign up to get started with your account.
                </Text>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {/* Full Name Input */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </Text>
                    <View className="bg-gray-50 rounded-xl border border-gray-200">
                      <TextInput
                        className="px-4 py-4 text-base text-gray-900"
                        placeholder="Enter your full name"
                        placeholderTextColor="#9CA3AF"
                        value={signUpName}
                        onChangeText={setSignUpName}
                        autoCapitalize="words"
                        autoComplete="name"
                      />
                    </View>
                  </View>

                  {/* Email Input */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </Text>
                    <View className="bg-gray-50 rounded-xl border border-gray-200">
                      <TextInput
                        className="px-4 py-4 text-base text-gray-900"
                        placeholder="Enter your email"
                        placeholderTextColor="#9CA3AF"
                        value={signUpEmail}
                        onChangeText={setSignUpEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                      />
                    </View>
                  </View>

                  {/* Password Input */}
                  <View className="mb-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </Text>
                    <View className="bg-gray-50 rounded-xl border border-gray-200 flex-row items-center">
                      <TextInput
                        className="flex-1 px-4 py-4 text-base text-gray-900"
                        placeholder="Enter your password"
                        placeholderTextColor="#9CA3AF"
                        value={signUpPassword}
                        onChangeText={setSignUpPassword}
                        secureTextEntry={!showSignUpPassword}
                        autoCapitalize="none"
                        autoComplete="password-new"
                      />
                      <TouchableOpacity
                        onPress={() => setShowSignUpPassword(!showSignUpPassword)}
                        className="px-4">
                        <Text style={{color: theme.secondary.main}} className="font-semibold text-sm">
                          {showSignUpPassword ? 'Hide' : 'Show'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Confirm Password Input */}
                  <View className="mb-6">
                    <Text className="text-sm font-semibold text-gray-700 mb-2">
                      Confirm Password
                    </Text>
                    <View className="bg-gray-50 rounded-xl border border-gray-200 flex-row items-center">
                      <TextInput
                        className="flex-1 px-4 py-4 text-base text-gray-900"
                        placeholder="Confirm your password"
                        placeholderTextColor="#9CA3AF"
                        value={signUpConfirmPassword}
                        onChangeText={setSignUpConfirmPassword}
                        secureTextEntry={!showSignUpConfirmPassword}
                        autoCapitalize="none"
                        autoComplete="password-new"
                      />
                      <TouchableOpacity
                        onPress={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                        className="px-4">
                        <Text style={{color: theme.secondary.main}} className="font-semibold text-sm">
                          {showSignUpConfirmPassword ? 'Hide' : 'Show'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Terms and Conditions */}
                  <TouchableOpacity
                    onPress={() => setTermsAccepted(!termsAccepted)}
                    className="flex-row items-center mb-6">
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        borderWidth: 2,
                        borderColor: termsAccepted ? theme.primary.main : '#D1D5DB',
                        backgroundColor: termsAccepted ? theme.primary.main : 'transparent',
                      }}
                      className="items-center justify-center mr-3">
                      {termsAccepted && (
                        <Text className="text-white text-xs font-bold">✓</Text>
                      )}
                    </View>
                    <Text className="text-sm text-gray-600 flex-1">
                      I agree to the Terms and Conditions and Privacy Policy
                    </Text>
                  </TouchableOpacity>

                  {/* Buttons */}
                  <View className="flex-row">
                    <TouchableOpacity
                      onPress={closeSignUpModal}
                      className="flex-1 bg-gray-100 rounded-xl py-4 items-center mr-2">
                      <Text className="text-gray-700 font-semibold text-base">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleCreateAccount}
                      disabled={signUpLoading}
                      className={`flex-1 bg-blue-600 rounded-xl py-4 items-center ml-2 ${
                        signUpLoading ? 'opacity-50' : 'opacity-100'
                      }`}>
                      <Text className="text-white font-semibold text-base">
                        {signUpLoading ? 'Creating...' : 'Create Account'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default LoginScreen;

