import FilterModal from '@/components/FilterModal';
import PropertyCard from '@/components/PropertyCard';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { useFilterStore } from '@/store/filterStore';
import { Property } from '@/types';
import { useLocalSearchParams } from 'expo-router';
import { Bed, MagnifyingGlass, SlidersHorizontal, X, XCircle } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function FilterChip({ children, onRemove }: { children: React.ReactNode; onRemove: () => void }) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-[#EAFBE3] px-3 py-1.5">
      {children}
      <Pressable onPress={onRemove} hitSlop={6}>
        <X size={12} weight="bold" color="#171717" />
      </Pressable>
    </View>
  );
}

export default function SearchScreen() {
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

  useEffect(() => {
    if (openFilters === 'true') {
      setShowFilters(true);
    }
  }, [openFilters]);

  const {
    search,
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setSearch,
    setType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
  } = useFilterStore();

  const activeFilterCount = [
    type !== null,
    bedrooms !== null,
    minPrice !== null,
    maxPrice !== null,
  ].filter(Boolean).length;

  useEffect(() => {
    fetchResults();
  }, [search, type, bedrooms, minPrice, maxPrice]);

  const fetchResults = async () => {
    setLoading(true);

    let query = supabase.from('properties').select('*');

    if (search) {
      query = query.or(`title.ilike.%${search}%,city.ilike.%${search}%`);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (bedrooms) {
      query = query.eq('bedrooms', bedrooms);
    }

    if (minPrice) {
      query = query.gte('price', minPrice);
    }

    if (maxPrice) {
      query = query.lte('price', maxPrice);
    }

    const { data } = await query.order('created_at', { ascending: false });

    setResults(data ?? []);
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#f5f5f5]">
      {/* Header */}
      <View className="px-5 pb-3 pt-4">
        <Text className="mb-4 font-jakarta-bold text-2xl tracking-tighter text-neutral-900">
          Find Property
        </Text>

        {/* Search Bar + Filter Button */}
        <View className="flex-row items-center gap-3">
          <View className="h-[52px] flex-1 flex-row items-center gap-3 rounded-full bg-white px-5">
            <MagnifyingGlass size={20} weight="regular" color="#9CA3AF" />
            <TextInput
              className="flex-1 font-jakarta text-[14px] text-neutral-900"
              placeholder="Search by title or city..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch('')} hitSlop={6}>
                <XCircle size={18} weight="fill" color="#9CA3AF" />
              </Pressable>
            )}
          </View>

          {/* Filter Button */}
          <Pressable
            onPress={() => setShowFilters(true)}
            className={`h-[52px] w-[52px] items-center justify-center rounded-full ${
              activeFilterCount > 0 ? 'bg-[#8FE07A]' : 'bg-white'
            }`}
          >
            <SlidersHorizontal size={20} weight="regular" color="#171717" />
            {activeFilterCount > 0 && (
              <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-[9px] font-bold">{activeFilterCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <View className="mt-3 flex-row flex-wrap gap-2">
            {type && (
              <FilterChip onRemove={() => setType(null)}>
                <Text className="font-jakarta-medium text-xs capitalize text-neutral-900">
                  {type}
                </Text>
              </FilterChip>
            )}
            {bedrooms !== null && (
              <FilterChip onRemove={() => setBedrooms(null)}>
                <Bed size={13} weight="regular" color="#171717" />
                <Text className="font-jakarta-medium text-xs text-neutral-900">
                  {bedrooms === 4 ? '4+ beds' : `${bedrooms} bed${bedrooms > 1 ? 's' : ''}`}
                </Text>
              </FilterChip>
            )}
            {(minPrice !== null || maxPrice !== null) && (
              <FilterChip
                onRemove={() => {
                  setMinPrice(null);
                  setMaxPrice(null);
                }}
              >
                <Text className="font-jakarta-medium text-xs text-neutral-900">
                  {minPrice && maxPrice
                    ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                    : minPrice
                      ? `From ${formatPrice(minPrice)}`
                      : `Up to ${formatPrice(maxPrice!)}`}
                </Text>
              </FilterChip>
            )}
          </View>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListHeaderComponent={
          <Text className="mb-4 font-jakarta text-sm text-neutral-400">
            {loading ? 'Searching...' : `${results.length} properties found`}
          </Text>
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-20">
              <MagnifyingGlass size={48} weight="regular" color="#D1D5DB" />
              <Text className="mt-4 font-jakarta text-base text-neutral-400">
                No properties found
              </Text>
              <Text className="mt-1 font-jakarta text-sm text-neutral-300">
                Try a different search or adjust filters
              </Text>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#171717" className="py-20" />
          )
        }
      />

      {/* Filter Modal */}
      <FilterModal visible={showFilters} onClose={() => setShowFilters(false)} />
    </SafeAreaView>
  );
}
