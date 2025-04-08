import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
} from 'react-native';
import { useState, useEffect } from 'react';
import { useTheme } from '../../context/theme';
import { Ionicons } from '@expo/vector-icons';
import { marketplaceService, Product } from '../../services/marketplace';
import MarketplaceDetailsModal from '../../components/MarketplaceDetailsModal';

const categories = [
  { id: 'all', name: 'All', icon: 'grid' },
  { id: 'eco', name: 'Eco-Friendly', icon: 'leaf' },
  { id: 'energy', name: 'Energy-Saving', icon: 'flash' },
  { id: 'tech', name: 'Technology', icon: 'laptop' },
  { id: 'food', name: 'Food & Drinks', icon: 'fast-food' },
];

export default function Marketplace() {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (selectedCategory === 'all') {
        data = await marketplaceService.getProducts();
      } else {
        const categorySelected = categories.find(
          (category) => category.id === selectedCategory
        );
        data = await marketplaceService.getProductsByCategory(
          categorySelected?.name || ''
        );
      }
      console.log(data);
      setProducts(data);
    } catch (e) {
      console.error('Error loading products:', e);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#1F2937' : '#F8FAFC' },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: isDark ? '#111827' : 'white' },
        ]}
      >
        <Ionicons
          name="search"
          size={20}
          color={isDark ? '#9CA3AF' : '#64748B'}
        />
        <TextInput
          style={[
            styles.searchPlaceholder,
            { color: isDark ? '#fff' : '#1F2937' },
          ]}
          placeholder="Search eco-friendly products..."
          placeholderTextColor={isDark ? '#6B7280' : '#94A3B8'}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={{
          alignItems: 'flex-start',
        }}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              {
                backgroundColor: isDark
                  ? selectedCategory === category.id
                    ? '#374151'
                    : '#111827'
                  : selectedCategory === category.id
                  ? '#E2E8F0'
                  : 'white',
              },
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <View
              style={[
                styles.categoryIconContainer,
                {
                  backgroundColor:
                    selectedCategory === category.id
                      ? '#00B28820'
                      : isDark
                      ? '#374151'
                      : '#F1F5F9',
                },
              ]}
            >
              <Ionicons
                name={category.icon as any}
                size={20}
                color={
                  selectedCategory === category.id
                    ? '#00B288'
                    : isDark
                    ? '#9CA3AF'
                    : '#64748B'
                }
              />
            </View>
            <Text
              style={[
                styles.categoryText,
                {
                  color:
                    selectedCategory === category.id
                      ? '#00B288'
                      : isDark
                      ? '#9CA3AF'
                      : '#64748B',
                },
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.messageContainer}>
          <Text style={{ color: isDark ? '#fff' : '#1F2937' }}>
            Loading products...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.messageContainer}>
          <Text style={{ color: isDark ? '#fff' : '#1F2937' }}>{error}</Text>
        </View>
      ) : (
        <View style={styles.productsGrid}>
          {products.map((product) => (
            <TouchableOpacity
              key={product.id}
              style={[
                styles.productCard,
                { backgroundColor: isDark ? '#111827' : 'white' },
              ]}
              onPress={() => handleProductPress(product)}
            >
              <Image
                source={{ uri: product.image_url || '' }}
                style={styles.productImage}
                resizeMode="cover"
              />
              <View style={styles.productInfo}>
                <Text
                  style={[
                    styles.productTitle,
                    { color: isDark ? '#fff' : '#1F2937' },
                  ]}
                  numberOfLines={2}
                >
                  {product.name}
                </Text>
                <View style={styles.productMeta}>
                  <Text
                    style={[
                      styles.productPrice,
                      { color: isDark ? '#00B288' : '#00B288' },
                    ]}
                  >
                    <Ionicons name="star" size={16} color="#FFD700" />
                    &nbsp;
                    {product.amount
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  </Text>
                  <View style={styles.rating}>
                    <Text
                      style={[
                        styles.ratingText,
                        { color: isDark ? '#9CA3AF' : '#64748B' },
                      ]}
                    >
                      {product.category}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <MarketplaceDetailsModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        product={selectedProduct}
      />

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 12,
    margin: 20,
    marginTop: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchPlaceholder: {
    marginLeft: 10,
    flex: 1,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 12,
    padding: 12,
    marginBottom: 6,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  productsGrid: {
    padding: 20,
    gap: 20,
  },
  productCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 200,
  },
  productInfo: {
    padding: 16,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
