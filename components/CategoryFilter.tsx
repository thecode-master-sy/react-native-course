import { Pressable, ScrollView, Text } from 'react-native';

export type PropertyCategory = 'all' | 'apartment' | 'house' | 'villa' | 'studio';

const CATEGORIES: { label: string; value: PropertyCategory }[] = [
  { label: 'All', value: 'all' },
  { label: 'Apartments', value: 'apartment' },
  { label: 'Houses', value: 'house' },
  { label: 'Villas', value: 'villa' },
  { label: 'Studios', value: 'studio' },
];

export default function CategoryFilter({
  selected,
  onSelect,
}: {
  selected: PropertyCategory;
  onSelect: (value: PropertyCategory) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
    >
      {CATEGORIES.map(category => {
        const isActive = category.value === selected;
        return (
          <Pressable
            key={category.value}
            onPress={() => onSelect(category.value)}
            className={`h-14 items-center justify-center rounded-full px-7 ${
              isActive ? 'bg-[#8FE07A]' : 'bg-[white]'
            }`}
          >
            <Text
              className={`font-jakarta-medium ${
                isActive ? 'text-neutral-900' : 'text-neutral-500'
              }`}
            >
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
