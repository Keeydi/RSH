import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface OrderStatus {
  id: string;
  status: string;
  date: string;
  description: string;
  completed: boolean;
}

const OrderTrackingScreen = () => {
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const orders = [
    {
      id: 'ORD-001',
      items: 'Custom T-Shirt',
      totalAmount: 10000,
      orderDate: '2024-01-10',
      estimatedDelivery: '2024-01-25',
      status: 'In Production',
      progress: 60,
      timeline: [
        {
          id: '1',
          status: 'Order Placed',
          date: '2024-01-10',
          description: 'Your order has been placed successfully',
          completed: true,
        },
        {
          id: '2',
          status: 'Payment Verified',
          date: '2024-01-11',
          description: 'Your payment has been verified',
          completed: true,
        },
        {
          id: '3',
          status: 'In Production',
          date: '2024-01-12',
          description: 'Your order is being produced',
          completed: true,
        },
        {
          id: '4',
          status: 'Quality Check',
          date: '2024-01-20',
          description: 'Quality check in progress',
          completed: false,
        },
        {
          id: '5',
          status: 'Ready for Delivery',
          date: '2024-01-22',
          description: 'Order ready for delivery',
          completed: false,
        },
        {
          id: '6',
          status: 'Delivered',
          date: '2024-01-25',
          description: 'Order delivered',
          completed: false,
        },
      ] as OrderStatus[],
    },
    {
      id: 'ORD-002',
      items: 'Logo Design',
      totalAmount: 6000,
      orderDate: '2024-01-15',
      estimatedDelivery: '2024-01-30',
      status: 'Pending Payment',
      progress: 0,
      timeline: [
        {
          id: '1',
          status: 'Order Placed',
          date: '2024-01-15',
          description: 'Your order has been placed successfully',
          completed: true,
        },
        {
          id: '2',
          status: 'Payment Verified',
          date: '',
          description: 'Waiting for payment verification',
          completed: false,
        },
        {
          id: '3',
          status: 'In Production',
          date: '',
          description: 'Production will start after payment',
          completed: false,
        },
        {
          id: '4',
          status: 'Quality Check',
          date: '',
          description: 'Quality check pending',
          completed: false,
        },
        {
          id: '5',
          status: 'Ready for Delivery',
          date: '',
          description: 'Delivery pending',
          completed: false,
        },
        {
          id: '6',
          status: 'Delivered',
          date: '',
          description: 'Delivery pending',
          completed: false,
        },
      ] as OrderStatus[],
    },
  ];

  const renderTimeline = (timeline: OrderStatus[]) => {
    return (
      <View className="ml-4">
        {timeline.map((item, index) => (
          <View key={item.id} className="flex-row">
            <View className="items-center mr-4">
              <View
                className={`w-4 h-4 rounded-full border-2 ${
                  item.completed
                    ? 'bg-white border-white'
                    : 'bg-transparent border-white/30'
                }`}
              />
              {index < timeline.length - 1 && (
                <View
                  className={`w-0.5 flex-1 ${
                    item.completed ? 'bg-white' : 'bg-white/30'
                  }`}
                  style={{minHeight: 60}}
                />
              )}
            </View>
            <View className="flex-1 pb-6">
              <Text
                className={`text-sm font-semibold ${
                  item.completed ? 'text-white' : 'text-white/60'
                }`}>
                {item.status}
              </Text>
              {item.date && (
                <Text className="text-white/40 text-xs mt-1">{item.date}</Text>
              )}
              <Text className="text-white/60 text-xs mt-1">{item.description}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-black px-6 py-4 border-b border-white/10">
          <Text className="text-white text-2xl font-bold">Order Tracking</Text>
          <Text className="text-white/60 text-sm mt-1">Track your orders</Text>
        </View>

        <View className="px-6 py-6">
          {orders.map(order => (
            <View
              key={order.id}
              className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
              {/* Order Header */}
              <TouchableOpacity
                onPress={() =>
                  setSelectedOrder(selectedOrder === order.id ? null : order.id)
                }>
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-white font-bold text-lg">{order.id}</Text>
                    <Text className="text-white/60 text-sm mt-1">{order.items}</Text>
                    <Text className="text-white/40 text-xs mt-1">
                      Ordered: {order.orderDate}
                    </Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${
                    order.status === 'In Production'
                      ? 'bg-white/20'
                      : order.status === 'Pending Payment'
                      ? 'bg-white/10'
                      : 'bg-white/20'
                  }`}>
                    <Text className="text-white text-xs font-semibold">{order.status}</Text>
                  </View>
                </View>

                {/* Progress Bar */}
                {order.progress > 0 && (
                  <View className="mb-3">
                    <View className="flex-row justify-between mb-1">
                      <Text className="text-white/60 text-xs">Progress</Text>
                      <Text className="text-white/60 text-xs">{order.progress}%</Text>
                    </View>
                    <View className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-white rounded-full"
                        style={{width: `${order.progress}%`}}
                      />
                    </View>
                  </View>
                )}

                {/* Order Details */}
                <View className="flex-row justify-between mb-3">
                  <View>
                    <Text className="text-white/60 text-xs">Total Amount</Text>
                    <Text className="text-white font-semibold">
                      ₱{order.totalAmount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-white/60 text-xs">Est. Delivery</Text>
                    <Text className="text-white font-semibold">{order.estimatedDelivery}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Timeline */}
              {selectedOrder === order.id && (
                <View className="mt-4 pt-4 border-t border-white/10">
                  <Text className="text-white font-semibold mb-4">Order Timeline</Text>
                  {renderTimeline(order.timeline)}
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderTrackingScreen;

