import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {theme} from '../config/theme';

const HomeScreen = () => {
  const navigation = useNavigation();

  const quickActions = [
    {
      id: 'map',
      title: 'School Map',
      subtitle: 'View evacuation routes',
      icon: '🗺️',
      color: theme.secondary.main, // Logo blue
      route: 'Map' as never,
    },
    {
      id: 'hotlines',
      title: 'Emergency Hotlines',
      subtitle: 'Quick contact',
      icon: '📞',
      color: theme.primary.main, // Logo orange-red
      route: 'Hotlines' as never,
    },
    {
      id: 'focus',
      title: 'F.O.C.U.S.',
      subtitle: 'Stay calm',
      icon: '🧘',
      color: theme.secondary.dark, // Logo deep blue
      route: 'FOCUS' as never,
    },
    {
      id: 'learn',
      title: 'Learn & Practice',
      subtitle: 'Emergency guides',
      icon: '📚',
      color: theme.primary.dark, // Logo red
      route: 'Learn' as never,
    },
  ];

  const emergencyTypes = [
    {type: 'Earthquake', icon: '🌍'},
    {type: 'Fire', icon: '🔥'},
    {type: 'Flood', icon: '🌊'},
    {type: 'Typhoon', icon: '🌀'},
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header - Logo Colors */}
        <View style={{backgroundColor: theme.primary.main}} className="px-6 py-6">
          <Text className="text-white text-3xl font-bold mb-2">RHS ArchAID</Text>
          <Text style={{color: '#FFE5D9'}} className="text-base">Your Emergency Preparedness Companion</Text>
        </View>

        {/* Quick Actions Grid */}
        <View className="px-6 py-6">
          <Text className="text-gray-800 text-xl font-bold mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map(action => (
              <TouchableOpacity
                key={action.id}
                onPress={() => navigation.navigate(action.route)}
                className="w-[48%] bg-white rounded-xl p-4 mb-4 shadow-sm border border-gray-200"
                style={{borderLeftWidth: 4, borderLeftColor: action.color}}>
                <Text className="text-3xl mb-2">{action.icon}</Text>
                <Text className="text-gray-800 font-bold text-base mb-1">{action.title}</Text>
                <Text className="text-gray-500 text-xs">{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Emergency Guides */}
        <View className="px-6 py-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-800 text-xl font-bold">Emergency Guides</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Learn' as never)}>
              <Text style={{color: theme.secondary.main}} className="text-sm font-semibold">View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {emergencyTypes.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate('Learn' as never)}
                className="bg-white rounded-xl p-4 mr-3 shadow-sm border border-gray-200 items-center"
                style={{width: 100}}>
                <Text className="text-4xl mb-2">{item.icon}</Text>
                <Text className="text-gray-800 font-semibold text-sm text-center">{item.type}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Offline Status */}
        <View className="px-6 py-4 mb-4">
          <View className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <View className="flex-row items-center mb-2">
              <Text className="text-yellow-600 text-lg mr-2">✓</Text>
              <Text className="text-yellow-800 font-bold text-base">Offline Mode Active</Text>
            </View>
            <Text className="text-yellow-700 text-sm">
              All maps, hotlines, and guides are available offline. Updates will sync when internet is available.
            </Text>
          </View>
        </View>

        {/* Safety Tips */}
        <View className="px-6 py-2 mb-6">
          <Text className="text-gray-800 text-xl font-bold mb-4">Safety Tips</Text>
          <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <Text className="text-gray-700 text-sm leading-6">
              • Know your evacuation routes{'\n'}
              • Keep emergency contacts updated{'\n'}
              • Practice drills regularly{'\n'}
              • Stay calm and follow instructions
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

