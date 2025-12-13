import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Clipboard,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import * as Location from 'expo-location';
import {supabase, authHelpers} from '../config/supabase';
import {theme} from '../config/theme';

interface Contact {
  id: string;
  name: string;
  number: string;
  type: 'emergency' | 'school' | 'personal';
  icon: string;
}

interface PersonalContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  is_primary: boolean;
}

const HotlinesScreen = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [personalContacts, setPersonalContacts] = useState<PersonalContact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);

  // Load personal emergency contacts from database
  useFocusEffect(
    React.useCallback(() => {
      loadPersonalContacts();
    }, [])
  );

  const loadPersonalContacts = async () => {
    try {
      setLoadingContacts(true);
      const {user} = await authHelpers.getCurrentUser();
      
      if (!user) {
        setPersonalContacts([]);
        return;
      }

      const {data, error} = await supabase
        .from('emergency_contacts')
        .select('id, name, phone, relationship, is_primary')
        .eq('user_id', user.id)
        .order('is_primary', {ascending: false})
        .order('created_at', {ascending: true})
        .limit(3); // Show first 3 in hotlines screen

      if (error) {
        // Silently handle missing table - it's expected until migration is run
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          setPersonalContacts([]);
          return;
        }
        throw error;
      }
      setPersonalContacts(data || []);
    } catch (error) {
      // Only log non-table-missing errors
      if (error && typeof error === 'object' && 'code' in error && error.code !== 'PGRST205') {
        console.error('Error loading personal contacts:', error);
      }
      setPersonalContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  };

  const contacts: Contact[] = [
    // Emergency Services
    {id: '1', name: 'Pasig City DRRMO', number: '8643-0000', type: 'emergency', icon: '🚨'},
    {id: '2', name: 'Bureau of Fire Protection', number: '8641-2815', type: 'emergency', icon: '🔥'},
    {id: '3', name: 'PNP - Pasig', number: '8477-7953', type: 'emergency', icon: '🚔'},
    {id: '4', name: 'Pasig Children\'s Hospital', number: '8643-2222', type: 'emergency', icon: '🏥'},
    {id: '5', name: 'Pasig City General Hospital', number: '8643-3333', type: 'emergency', icon: '🚑'},
    {id: '6', name: 'Pasig Central Fire Station', number: '0960-340-2260', type: 'emergency', icon: '🔥'},
    // School
    {id: '7', name: 'Rizal High School', number: '0991-000-0000', type: 'school', icon: '🏫'},
  ];

  const barangayContacts: Contact[] = [
    {id: 'b1', name: 'Bagong Ilog', number: '0917-150-5210', type: 'emergency', icon: '📍'},
    {id: 'b2', name: 'Bagong Katipunan', number: '8477-4262', type: 'emergency', icon: '📍'},
    {id: 'b3', name: 'Bambang', number: '7003-2600', type: 'emergency', icon: '📍'},
    {id: 'b4', name: 'Buting', number: '0916-664-7744', type: 'emergency', icon: '📍'},
    {id: 'b5', name: 'Caniogan', number: '0967-039-3182', type: 'emergency', icon: '📍'},
    {id: 'b6', name: 'Kalawaan', number: '0966-007-7440', type: 'emergency', icon: '📍'},
    {id: 'b7', name: 'Dela Paz', number: '0999-998-8844', type: 'emergency', icon: '📍'},
    {id: 'b8', name: 'Kapasigan', number: '8725-4023', type: 'emergency', icon: '📍'},
    {id: 'b9', name: 'Kapitolyo', number: '0967-098-4620', type: 'emergency', icon: '📍'},
    {id: 'b10', name: 'Malinao', number: '8641-6672', type: 'emergency', icon: '📍'},
    {id: 'b11', name: 'Manggahan', number: '028-682-0424', type: 'emergency', icon: '📍'},
    {id: 'b12', name: 'Oranbo', number: '0915-406-2290', type: 'emergency', icon: '📍'},
    {id: 'b13', name: 'Palatiw', number: '0919-740-1585', type: 'emergency', icon: '📍'},
    {id: 'b14', name: 'Pinagbuhatan', number: '8880-4609', type: 'emergency', icon: '📍'},
    {id: 'b15', name: 'Pineda', number: '0993-789-0331', type: 'emergency', icon: '📍'},
    {id: 'b16', name: 'Rosario', number: '0917-551-8563', type: 'emergency', icon: '📍'},
    {id: 'b17', name: 'Sagad', number: '8628-0227', type: 'emergency', icon: '📍'},
    {id: 'b18', name: 'San Antonio', number: '0918-625-4428', type: 'emergency', icon: '📍'},
    {id: 'b19', name: 'San Joaquin', number: '0920-306-5643', type: 'emergency', icon: '📍'},
    {id: 'b20', name: 'San Jose', number: '0967-059-8674', type: 'emergency', icon: '📍'},
    {id: 'b21', name: 'San Miguel', number: '0956-928-2660', type: 'emergency', icon: '📍'},
    {id: 'b22', name: 'San Nicolas', number: '0906-274-8238', type: 'emergency', icon: '📍'},
    {id: 'b23', name: 'Santolan', number: '0966-064-1882', type: 'emergency', icon: '📍'},
    {id: 'b24', name: 'Sta. Cruz', number: '7343-0611', type: 'emergency', icon: '📍'},
    {id: 'b25', name: 'Sta. Lucia', number: '0962-496-4778', type: 'emergency', icon: '📍'},
    {id: 'b26', name: 'Sta. Rosa', number: '7256-0509', type: 'emergency', icon: '📍'},
    {id: 'b27', name: 'Sto. Tomas', number: '7148-9575', type: 'emergency', icon: '📍'},
    {id: 'b28', name: 'Sumilang', number: '0915-542-4839', type: 'emergency', icon: '📍'},
    {id: 'b29', name: 'Ugong', number: '0917-816-4987', type: 'emergency', icon: '📍'},
  ];

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleCopy = (number: string, name: string) => {
    Clipboard.setString(number);
    Alert.alert('Copied', `${name} number copied to clipboard`);
  };

  const handleSMS = (phone: string) => {
    Linking.openURL(`sms:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to open SMS');
    });
  };

  const getLocation = async () => {
    try {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        return `Lat: ${loc.coords.latitude.toFixed(6)}, Lng: ${loc.coords.longitude.toFixed(6)}`;
      }
      return null;
    } catch (error) {
      return null;
    }
  };

  const sendSafeMessage = async () => {
    const locationInfo = await getLocation();
    const message = locationInfo
      ? `I'm safe. Location: ${locationInfo}`
      : "I'm safe.";
    
    // In a real app, this would send to emergency contacts
    Alert.alert('Message Ready', message);
    Linking.openURL(`sms:?body=${encodeURIComponent(message)}`).catch(() => {
      Alert.alert('Info', 'Message prepared. Please select a contact to send.');
    });
  };

  const sendHelpMessage = async () => {
    try {
      // Get current location
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Location permission is needed to send emergency request.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const locationInfo = `Lat: ${loc.coords.latitude.toFixed(6)}, Lng: ${loc.coords.longitude.toFixed(6)}`;
      const message = `SOS - Need help! Location: ${locationInfo}`;
      
      // Try to save to database in background (don't block SMS)
      const {user} = await authHelpers.getCurrentUser();
      if (user) {
        supabase
          .from('emergency_requests')
          .insert({
            user_id: user.id,
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            status: 'active',
            message: 'Student needs help',
          })
          .select()
          .then(({data, error}) => {
            if (error) {
              console.error('Error saving emergency request:', error);
            } else if (data) {
              console.log('Emergency request saved:', data[0]);
            }
          })
          .catch(err => {
            console.error('Background save error:', err);
          });
      }

      // ALWAYS open SMS directly with coordinates
      // Try different SMS URL formats for better compatibility
      const smsUrl = `sms:?body=${encodeURIComponent(message)}`;
      
      Linking.canOpenURL(smsUrl).then(supported => {
        if (supported) {
          Linking.openURL(smsUrl).catch(() => {
            // Fallback: try alternative format
            const altSmsUrl = `sms://?body=${encodeURIComponent(message)}`;
            Linking.openURL(altSmsUrl).catch(() => {
              Alert.alert(
                'SMS App Not Available',
                `Please manually send this message:\n\n${message}`,
                [
                  {
                    text: 'Copy Message',
                    onPress: () => {
                      Clipboard.setString(message);
                      Alert.alert('Copied', 'Message copied to clipboard');
                    },
                  },
                  {text: 'OK'},
                ]
              );
            });
          });
        } else {
          // Fallback: show message to copy
          Alert.alert(
            'SMS Not Available',
            `Please manually send this message:\n\n${message}`,
            [
              {
                text: 'Copy Message',
                onPress: () => {
                  Clipboard.setString(message);
                  Alert.alert('Copied', 'Message copied to clipboard');
                },
              },
              {text: 'OK'},
            ]
          );
        }
      }).catch(() => {
        // Direct open attempt if canOpenURL fails
        Linking.openURL(smsUrl).catch(() => {
          Alert.alert(
            'SMS App Not Available',
            `Please manually send this message:\n\n${message}`,
            [
              {
                text: 'Copy Message',
                onPress: () => {
                  Clipboard.setString(message);
                  Alert.alert('Copied', 'Message copied to clipboard');
                },
              },
              {text: 'OK'},
            ]
          );
        });
      });
    } catch (error: any) {
      console.error('Error sending help message:', error);
      Alert.alert(
        'Error',
        `Failed to get location: ${error?.message || 'Unknown error'}\n\nPlease try again.`
      );
    }
  };

  const emergencyContacts = contacts.filter(c => c.type === 'emergency');
  const schoolContacts = contacts.filter(c => c.type === 'school');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header - Logo Colors */}
        <View style={{backgroundColor: theme.primary.main}} className="px-6 py-4">
          <Text className="text-white text-2xl font-bold mb-1">Emergency Hotlines</Text>
          <Text style={{color: '#FFE5D9'}} className="text-sm">Quick access to emergency contacts</Text>
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-4">
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity
              onPress={sendSafeMessage}
              style={{backgroundColor: theme.secondary.main}}
              className="flex-1 rounded-xl p-4 mr-2 items-center">
              <Text className="text-white text-2xl mb-2">✓</Text>
              <Text className="text-white font-bold text-sm text-center">I'm Safe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sendHelpMessage}
              style={{backgroundColor: theme.primary.dark}}
              className="flex-1 rounded-xl p-4 ml-2 items-center">
              <Text className="text-white text-2xl mb-2">SOS</Text>
              <Text className="text-white font-bold text-sm text-center">Need Help</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Emergency Contacts */}
        <View className="px-6 py-2">
          <Text className="text-gray-800 text-xl font-bold mb-4">Emergency Services</Text>
          {emergencyContacts.map(contact => (
            <View
              key={contact.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Text className="text-3xl mr-3">{contact.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-base">{contact.name}</Text>
                    <Text className="text-gray-600 text-sm">{contact.number}</Text>
                  </View>
                </View>
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => handleCopy(contact.number, contact.name)}
                    className="bg-gray-100 rounded-lg p-2 mr-2">
                    <Text className="text-gray-700 text-xs font-semibold">Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleCall(contact.number)}
                    style={{backgroundColor: theme.secondary.main}}
                    className="rounded-lg p-2">
                    <Text className="text-white text-xs font-semibold">Call</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* School Contacts */}
        <View className="px-6 py-2">
          <Text className="text-gray-800 text-xl font-bold mb-4">School Contacts</Text>
          {schoolContacts.map(contact => (
            <View
              key={contact.id}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Text className="text-3xl mr-3">{contact.icon}</Text>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-base">{contact.name}</Text>
                    <Text className="text-gray-600 text-sm">{contact.number}</Text>
                  </View>
                </View>
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={() => handleCopy(contact.number, contact.name)}
                    className="bg-gray-100 rounded-lg p-2 mr-2">
                    <Text className="text-gray-700 text-xs font-semibold">Copy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleCall(contact.number)}
                    style={{backgroundColor: theme.secondary.main}}
                    className="rounded-lg p-2">
                    <Text className="text-white text-xs font-semibold">Call</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Barangay Hotlines */}
        <View className="px-6 py-2">
          <Text className="text-gray-800 text-xl font-bold mb-4">Barangay Hotlines</Text>
          <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-200">
            <Text className="text-gray-600 text-sm mb-3">
              Contact your local barangay for community-specific emergencies and assistance.
            </Text>
            <View className="flex-row flex-wrap">
              {barangayContacts.map(contact => (
                <TouchableOpacity
                  key={contact.id}
                  onPress={() => handleCall(contact.number)}
                  className="bg-gray-50 rounded-lg p-3 mr-2 mb-2 border border-gray-200"
                  style={{minWidth: '47%'}}>
                  <Text className="text-gray-800 font-semibold text-sm mb-1">{contact.name}</Text>
                  <Text className="text-gray-600 text-xs">{contact.number}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Personal Emergency Contacts */}
        <View className="px-6 py-2 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-800 text-xl font-bold">Personal Emergency Contacts</Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('EmergencyContacts' as never)}
              style={{backgroundColor: theme.secondary.main}}
              className="rounded-lg px-3 py-1">
              <Text className="text-white text-xs font-semibold">Manage</Text>
            </TouchableOpacity>
          </View>

          {loadingContacts ? (
            <View className="bg-white rounded-xl p-4 border border-gray-200">
              <Text className="text-gray-500 text-center">Loading contacts...</Text>
            </View>
          ) : personalContacts.length > 0 ? (
            <>
              {personalContacts.map(contact => (
                <View
                  key={contact.id}
                  style={{
                    backgroundColor: contact.is_primary ? '#EFF6FF' : '#FFFFFF',
                    borderWidth: 2,
                    borderColor: contact.is_primary ? theme.secondary.main : '#E5E7EB',
                  }}
                  className="rounded-xl p-4 mb-3 shadow-sm">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-1">
                        <Text className="text-gray-800 font-bold text-base mr-2">
                          {contact.name}
                        </Text>
                        {contact.is_primary && (
                          <View style={{backgroundColor: theme.primary.main}} className="px-2 py-1 rounded">
                            <Text className="text-white text-xs font-bold">PRIMARY</Text>
                          </View>
                        )}
                      </View>
                      <Text className="text-gray-600 text-sm mb-1">
                        {contact.relationship}
                      </Text>
                      <Text className="text-gray-800 font-semibold">
                        📞 {contact.phone}
                      </Text>
                    </View>
                    <View className="flex-row ml-2">
                      <TouchableOpacity
                        onPress={() => handleCall(contact.phone)}
                        className="bg-green-500 rounded-lg p-2 mr-2">
                        <Text className="text-white text-xs font-semibold">Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleSMS(contact.phone)}
                        style={{backgroundColor: theme.secondary.main}}
                        className="rounded-lg p-2">
                        <Text className="text-white text-xs font-semibold">SMS</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
              {personalContacts.length >= 3 && (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('EmergencyContacts' as never)}
                  className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-2">
                  <Text className="text-yellow-800 text-sm text-center font-semibold">
                    View All Contacts →
                  </Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <Text className="text-yellow-800 text-sm mb-2">
                No personal emergency contacts yet. Add your contacts to get started.
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('EmergencyContacts' as never)}
                className="bg-yellow-600 rounded-lg p-3 mt-2">
                <Text className="text-white font-semibold text-center">+ Add Contacts</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Info */}
        <View className="px-6 py-2 mb-6">
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Text className="text-blue-800 font-semibold text-base mb-2">Quick Actions</Text>
            <Text className="text-blue-700 text-sm leading-5">
              • Tap "Call" to dial immediately{'\n'}
              • Tap "Copy" to copy the number{'\n'}
              • Use "I'm Safe" or "Need Help" buttons to send quick messages with location
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HotlinesScreen;

