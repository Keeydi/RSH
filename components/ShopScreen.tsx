import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  inStock: boolean;
}

const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Steel Bars', 'Steel Plates', 'Steel Pipes', 'Steel Sheets', 'Accessories'];

  const shopItems: ShopItem[] = [
    {
      id: 'SB-001',
      name: 'Steel Rebar 12mm',
      description: 'High-grade steel reinforcement bar, 12mm diameter',
      price: 450,
      category: 'Steel Bars',
      inStock: true,
    },
    {
      id: 'SB-002',
      name: 'Steel Rebar 16mm',
      description: 'High-grade steel reinforcement bar, 16mm diameter',
      price: 680,
      category: 'Steel Bars',
      inStock: true,
    },
    {
      id: 'SB-003',
      name: 'Steel Rebar 20mm',
      description: 'High-grade steel reinforcement bar, 20mm diameter',
      price: 920,
      category: 'Steel Bars',
      inStock: true,
    },
    {
      id: 'SP-001',
      name: 'Steel Plate 6mm',
      description: 'Structural steel plate, 6mm thickness',
      price: 850,
      category: 'Steel Plates',
      inStock: true,
    },
    {
      id: 'SP-002',
      name: 'Steel Plate 10mm',
      description: 'Structural steel plate, 10mm thickness',
      price: 1200,
      category: 'Steel Plates',
      inStock: true,
    },
    {
      id: 'SP-003',
      name: 'Steel Plate 12mm',
      description: 'Structural steel plate, 12mm thickness',
      price: 1450,
      category: 'Steel Plates',
      inStock: false,
    },
    {
      id: 'SPP-001',
      name: 'Steel Pipe 2"',
      description: 'Galvanized steel pipe, 2 inch diameter',
      price: 650,
      category: 'Steel Pipes',
      inStock: true,
    },
    {
      id: 'SPP-002',
      name: 'Steel Pipe 4"',
      description: 'Galvanized steel pipe, 4 inch diameter',
      price: 1200,
      category: 'Steel Pipes',
      inStock: true,
    },
    {
      id: 'SS-001',
      name: 'Steel Sheet 0.5mm',
      description: 'Galvanized steel sheet, 0.5mm thickness',
      price: 320,
      category: 'Steel Sheets',
      inStock: true,
    },
    {
      id: 'SS-002',
      name: 'Steel Sheet 1.0mm',
      description: 'Galvanized steel sheet, 1.0mm thickness',
      price: 580,
      category: 'Steel Sheets',
      inStock: true,
    },
    {
      id: 'ACC-001',
      name: 'Steel Wire Mesh',
      description: 'Welded steel wire mesh, standard size',
      price: 280,
      category: 'Accessories',
      inStock: true,
    },
    {
      id: 'ACC-002',
      name: 'Steel Bolts & Nuts',
      description: 'High-tensile steel bolts and nuts set',
      price: 150,
      category: 'Accessories',
      inStock: true,
    },
  ];

  const filteredItems = shopItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="bg-black px-6 py-4 border-b border-white/10">
        <Text className="text-white text-2xl font-bold mb-4">Steel Shop</Text>
        
        {/* Search Bar */}
        <View className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 mb-4">
          <TextInput
            className="text-white text-base"
            placeholder="Search products..."
            placeholderTextColor="#FFFFFF60"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row">
          {categories.map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full mr-2 ${
                selectedCategory === category
                  ? 'bg-white'
                  : 'bg-white/10 border border-white/20'
              }`}>
              <Text
                className={`text-sm font-semibold ${
                  selectedCategory === category ? 'text-black' : 'text-white'
                }`}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Products Grid */}
      <ScrollView className="flex-1">
        <View className="px-6 py-4">
          <Text className="text-white/60 text-sm mb-4">
            {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''} found
          </Text>

          <View className="flex-row flex-wrap justify-between">
            {filteredItems.map(item => (
              <TouchableOpacity
                key={item.id}
                className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10"
                style={{width: '48%'}}>
                {/* Product Image Placeholder */}
                <View className="bg-white/10 rounded-lg w-full h-32 items-center justify-center mb-3">
                  <View className="w-16 h-16 border-2 border-white/30 rounded-lg items-center justify-center">
                    <Text className="text-white/60 text-xs">IMG</Text>
                  </View>
                </View>

                {/* Product Info */}
                <View className="mb-2">
                  <Text className="text-white font-semibold text-sm mb-1" numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text className="text-white/60 text-xs mb-2" numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>

                {/* Price and Stock */}
                <View className="flex-row justify-between items-center">
                  <View>
                    <Text className="text-white font-bold text-base">
                      ₱{item.price.toLocaleString('en-US')}
                    </Text>
                    <Text className="text-white/40 text-xs">per unit</Text>
                  </View>
                  <View
                    className={`px-2 py-1 rounded-full ${
                      item.inStock ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                    <Text
                      className={`text-xs font-semibold ${
                        item.inStock ? 'text-white' : 'text-white/60'
                      }`}>
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </Text>
                  </View>
                </View>

                {/* Add to Cart Button */}
                <TouchableOpacity
                  disabled={!item.inStock}
                  className={`mt-3 py-2 rounded-lg items-center ${
                    item.inStock
                      ? 'bg-white'
                      : 'bg-white/10 border border-white/20'
                  }`}>
                  <Text
                    className={`font-semibold text-sm ${
                      item.inStock ? 'text-black' : 'text-white/40'
                    }`}>
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>

          {filteredItems.length === 0 && (
            <View className="items-center justify-center py-20">
              <Text className="text-white/60 text-lg">No products found</Text>
              <Text className="text-white/40 text-sm mt-2">
                Try adjusting your search or filter
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShopScreen;


