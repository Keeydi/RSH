import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {PaymentIcon, OrderIcon, DeliveryIcon, BellIcon} from './Icons';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  date: string;
  read: boolean;
  type: 'payment' | 'order' | 'delivery' | 'general';
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Payment Verified',
      message: 'Your payment for ORD-001 (₱5,000.00) has been verified and your order is now in production.',
      time: '2 hours ago',
      date: '2024-01-20',
      read: false,
      type: 'payment',
    },
    {
      id: '2',
      title: 'Order Update',
      message: 'ORD-001 is now in production. Expected completion: January 22, 2024.',
      time: '1 day ago',
      date: '2024-01-19',
      read: false,
      type: 'order',
    },
    {
      id: '3',
      title: 'Payment Pending',
      message: 'Your payment proof for ORD-002 is being reviewed. We will notify you once verified.',
      time: '2 days ago',
      date: '2024-01-18',
      read: true,
      type: 'payment',
    },
    {
      id: '4',
      title: 'Order Placed',
      message: 'Your order ORD-002 has been placed successfully. Please proceed with payment.',
      time: '3 days ago',
      date: '2024-01-17',
      read: true,
      type: 'order',
    },
    {
      id: '5',
      title: 'Quality Check Complete',
      message: 'Quality check for ORD-001 has been completed. Your order is ready for delivery.',
      time: '4 days ago',
      date: '2024-01-16',
      read: true,
      type: 'order',
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

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <PaymentIcon color="#FFFFFF" size={20} />;
      case 'order':
        return <OrderIcon color="#FFFFFF" size={20} />;
      case 'delivery':
        return <DeliveryIcon color="#FFFFFF" size={20} />;
      default:
        return <BellIcon color="#FFFFFF" size={20} />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="bg-black px-6 py-4 border-b border-white/10">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-white text-2xl font-bold">Notifications</Text>
            <Text className="text-white/60 text-sm mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </Text>
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              className="bg-white/10 px-4 py-2 rounded-lg">
              <Text className="text-white text-sm font-semibold">Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          {notifications.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Text className="text-white/60 text-lg">No notifications</Text>
              <Text className="text-white/40 text-sm mt-2">
                You're all caught up!
              </Text>
            </View>
          ) : (
            notifications.map(notification => (
              <TouchableOpacity
                key={notification.id}
                onPress={() => markAsRead(notification.id)}
                className={`bg-white/5 rounded-xl p-4 mb-3 border ${
                  notification.read ? 'border-white/10' : 'border-white/30'
                }`}>
                <View className="flex-row items-start">
                  <View className="w-10 h-10 bg-white/10 rounded-full items-center justify-center mr-3">
                    {getNotificationIcon(notification.type)}
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text
                          className={`font-semibold text-base mb-1 ${
                            notification.read ? 'text-white/80' : 'text-white'
                          }`}>
                          {notification.title}
                        </Text>
                        <Text className="text-white/60 text-sm leading-5">
                          {notification.message}
                        </Text>
                      </View>
                      {!notification.read && (
                        <View className="w-2 h-2 bg-white rounded-full ml-2 mt-1" />
                      )}
                    </View>
                    <View className="flex-row items-center mt-2">
                      <Text className="text-white/40 text-xs">{notification.time}</Text>
                      <Text className="text-white/40 text-xs mx-2">•</Text>
                      <Text className="text-white/40 text-xs">{notification.date}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

