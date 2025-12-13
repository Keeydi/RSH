import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
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

interface NotificationDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

const NotificationDropdown = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}: NotificationDropdownProps) => {
  const [visible, setVisible] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <PaymentIcon color="#FFFFFF" size={16} />;
      case 'order':
        return <OrderIcon color="#FFFFFF" size={16} />;
      case 'delivery':
        return <DeliveryIcon color="#FFFFFF" size={16} />;
      default:
        return <BellIcon color="#FFFFFF" size={16} />;
    }
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className="relative">
        <View className="w-10 h-10 bg-white/10 rounded-full items-center justify-center">
          <BellIcon color="#FFFFFF" size={18} />
        </View>
        {unreadCount > 0 && (
          <View className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full items-center justify-center">
            <Text className="text-black text-xs font-bold">{unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisible(false)}>
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View className="flex-1 justify-end">
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              className="bg-black border-t border-white/10 rounded-t-3xl max-h-[80%]">
              {/* Header */}
              <View className="px-6 py-4 border-b border-white/10">
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white text-2xl font-bold">Notifications</Text>
                    <Text className="text-white/60 text-sm mt-1">
                      {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </Text>
                  </View>
                  <View className="flex-row">
                    {unreadCount > 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          onMarkAllAsRead();
                        }}
                        className="bg-white/10 px-4 py-2 rounded-lg mr-2">
                        <Text className="text-white text-sm font-semibold">Mark all read</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      onPress={() => setVisible(false)}
                      className="bg-white/10 px-4 py-2 rounded-lg">
                      <Text className="text-white text-sm font-semibold">Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Notifications List */}
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
                        onPress={() => {
                          onMarkAsRead(notification.id);
                        }}
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
                                  className={`font-semibold text-sm mb-1 ${
                                    notification.read ? 'text-white/80' : 'text-white'
                                  }`}>
                                  {notification.title}
                                </Text>
                                <Text className="text-white/60 text-xs leading-4">
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
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default NotificationDropdown;


