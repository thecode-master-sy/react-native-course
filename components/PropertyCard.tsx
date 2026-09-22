import { useSavedProperty } from '@/hooks/useSavedProperty';
import { formatPrice } from '@/lib/utils';
import { Property } from '@/types';
import { useRouter } from 'expo-router';
import { ArrowsOutSimple, Bed, ChatCircleDots, Heart, MapPin } from 'phosphor-react-native';
import { Image, Pressable, Text, View } from 'react-native';

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row items-center gap-1.5 rounded-full bg-[#f5f5f5] px-3 py-1.5">
      {children}
    </View>
  );
}

export default function PropertyCard({
  property,
  onUnsave,
  onContact,
  showSave = false,
}: {
  property: Property;
  onUnsave?: () => void;
  onContact?: () => void; // optional; defaults to opening the property page
  showSave?: boolean;
}) {
  const router = useRouter();
  const { isSaved, saveLoading, toggleSave } = useSavedProperty(property.id, onUnsave);

  const openProperty = () => router.push(`/(root)/property/${property.id}`);

  return (
    <Pressable
      onPress={openProperty}
      className="mb-4 rounded-[28px] border border-neutral-100 bg-white p-2"
      style={{
        opacity: property.is_sold ? 0.6 : 1,
      }}
    >
      {/* Image with badge + save button */}
      <View>
        <Image
          source={{ uri: property.images[0] }}
          className="h-64 w-full rounded-[22px] bg-neutral-200"
          resizeMode="cover"
        />

        {property.is_sold && (
          <View className="absolute left-3 top-3 rounded-full bg-white/80 px-3 py-1.5">
            <Text className="font-jakarta-medium text-xs text-neutral-800">Sold</Text>
          </View>
        )}

        {showSave && (
          <Pressable
            onPress={toggleSave}
            disabled={saveLoading}
            hitSlop={6}
            className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-white/80"
          >
            <Heart
              size={18}
              weight={isSaved ? 'fill' : 'regular'}
              color={isSaved ? '#EF4444' : '#171717'}
            />
          </Pressable>
        )}
      </View>

      {/* Details */}
      <View className="px-2 pb-2 pt-3">
        <View className="flex-row items-center justify-between gap-3">
          <Text
            className="flex-1 font-jakarta-semibold text-xl tracking-tight text-neutral-900"
            numberOfLines={1}
          >
            {property.title}
          </Text>
        </View>

        {/* Info chips */}
        <View className="mt-3 flex-row flex-wrap gap-2">
          <Chip>
            <Bed size={14} weight="regular" color="#737373" />
            <Text className="font-jakarta text-xs text-neutral-600">{property.bedrooms} Bed</Text>
          </Chip>
          <Chip>
            <ArrowsOutSimple size={14} weight="regular" color="#737373" />
            <Text className="font-jakarta text-xs text-neutral-600">{property.area_sqft} Sqft</Text>
          </Chip>
          <Chip>
            <MapPin size={14} weight="regular" color="#737373" />
            <Text className="font-jakarta text-xs text-neutral-600">{property.city}</Text>
          </Chip>
        </View>

        <Text className="mt-3 font-jakarta-bold text-2xl tracking-tighter text-neutral-900">
          {formatPrice(property.price)}
        </Text>
      </View>
    </Pressable>
  );
}
