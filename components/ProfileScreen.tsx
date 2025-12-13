import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {theme} from '../config/theme';

interface ProfileScreenProps {
  onLogout?: () => void;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
}

const ProfileScreen = ({onLogout}: ProfileScreenProps) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [section, setSection] = useState('');
  const [healthInfo, setHealthInfo] = useState('');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    {id: '1', name: '', relationship: 'Parent/Guardian', phone: ''},
    {id: '2', name: '', relationship: 'Parent/Guardian', phone: ''},
  ]);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [originalData, setOriginalData] = useState({
    name: '',
    grade: '',
    section: '',
    healthInfo: '',
    emergencyContacts: [
      {id: '1', name: '', relationship: 'Parent/Guardian', phone: ''},
      {id: '2', name: '', relationship: 'Parent/Guardian', phone: ''},
    ],
  });

  const handleEdit = () => {
    setEditing(true);
  };

  const handleCancel = () => {
    setName(originalData.name);
    setGrade(originalData.grade);
    setSection(originalData.section);
    setHealthInfo(originalData.healthInfo);
    setEmergencyContacts(originalData.emergencyContacts);
    setEditing(false);
  };

  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!grade.trim()) {
      Alert.alert('Error', 'Please enter your grade');
      return;
    }

    if (!section.trim()) {
      Alert.alert('Error', 'Please enter your section');
      return;
    }

    // Validate at least one emergency contact
    const hasContact = emergencyContacts.some(
      contact => contact.name.trim() && contact.phone.trim()
    );
    if (!hasContact) {
      Alert.alert('Error', 'Please add at least one emergency contact');
      return;
    }

    setSaving(true);

    // Save to local storage (in real app, use AsyncStorage or SecureStore)
    setTimeout(() => {
      setSaving(false);
      setOriginalData({
        name,
        grade,
        section,
        healthInfo,
        emergencyContacts: [...emergencyContacts],
      });
      setEditing(false);
      Alert.alert('Success', 'Profile saved locally');
    }, 1000);
  };

  const updateEmergencyContact = (id: string, field: keyof EmergencyContact, value: string) => {
    setEmergencyContacts(prev =>
      prev.map(contact =>
        contact.id === id ? {...contact, [field]: value} : contact
      )
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header - Logo Colors */}
        <View style={{backgroundColor: theme.primary.main}} className="px-6 py-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-2xl font-bold">Student Profile</Text>
              <Text style={{color: '#FFE5D9'}} className="text-sm mt-1">All data stored locally</Text>
            </View>
            {!editing ? (
                <TouchableOpacity
                  onPress={handleEdit}
                  className="bg-white/20 px-4 py-2 rounded-lg">
                  <Text className="text-white text-sm font-semibold">Edit</Text>
                </TouchableOpacity>
              ) : (
                <View className="flex-row">
                  <TouchableOpacity
                    onPress={handleCancel}
                    className="bg-white/20 px-4 py-2 rounded-lg mr-2">
                    <Text className="text-white text-sm font-semibold">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    className={`bg-white px-4 py-2 rounded-lg ${
                      saving ? 'opacity-50' : 'opacity-100'
                    }`}>
                    <Text className="text-blue-600 text-sm font-semibold">
                      {saving ? 'Saving...' : 'Save'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
        </View>

        {/* Profile Content */}
        <View className="px-6 py-6">
          {/* Profile Picture Section */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-blue-200 rounded-full items-center justify-center border-4 border-blue-300">
              <Text className="text-blue-600 text-3xl font-bold">
                {name.charAt(0).toUpperCase() || '?'}
              </Text>
            </View>
          </View>

          {/* Form Fields */}
          <View>
            {/* Name */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-2 font-semibold">Student Name *</Text>
              {editing ? (
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              ) : (
                <View className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <Text className="text-gray-800">{name || 'Not set'}</Text>
                </View>
              )}
            </View>

            {/* Grade */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-2 font-semibold">Grade *</Text>
              {editing ? (
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                  placeholder="e.g., Grade 7"
                  placeholderTextColor="#9CA3AF"
                  value={grade}
                  onChangeText={setGrade}
                />
              ) : (
                <View className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <Text className="text-gray-800">{grade || 'Not set'}</Text>
                </View>
              )}
            </View>

            {/* Section */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-2 font-semibold">Section *</Text>
              {editing ? (
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
                  placeholder="e.g., Section A"
                  placeholderTextColor="#9CA3AF"
                  value={section}
                  onChangeText={setSection}
                />
              ) : (
                <View className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                  <Text className="text-gray-800">{section || 'Not set'}</Text>
                </View>
              )}
            </View>

            {/* Health Info */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-2 font-semibold">Health Information (Optional)</Text>
              {editing ? (
                <TextInput
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-800 min-h-[100px]"
                  placeholder="Allergies, medications, medical conditions..."
                  placeholderTextColor="#9CA3AF"
                  value={healthInfo}
                  onChangeText={setHealthInfo}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              ) : (
                <View className="bg-white border border-gray-200 rounded-lg px-4 py-3 min-h-[100px]">
                  <Text className="text-gray-800">{healthInfo || 'None provided'}</Text>
                </View>
              )}
            </View>

            {/* Emergency Contacts */}
            <View className="mb-4">
              <Text className="text-gray-700 text-sm mb-2 font-semibold">Emergency Contacts *</Text>
              {emergencyContacts.map((contact, index) => (
                <View key={contact.id} className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
                  <Text className="text-gray-600 text-xs mb-2">{contact.relationship}</Text>
                  {editing ? (
                    <>
                      <TextInput
                        className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800 mb-2"
                        placeholder="Contact name"
                        placeholderTextColor="#9CA3AF"
                        value={contact.name}
                        onChangeText={value => updateEmergencyContact(contact.id, 'name', value)}
                      />
                      <TextInput
                        className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
                        placeholder="Phone number"
                        placeholderTextColor="#9CA3AF"
                        value={contact.phone}
                        onChangeText={value => updateEmergencyContact(contact.id, 'phone', value)}
                        keyboardType="phone-pad"
                      />
                    </>
                  ) : (
                    <>
                      <Text className="text-gray-800 font-semibold mb-1">
                        {contact.name || 'Not set'}
                      </Text>
                      <Text className="text-gray-600 text-sm">{contact.phone || 'Not set'}</Text>
                    </>
                  )}
                </View>
              ))}
            </View>
          </View>

          {/* Mission, Vision, Core Values */}
          <View className="mb-6">
            <Text className="text-gray-800 text-lg font-bold mb-4">DepEd Mission, Vision & Core Values</Text>
            
            {/* Mission */}
            <View className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
              <Text className="text-gray-800 font-bold text-base mb-2">📋 Mission</Text>
              <Text className="text-gray-700 text-sm leading-5 mb-2">
                To protect and promote the right of every Filipino to quality, equitable, culture-based, and complete basic education where:
              </Text>
              <Text className="text-gray-600 text-xs leading-5 ml-2">
                • Students learn in a child-friendly, gender-sensitive, safe, and motivating environment{'\n'}
                • Teachers facilitate learning and constantly nurture every learner{'\n'}
                • Administrators and staff ensure an enabling and supportive environment{'\n'}
                • Family, community, and stakeholders are actively engaged
              </Text>
            </View>

            {/* Vision */}
            <View className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
              <Text className="text-gray-800 font-bold text-base mb-2">🎯 Vision</Text>
              <Text className="text-gray-700 text-sm leading-5">
                We dream of Filipinos who passionately love their country and whose values and competencies enable them to realize their full potential and contribute meaningfully to building the nation.
              </Text>
              <Text className="text-gray-600 text-xs leading-5 mt-2 italic">
                As a learner-centered public institution, the Department of Education continuously improves itself to better serve its stakeholders.
              </Text>
            </View>

            {/* Core Values */}
            <View className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
              <Text className="text-gray-800 font-bold text-base mb-2">💎 Core Values</Text>
              <View className="flex-row flex-wrap">
                <View className="bg-gray-50 rounded-lg px-3 py-2 mr-2 mb-2">
                  <Text className="text-gray-800 font-semibold text-xs">Maka-Diyos</Text>
                </View>
                <View className="bg-gray-50 rounded-lg px-3 py-2 mr-2 mb-2">
                  <Text className="text-gray-800 font-semibold text-xs">Maka-tao</Text>
                </View>
                <View className="bg-gray-50 rounded-lg px-3 py-2 mr-2 mb-2">
                  <Text className="text-gray-800 font-semibold text-xs">Makakalikasan</Text>
                </View>
                <View className="bg-gray-50 rounded-lg px-3 py-2 mb-2">
                  <Text className="text-gray-800 font-semibold text-xs">Makabansa</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Privacy Notice */}
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <Text className="text-blue-800 font-semibold text-sm mb-1">🔒 Privacy & Security</Text>
            <Text className="text-blue-700 text-xs leading-4">
              All your information is stored securely on your device only. Nothing is uploaded online.
            </Text>
          </View>

          {/* Account Actions */}
          <View className="mt-4">
            <TouchableOpacity 
              className="bg-red-500 border border-red-600 rounded-lg px-4 py-4"
              onPress={() => {
                Alert.alert(
                  'Logout',
                  'Are you sure you want to logout?',
                  [
                    {text: 'Cancel', style: 'cancel'},
                    {
                      text: 'Logout',
                      style: 'destructive',
                      onPress: () => {
                        if (onLogout) {
                          onLogout();
                        }
                      },
                    },
                  ]
                );
              }}>
              <Text className="text-white font-semibold text-center">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

