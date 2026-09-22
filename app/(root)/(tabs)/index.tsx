import CategoryFilter, { PropertyCategory } from '@/components/CategoryFilter';
import FeaturedCard from '@/components/FeaturedCard';
import HomeHeader from '@/components/HomeHeader';
import HomeSearchBar from '@/components/HomeSearchBar';
import PropertyCard from '@/components/PropertyCard';
import { supabase } from '@/lib/supabase';
import { Property } from '@/types';
import { useUser } from '@clerk/expo';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { user } = useUser();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [category, setCategory] = useState<PropertyCategory>('all');

  const fetchFeatured = useCallback(async () => {
    setFeaturedLoading(true);

    const { data } = await supabase
      .from('properties')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false });

    setFeatured(data ?? []);
    setFeaturedLoading(false);
  }, []);

  const fetchRecommended = useCallback(async (activeCategory: PropertyCategory) => {
    setRecommendedLoading(true);

    let query = supabase
      .from('properties')
      .select('*')
      .eq('is_featured', false)
      .order('created_at', { ascending: false });

    if (activeCategory !== 'all') {
      query = query.eq('type', activeCategory);
    }

    const { data } = await query;

    setRecommended(data ?? []);
    setRecommendedLoading(false);
  }, []);

  // Refetch featured only when the tab regains focus
  useFocusEffect(
    useCallback(() => {
      fetchFeatured();
    }, [fetchFeatured])
  );

  // Refetch recommended when the tab regains focus OR the category changes
  useFocusEffect(
    useCallback(() => {
      fetchRecommended(category);
    }, [fetchRecommended, category])
  );

  const name = user?.emailAddresses[0].emailAddress.split('@')[0] ?? 'User';

  return (
    <SafeAreaView className="flex-1 bg-[#f5f5f5]">
      <FlatList
        data={recommended}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <HomeHeader name={name} />
            <HomeSearchBar />

            <View className="mx-5 mb-6">
              <Text className="font-jakarta-semibold text-2xl tracking-tighter">
                Welcome Back, {name}
              </Text>
              <Text className="mt-1 font-jakarta text-sm leading-relaxed text-neutral-500">
                Explore homes and apartments tailored for you
              </Text>
            </View>

            {/* Featured Section — unaffected by the category filter */}
            <View className="mb-6">
              {featuredLoading ? (
                <ActivityIndicator size="small" color="#2563EB" className="py-10" />
              ) : (
                <FlatList
                  data={featured}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => <FeaturedCard property={item} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
                />
              )}
            </View>

            {/* Category filter — only affects the recommended list below */}
            <View className="mb-5">
              <CategoryFilter selected={category} onSelect={setCategory} />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View className="px-5">
            <PropertyCard property={item} />
          </View>
        )}
        ListEmptyComponent={
          !recommendedLoading ? (
            <View className="items-center py-10">
              <Text className="text-gray-400">No properties found</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
