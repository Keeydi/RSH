import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const PaymentsScreen = () => {
  const [amount, setAmount] = useState('');
  const [gcashNumber, setGcashNumber] = useState('');
  const [proofImage, setProofImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [paymentHistory] = useState([
    {
      id: 'PAY-001',
      orderId: 'ORD-001',
      amount: 5000,
      status: 'Verified',
      date: '2024-01-15',
      method: 'GCash',
    },
    {
      id: 'PAY-002',
      orderId: 'ORD-002',
      amount: 3000,
      status: 'Pending',
      date: '2024-01-20',
      method: 'GCash',
    },
  ]);

  const handleSelectImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProofImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSelectDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setProofImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleSubmitPayment = async () => {
    if (!amount || !gcashNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!proofImage) {
      Alert.alert('Error', 'Please upload proof of payment');
      return;
    }

    setUploading(true);
    
    // Simulate API call
    setTimeout(() => {
      setUploading(false);
      Alert.alert(
        'Success',
        'Payment proof uploaded successfully! Your payment is being verified.',
        [
          {
            text: 'OK',
            onPress: () => {
              setAmount('');
              setGcashNumber('');
              setProofImage(null);
            },
          },
        ]
      );
    }, 1500);
  };

  const calculateDownPayment = (totalAmount: number) => {
    return totalAmount * 0.5;
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-black px-6 py-4 border-b border-white/10">
          <Text className="text-white text-2xl font-bold">Payments</Text>
          <Text className="text-white/60 text-sm mt-1">Manage your payments</Text>
        </View>

        {/* Payment Form */}
        <View className="px-6 py-6">
          <Text className="text-white text-lg font-bold mb-4">Send Down Payment (50%)</Text>
          
          <View className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
            <Text className="text-white/80 text-sm mb-2">Total Order Amount</Text>
            <TextInput
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white mb-4"
              placeholder="Enter total amount"
              placeholderTextColor="#FFFFFF60"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            
            {amount && !isNaN(parseFloat(amount)) && (
              <View className="bg-white/10 rounded-lg p-3 mb-4">
                <Text className="text-white/60 text-xs mb-1">Down Payment (50%)</Text>
                <Text className="text-white text-xl font-bold">
                  ₱{calculateDownPayment(parseFloat(amount)).toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            )}

            <Text className="text-white/80 text-sm mb-2">GCash Number</Text>
            <TextInput
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white mb-4"
              placeholder="09XX XXX XXXX"
              placeholderTextColor="#FFFFFF60"
              value={gcashNumber}
              onChangeText={setGcashNumber}
              keyboardType="phone-pad"
              maxLength={11}
            />

            <Text className="text-white/80 text-sm mb-2">Proof of Payment</Text>
            
            {proofImage ? (
              <View className="mb-4">
                <Image
                  source={{uri: proofImage}}
                  className="w-full h-48 rounded-lg mb-2"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={handleSelectImage}
                  className="bg-white/10 border border-white/20 rounded-lg py-3 items-center">
                  <Text className="text-white font-semibold">Change Image</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="flex-row mb-4">
                <TouchableOpacity
                  onPress={handleSelectImage}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg py-3 items-center mr-2">
                  <Text className="text-white font-semibold">Upload Image</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSelectDocument}
                  className="flex-1 bg-white/10 border border-white/20 rounded-lg py-3 items-center ml-2">
                  <Text className="text-white font-semibold">Choose File</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={handleSubmitPayment}
              disabled={uploading || !amount || !gcashNumber || !proofImage}
              className={`bg-white rounded-lg py-4 items-center ${
                uploading || !amount || !gcashNumber || !proofImage
                  ? 'opacity-50'
                  : 'opacity-100'
              }`}>
              <Text className="text-black font-bold text-base">
                {uploading ? 'Uploading...' : 'Submit Payment'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* GCash Instructions */}
          <View className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
            <Text className="text-white font-semibold mb-2">GCash Payment Instructions</Text>
            <Text className="text-white/60 text-sm mb-1">1. Open your GCash app</Text>
            <Text className="text-white/60 text-sm mb-1">2. Go to Send Money</Text>
            <Text className="text-white/60 text-sm mb-1">3. Enter the amount (50% of total)</Text>
            <Text className="text-white/60 text-sm mb-1">4. Send to: 09XX XXX XXXX</Text>
            <Text className="text-white/60 text-sm">5. Upload proof of payment above</Text>
          </View>

          {/* Payment History */}
          <View className="mb-6">
            <Text className="text-white text-lg font-bold mb-4">Payment History</Text>
            
            {paymentHistory.map(payment => (
              <View
                key={payment.id}
                className="bg-white/5 rounded-xl p-4 mb-3 border border-white/10">
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="text-white font-semibold">{payment.id}</Text>
                    <Text className="text-white/60 text-sm mt-1">Order: {payment.orderId}</Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${
                    payment.status === 'Verified' ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    <Text className="text-white text-xs font-semibold">{payment.status}</Text>
                  </View>
                </View>
                <View className="flex-row justify-between items-center mt-2">
                  <Text className="text-white/60 text-xs">{payment.date}</Text>
                  <Text className="text-white font-bold">
                    ₱{payment.amount.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </View>
                <Text className="text-white/40 text-xs mt-1">Method: {payment.method}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentsScreen;

