import PropertyCard from '@/components/PropertyCard';
import { useSupabase } from '@/hooks/useSupabase';
import { Property } from '@/types';
import { useAuth } from '@clerk/expo';
import { useFocusEffect, useRouter } from 'expo-router';
import { Heart } from 'phosphor-react-native';
import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SavedProperty {
  id: string;
  property_id: string;
  properties: Property;
}

export default function SavedScreen() {
  const { userId } = useAuth();
  const authSupabase = useSupabase();
  const router = useRouter();

  const [saved, setSaved] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const { data } = await authSupabase
      .from('saved_properties')
      .select('id, property_id, properties(*)')
      .eq('user_clerk_id', userId)
      .order('id', { ascending: false });

    setSaved((data as unknown as SavedProperty[]) ?? []);
    setLoading(false);
  }, [userId]);

  // Refresh every time the tab comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchSaved();
    }, [fetchSaved])
  );

  return (
    <SafeAreaView className="flex-1 bg-[#f5f5f5]">
      {/* Header */}
      <View className="px-5 pb-3 pt-4">
        <Text className="font-jakarta-bold text-2xl tracking-tighter text-neutral-900">Saved</Text>
        {!loading && (
          <Text className="mt-1 font-jakarta text-sm text-neutral-400">
            {saved.length} {saved.length === 1 ? 'property' : 'properties'} saved
          </Text>
        )}
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#171717" />
        </View>
      ) : (
        <FlatList
          data={saved}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PropertyCard
              property={item.properties}
              onUnsave={() => setSaved(prev => prev.filter(s => s.id !== item.id))}
              showSave
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-24">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-[#EAFBE3]">
                <Heart size={36} weight="regular" color="#171717" />
              </View>
              <Text className="mb-1 font-jakarta-bold text-lg text-neutral-800">
                No saved properties
              </Text>
              <Text className="px-8 text-center font-jakarta text-sm text-neutral-400">
                Tap the heart icon on any property to save it here
              </Text>
              <Pressable
                onPress={() => router.push('/(root)/(tabs)/search')}
                className="mt-6 rounded-2xl bg-[#8FE07A] px-6 py-3 active:opacity-80"
              >
                <Text className="font-jakarta-semibold text-neutral-900">Browse Properties</Text>
              </Pressable>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
