import { useSavedProperty } from '@/hooks/useSavedProperty';
import { useSupabase } from '@/hooks/useSupabase';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { useUserStore } from '@/store/userStore';
import { Property } from '@/types';
import { useAuth } from '@clerk/expo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ArrowLeft,
  ArrowsOutSimple,
  Bathtub,
  Bed,
  CheckCircle,
  Heart,
  House,
  MapPin,
  Trash,
  WhatsappLogo,
} from 'phosphor-react-native';
import ImageViewing from 'react-native-image-viewing';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');
const ADMIN_PHONE = '919999999999'; // replace with your WhatsApp number

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const router = useRouter();
  const isAdmin = useUserStore(state => state.isAdmin);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);

  const { isSaved, saveLoading, toggleSave } = useSavedProperty(id ?? '');
  const authSupabase = useSupabase();

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    const { data } = await supabase.from('properties').select('*').eq('id', id).single();
    setProperty(data);
    setLoading(false);
  };

  const handleDelete = () => {
    Alert.alert('Delete Property', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await authSupabase.from('properties').delete().eq('id', id);
          router.replace('/(root)/(tabs)');
        },
      },
    ]);
  };

  const handleMarkSold = () => {
    Alert.alert('Mark as Sold', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Mark Sold',
        onPress: async () => {
          await authSupabase.from('properties').update({ is_sold: true }).eq('id', id);
          setProperty(prev => (prev ? { ...prev, is_sold: true } : prev));
        },
      },
    ]);
  };

  const handleContact = () => {
    const message = `Hi! I'm interested in the property: ${property?.title}`;
    const url = `https://wa.me/${ADMIN_PHONE}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#171717" />
      </View>
    );
  }

  if (!property) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="font-jakarta text-neutral-500">Property not found</Text>
      </View>
    );
  }

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${
    property.longitude - 0.003
  }%2C${property.latitude - 0.003}%2C${property.longitude + 0.003}%2C${
    property.latitude + 0.003
  }&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`;

  const isLongDesc = (property.description?.length ?? 0) > 150;
  const displayDesc =
    expanded || !isLongDesc ? property.description : property.description?.slice(0, 150) + '...';

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View>
          <View style={{ opacity: property.is_sold ? 0.5 : 1 }}>
            <FlatList
              data={property.images}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({ item }) => (
                <Pressable onPress={() => setImageViewerVisible(true)}>
                  <Image source={{ uri: item }} style={{ width, height: 300 }} resizeMode="cover" />
                </Pressable>
              )}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={16}
            />
          </View>

          {/* Image count badge */}
          <View className="absolute bottom-3 right-4 rounded-full bg-black/50 px-3 py-1">
            <Text className="font-jakarta-medium text-xs text-white">
              {activeIndex + 1}/{property.images.length}
            </Text>
          </View>

          {/* Dot indicators */}
          {property.images.length > 1 && (
            <View className="absolute bottom-3 left-0 right-0 flex-row justify-center gap-1">
              {property.images.map((_, i) => (
                <View
                  key={i}
                  className={`h-1.5 rounded-full ${
                    i === activeIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                />
              ))}
            </View>
          )}

          {/* Back + Save buttons */}
          <SafeAreaView className="absolute left-0 right-0 top-0">
            <View className="flex-row items-center justify-between px-4 pt-2">
              <Pressable
                onPress={() => router.back()}
                className="h-10 w-10 items-center justify-center rounded-full bg-white"
                style={{ elevation: 3 }}
              >
                <ArrowLeft size={20} weight="regular" color="#171717" />
              </Pressable>
              <Pressable
                onPress={toggleSave}
                disabled={saveLoading}
                className="h-10 w-10 items-center justify-center rounded-full bg-white"
                style={{ elevation: 3 }}
              >
                <Heart
                  size={20}
                  weight={isSaved ? 'fill' : 'regular'}
                  color={isSaved ? '#EF4444' : '#171717'}
                />
              </Pressable>
            </View>
          </SafeAreaView>
        </View>

        {/* Content */}
        <View className="px-5 pb-8 pt-5" style={{ opacity: property.is_sold ? 0.6 : 1 }}>
          {/* Badges */}
          <View className="mb-3 flex-row flex-wrap gap-2">
            <View className="rounded-full bg-[#EAFBE3] px-3 py-1">
              <Text className="font-jakarta-semibold text-xs capitalize text-neutral-900">
                {property.type}
              </Text>
            </View>
            {property.is_featured && (
              <View className="rounded-full bg-amber-50 px-3 py-1">
                <Text className="font-jakarta-semibold text-xs text-amber-600">⭐ Featured</Text>
              </View>
            )}
            {property.is_sold && (
              <View className="rounded-full bg-red-50 px-3 py-1">
                <Text className="font-jakarta-semibold text-xs text-red-500">Sold</Text>
              </View>
            )}
          </View>

          {/* Title + Price */}
          <Text className="mb-1 font-jakarta-bold text-2xl text-neutral-900">{property.title}</Text>
          <Text className="mb-4 font-jakarta-bold text-xl tracking-tight text-neutral-900">
            {formatPrice(property.price)}
          </Text>

          {/* Specs Row */}
          <View className="mb-5 flex-row justify-between rounded-2xl bg-[#f5f5f5] p-4">
            <SpecItem icon={Bed} label="Beds" value={`${property.bedrooms}`} />
            <SpecItem icon={Bathtub} label="Baths" value={`${property.bathrooms}`} />
            <SpecItem icon={ArrowsOutSimple} label="Area" value={`${property.area_sqft} ft²`} />
            <SpecItem icon={House} label="Type" value={property.type} />
          </View>

          {/* Description */}
          <Text className="mb-2 font-jakarta-bold text-base text-neutral-900">Description</Text>
          <Text className="mb-1 font-jakarta text-sm leading-6 text-neutral-500">
            {displayDesc}
          </Text>
          {isLongDesc && (
            <Pressable onPress={() => setExpanded(!expanded)}>
              <Text className="mb-5 font-jakarta-medium text-sm text-neutral-900">
                {expanded ? 'Show less' : 'Read more'}
              </Text>
            </Pressable>
          )}

          <View className="mb-5" />

          {/* Location */}
          <Text className="mb-2 font-jakarta-bold text-base text-neutral-900">Location</Text>
          <View className="mb-4 flex-row items-center gap-2">
            <MapPin size={16} weight="regular" color="#737373" />
            <Text className="flex-1 font-jakarta text-sm text-neutral-500">
              {property.address}, {property.city}
            </Text>
          </View>

          {/* Contact Button */}
          <Pressable
            onPress={handleContact}
            className="mb-4 flex-row items-center justify-center gap-2 rounded-2xl bg-[#8FE07A] py-4 active:opacity-80"
          >
            <WhatsappLogo size={20} weight="fill" color="#171717" />
            <Text className="font-jakarta-semibold text-base text-neutral-900">Contact Agent</Text>
          </Pressable>

          {/* Admin Actions */}
          {isAdmin && (
            <View className="flex-row gap-3">
              {!property.is_sold && (
                <Pressable
                  onPress={handleMarkSold}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-amber-50 py-4"
                >
                  <CheckCircle size={18} weight="regular" color="#D97706" />
                  <Text className="font-jakarta-semibold text-amber-600">Mark Sold</Text>
                </Pressable>
              )}
              <Pressable
                onPress={handleDelete}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-red-50 py-4"
              >
                <Trash size={18} weight="regular" color="#EF4444" />
                <Text className="font-jakarta-semibold text-red-500">Delete</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Image Viewer */}
      <ImageViewing
        images={property.images.map(uri => ({ uri }))}
        imageIndex={activeIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
      />
    </View>
  );
}

function SpecItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; weight?: any; color?: string }>;
  label: string;
  value: string;
}) {
  return (
    <View className="items-center gap-1">
      <Icon size={20} weight="regular" color="#171717" />
      <Text className="font-jakarta-bold text-sm text-neutral-900">{value}</Text>
      <Text className="font-jakarta text-xs text-neutral-400">{label}</Text>
    </View>
  );
}
