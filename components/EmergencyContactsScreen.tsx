import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  StyleSheet,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {supabase, authHelpers} from '../config/supabase';

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  notes?: string;
  is_primary: boolean;
}

const EmergencyContactsScreen = () => {
  const navigation = useNavigation();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relationship: 'Parent/Guardian',
    phone: '',
    email: '',
    notes: '',
    is_primary: false,
  });

  const relationshipOptions = [
    'Parent/Guardian',
    'Sibling',
    'Relative',
    'Friend',
    'Teacher',
    'Other',
  ];

  const loadContacts = async () => {
    try {
      setLoading(true);
      const {user} = await authHelpers.getCurrentUser();
      
      if (!user) {
        Alert.alert('Error', 'Please log in to view emergency contacts');
        return;
      }

      const {data, error} = await supabase
        .from('emergency_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('is_primary', {ascending: false})
        .order('created_at', {ascending: true});

      if (error) {
        // Check if table doesn't exist
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          console.warn('Emergency contacts table not found. Please run the database migration.');
          setContacts([]);
          return;
        }
        throw error;
      }

      setContacts(data || []);
    } catch (error: any) {
      console.error('Error loading contacts:', error);
      // Only show alert for non-table-missing errors
      if (error.code !== 'PGRST205' && !error.message?.includes('Could not find the table')) {
        Alert.alert('Error', 'Failed to load emergency contacts');
      }
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    // Validation
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    if (!formData.phone.trim()) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }

    // Basic phone validation
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    try {
      const {user} = await authHelpers.getCurrentUser();
      
      if (!user) {
        Alert.alert('Error', 'Please log in to save contacts');
        return;
      }

      if (editingContact) {
        // Update existing contact
        const {error} = await supabase
          .from('emergency_contacts')
          .update({
            name: formData.name.trim(),
            relationship: formData.relationship,
            phone: formData.phone.trim(),
            email: formData.email.trim() || null,
            notes: formData.notes.trim() || null,
            is_primary: formData.is_primary,
          })
          .eq('id', editingContact.id)
          .eq('user_id', user.id);

        if (error) throw error;

        Alert.alert('Success', 'Contact updated successfully');
      } else {
        // Create new contact
        const {error} = await supabase
          .from('emergency_contacts')
          .insert({
            user_id: user.id,
            name: formData.name.trim(),
            relationship: formData.relationship,
            phone: formData.phone.trim(),
            email: formData.email.trim() || null,
            notes: formData.notes.trim() || null,
            is_primary: formData.is_primary,
          });

        if (error) throw error;

        Alert.alert('Success', 'Contact added successfully');
      }

      // Reset form
      setFormData({
        name: '',
        relationship: 'Parent/Guardian',
        phone: '',
        email: '',
        notes: '',
        is_primary: false,
      });
      setEditingContact(null);
      setShowAddForm(false);
      loadContacts();
    } catch (error: any) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', error.message || 'Failed to save contact');
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email || '',
      notes: contact.notes || '',
      is_primary: contact.is_primary,
    });
    setShowAddForm(true);
  };

  const handleDelete = (contact: EmergencyContact) => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${contact.name}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const {user} = await authHelpers.getCurrentUser();
              
              if (!user) {
                Alert.alert('Error', 'Please log in');
                return;
              }

              const {error} = await supabase
                .from('emergency_contacts')
                .delete()
                .eq('id', contact.id)
                .eq('user_id', user.id);

              if (error) throw error;

              Alert.alert('Success', 'Contact deleted successfully');
              loadContacts();
            } catch (error: any) {
              console.error('Error deleting contact:', error);
              Alert.alert('Error', 'Failed to delete contact');
            }
          },
        },
      ]
    );
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleSMS = (phone: string) => {
    Linking.openURL(`sms:${phone}`).catch(() => {
      Alert.alert('Error', 'Unable to open SMS');
    });
  };

  const cancelEdit = () => {
    setEditingContact(null);
    setShowAddForm(false);
    setFormData({
      name: '',
      relationship: 'Parent/Guardian',
      phone: '',
      email: '',
      notes: '',
      is_primary: false,
    });
  };

  // Check if table exists by trying to load contacts
  const [tableExists, setTableExists] = useState<boolean | null>(null);

  useEffect(() => {
    checkTableExists();
  }, []);

  const checkTableExists = async () => {
    try {
      const {user} = await authHelpers.getCurrentUser();
      if (!user) {
        setTableExists(false);
        return;
      }

      const {error} = await supabase
        .from('emergency_contacts')
        .select('id')
        .limit(1);

      if (error && (error.code === 'PGRST205' || error.message?.includes('Could not find the table'))) {
        setTableExists(false);
      } else {
        setTableExists(true);
        loadContacts();
      }
    } catch (error) {
      setTableExists(false);
    }
  };

  if (loading && tableExists === null) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-600">Loading contacts...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (tableExists === false) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView className="flex-1">
          {/* Header with Back Button */}
          <View className="bg-blue-600 px-6 py-4">
            <View className="flex-row items-center mb-2">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="mr-4 p-2 -ml-2">
                <Text className="text-white text-2xl">←</Text>
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-white text-2xl font-bold">
                  Personal Emergency Contacts
                </Text>
                <Text className="text-blue-100 text-sm">
                  Database setup required
                </Text>
              </View>
            </View>
          </View>

          <View className="px-6 py-8">
            <View className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 mb-4">
              <Text className="text-yellow-900 text-xl font-bold mb-3">
                ⚠️ Database Setup Required
              </Text>
              <Text className="text-yellow-800 text-base mb-4 leading-6">
                The emergency contacts table needs to be created in your Supabase database.
              </Text>
              <Text className="text-yellow-800 text-sm mb-4 font-semibold">
                Follow these steps:
              </Text>
              <View className="mb-4">
                <Text className="text-yellow-800 text-sm mb-2">
                  1. Open Supabase SQL Editor:
                </Text>
                <Text className="text-yellow-700 text-xs bg-yellow-100 p-2 rounded mb-2 font-mono">
                  https://supabase.com/dashboard/project/yatiljvrbvnkxkkgsjyg/sql/new
                </Text>
                <Text className="text-yellow-800 text-sm mb-2">
                  2. Open the file: database/emergency_contacts.sql
                </Text>
                <Text className="text-yellow-800 text-sm mb-2">
                  3. Copy all SQL code and paste into Supabase SQL Editor
                </Text>
                <Text className="text-yellow-800 text-sm mb-2">
                  4. Click "Run" button
                </Text>
                <Text className="text-yellow-800 text-sm">
                  5. Come back here and refresh
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={checkTableExists}
              className="bg-blue-600 rounded-xl p-4 items-center">
              <Text className="text-white font-bold text-lg">
                ✓ I've Run the Migration - Check Again
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header with Back Button */}
        <View className="bg-blue-600 px-6 py-4">
          <View className="flex-row items-center mb-2">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="mr-4 p-2 -ml-2">
              <Text className="text-white text-2xl">←</Text>
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-white text-2xl font-bold">
                Personal Emergency Contacts
              </Text>
              <Text className="text-blue-100 text-sm">
                Manage your emergency contacts
              </Text>
            </View>
          </View>
        </View>

        {/* Add/Edit Form */}
        {showAddForm && (
          <View className="bg-white mx-6 mt-4 p-4 rounded-xl shadow-sm border border-gray-200">
            <Text className="text-gray-800 text-lg font-bold mb-4">
              {editingContact ? 'Edit Contact' : 'Add New Contact'}
            </Text>

            <TextInput
              placeholder="Name *"
              value={formData.name}
              onChangeText={text => setFormData({...formData, name: text})}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 mb-3"
              style={styles.input}
            />

            <View className="mb-3">
              <Text className="text-gray-700 text-sm mb-2 font-semibold">
                Relationship
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row">
                  {relationshipOptions.map(rel => (
                    <TouchableOpacity
                      key={rel}
                      onPress={() => setFormData({...formData, relationship: rel})}
                      className={`px-4 py-2 rounded-lg mr-2 ${
                        formData.relationship === rel
                          ? 'bg-blue-600'
                          : 'bg-gray-100'
                      }`}>
                      <Text
                        className={`text-sm font-semibold ${
                          formData.relationship === rel
                            ? 'text-white'
                            : 'text-gray-700'
                        }`}>
                        {rel}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <TextInput
              placeholder="Phone Number *"
              value={formData.phone}
              onChangeText={text => setFormData({...formData, phone: text})}
              keyboardType="phone-pad"
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 mb-3"
              style={styles.input}
            />

            <TextInput
              placeholder="Email (Optional)"
              value={formData.email}
              onChangeText={text => setFormData({...formData, email: text})}
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 mb-3"
              style={styles.input}
            />

            <TextInput
              placeholder="Notes (Optional)"
              value={formData.notes}
              onChangeText={text => setFormData({...formData, notes: text})}
              multiline
              numberOfLines={3}
              className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 mb-3"
              style={[styles.input, styles.textArea]}
            />

            <TouchableOpacity
              onPress={() =>
                setFormData({...formData, is_primary: !formData.is_primary})
              }
              className="flex-row items-center mb-4">
              <View
                className={`w-6 h-6 rounded border-2 mr-2 items-center justify-center ${
                  formData.is_primary
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-300'
                }`}>
                {formData.is_primary && (
                  <Text className="text-white text-xs">✓</Text>
                )}
              </View>
              <Text className="text-gray-700 font-semibold">
                Set as Primary Contact
              </Text>
            </TouchableOpacity>

            <View className="flex-row">
              <TouchableOpacity
                onPress={cancelEdit}
                className="flex-1 bg-gray-200 rounded-lg py-3 mr-2">
                <Text className="text-gray-700 font-semibold text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                className="flex-1 bg-blue-600 rounded-lg py-3 ml-2">
                <Text className="text-white font-semibold text-center">
                  {editingContact ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Contacts List */}
        <View className="px-6 py-4">
          {!showAddForm && (
            <TouchableOpacity
              onPress={() => setShowAddForm(true)}
              className="bg-blue-600 rounded-xl p-4 mb-4 items-center">
              <Text className="text-white text-lg font-bold">+ Add Emergency Contact</Text>
            </TouchableOpacity>
          )}

          {contacts.length === 0 ? (
            <View className="bg-white rounded-xl p-6 items-center border border-gray-200">
              <Text className="text-gray-500 text-lg mb-2">
                No emergency contacts yet
              </Text>
              <Text className="text-gray-400 text-sm text-center">
                Add your first emergency contact to get started
              </Text>
            </View>
          ) : (
            contacts.map(contact => (
              <View
                key={contact.id}
                className={`bg-white rounded-xl p-4 mb-3 shadow-sm border-2 ${
                  contact.is_primary
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}>
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-1">
                      <Text className="text-gray-800 font-bold text-lg mr-2">
                        {contact.name}
                      </Text>
                      {contact.is_primary && (
                        <View className="bg-blue-600 px-2 py-1 rounded">
                          <Text className="text-white text-xs font-bold">
                            PRIMARY
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-600 text-sm mb-1">
                      {contact.relationship}
                    </Text>
                    <Text className="text-gray-800 font-semibold text-base mb-1">
                      📞 {contact.phone}
                    </Text>
                    {contact.email && (
                      <Text className="text-gray-600 text-sm mb-1">
                        ✉️ {contact.email}
                      </Text>
                    )}
                    {contact.notes && (
                      <Text className="text-gray-500 text-sm italic">
                        {contact.notes}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row mt-3">
                  <TouchableOpacity
                    onPress={() => handleCall(contact.phone)}
                    className="flex-1 bg-green-500 rounded-lg py-2 mr-2 items-center">
                    <Text className="text-white font-semibold text-sm">📞 Call</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSMS(contact.phone)}
                    className="flex-1 bg-blue-500 rounded-lg py-2 mr-2 items-center">
                    <Text className="text-white font-semibold text-sm">💬 SMS</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleEdit(contact)}
                    className="bg-yellow-500 rounded-lg py-2 px-4 mr-2">
                    <Text className="text-white font-semibold text-sm">✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(contact)}
                    className="bg-red-500 rounded-lg py-2 px-4">
                    <Text className="text-white font-semibold text-sm">🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Info Section */}
        <View className="px-6 py-4 mb-6">
          <View className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <Text className="text-blue-800 font-semibold text-base mb-2">
              💡 Tips
            </Text>
            <Text className="text-blue-700 text-sm leading-5">
              • Add at least one primary emergency contact{'\n'}
              • Keep contact information up to date{'\n'}
              • Use the Call/SMS buttons for quick access{'\n'}
              • All contacts are saved securely in the database
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    color: '#1F2937',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
});

export default EmergencyContactsScreen;

