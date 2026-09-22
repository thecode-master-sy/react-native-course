import { useRouter } from 'expo-router';
import { MagnifyingGlassIcon, SlidersHorizontalIcon } from 'phosphor-react-native';
import { Pressable, Text, View } from 'react-native';

export default function HomeSearchBar() {
  const router = useRouter();

  return (
    <View className="mx-5 mb-6 flex-row items-center gap-3">
      {/* Search pill */}
      <Pressable
        onPress={() => router.push('/(root)/(tabs)/search')}
        className="h-[52px] flex-1 flex-row items-center gap-3 rounded-full bg-white px-5 active:bg-[#ececec]"
      >
        <MagnifyingGlassIcon size={20} weight="regular" color="#737373" />
        <Text className="flex-1 font-jakarta text-[14px] text-neutral-400">Search...</Text>
      </Pressable>

      {/* Filter button */}
      <Pressable
        onPress={() => router.push('/(root)/(tabs)/search?openFilters=true')}
        hitSlop={6}
        className="h-[52px] w-[52px] items-center justify-center rounded-full bg-[#8FE07A] active:bg-[#ececec]"
      >
        <SlidersHorizontalIcon size={24} weight="regular" color="#171717" />
      </Pressable>
    </View>
  );
}
