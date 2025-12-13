import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import NotificationDropdown from './NotificationDropdown';

const CustomerDashboard = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // Mock data
  const [orders] = useState([
    {
      id: 'ORD-001',
      status: 'In Production',
      items: 'Custom T-Shirt',
      date: '2024-01-15',
      progress: 60,
    },
    {
      id: 'ORD-002',
      status: 'Pending Payment',
      items: 'Logo Design',
      date: '2024-01-20',
      progress: 0,
    },
  ]);

  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'Payment Verified',
      message: 'Your payment for ORD-001 has been verified',
      time: '2 hours ago',
      date: '2024-01-20',
      read: false,
      type: 'payment' as const,
    },
    {
      id: '2',
      title: 'Order Update',
      message: 'ORD-001 is now in production',
      time: '1 day ago',
      date: '2024-01-19',
      read: false,
      type: 'order' as const,
    },
    {
      id: '3',
      title: 'Payment Pending',
      message: 'Your payment proof for ORD-002 is being reviewed',
      time: '2 days ago',
      date: '2024-01-18',
      read: true,
      type: 'payment' as const,
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? {...notif, read: true} : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({...notif, read: true})));
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFFFFF" />
        }>
        {/* Header */}
        <View className="bg-black px-6 py-4 border-b border-white/10">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-white text-2xl font-bold">Dashboard</Text>
              <Text className="text-white/60 text-sm mt-1">Welcome back!</Text>
            </View>
            <NotificationDropdown
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
            />
          </View>
        </View>

        {/* Quick Stats */}
        <View className="px-6 py-4">
          <View className="flex-row justify-between mb-4">
            <View className="flex-1 bg-white/5 rounded-xl p-4 mr-2 border border-white/10">
              <Text className="text-white/60 text-xs mb-1">Active Orders</Text>
              <Text className="text-white text-2xl font-bold">{orders.length}</Text>
            </View>
            <View className="flex-1 bg-white/5 rounded-xl p-4 ml-2 border border-white/10">
              <Text className="text-white/60 text-xs mb-1">Unread Notifications</Text>
              <Text className="text-white text-2xl font-bold">{unreadCount}</Text>
            </View>
          </View>
        </View>

        {/* Recent Orders */}
        <View className="px-6 py-2">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">Recent Orders</Text>
            <TouchableOpacity onPress={() => navigation.navigate('OrderTracking' as never)}>
              <Text className="text-white/80 text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          {orders.map(order => (
            <TouchableOpacity
              key={order.id}
              onPress={() => navigation.navigate('OrderTracking' as never)}
              className="bg-white/5 rounded-xl p-4 mb-3 border border-white/10">
              <View className="flex-row justify-between items-start mb-2">
                <View className="flex-1">
                  <Text className="text-white font-semibold text-base">{order.id}</Text>
                  <Text className="text-white/60 text-sm mt-1">{order.items}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${
                  order.status === 'In Production' ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  <Text className="text-white text-xs font-semibold">{order.status}</Text>
                </View>
              </View>
              <View className="flex-row justify-between items-center mt-2">
                <Text className="text-white/60 text-xs">{order.date}</Text>
                {order.progress > 0 && (
                  <View className="flex-1 ml-4">
                    <View className="h-1 bg-white/10 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-white rounded-full"
                        style={{width: `${order.progress}%`}}
                      />
                    </View>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerDashboard;

