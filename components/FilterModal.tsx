import { formatPrice } from '@/lib/utils';
import { PropertyType, useFilterStore } from '@/store/filterStore';
import { X } from 'phosphor-react-native';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

const TYPES: { label: string; value: PropertyType }[] = [
  { label: 'All', value: null },
  { label: 'Apartment', value: 'apartment' },
  { label: 'House', value: 'house' },
  { label: 'Villa', value: 'villa' },
  { label: 'Studio', value: 'studio' },
];

const BEDS = [
  { label: 'Any', value: null },
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4+', value: 4 },
];

const PRICE_PRESETS = [
  { min: null, max: 5_000_000 },
  { min: 5_000_000, max: 20_000_000 },
  { min: 20_000_000, max: 100_000_000 },
  { min: 100_000_000, max: null },
] as const;

const presetLabel = (min: number | null, max: number | null) => {
  if (min === null) return `Under ${formatPrice(max!)}`;
  if (max === null) return `Above ${formatPrice(min)}`;
  return `${formatPrice(min)} – ${formatPrice(max)}`;
};

const chip = (active: boolean) => `rounded-full px-4 py-2 ${active ? 'bg-[#8FE07A]' : 'bg-white'}`;

const chipText = (active: boolean) =>
  `font-jakarta-medium text-sm ${active ? 'text-neutral-900' : 'text-neutral-500'}`;

export default function FilterModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const {
    type,
    bedrooms,
    minPrice,
    maxPrice,
    setType,
    setBedrooms,
    setMinPrice,
    setMaxPrice,
    resetFilters,
  } = useFilterStore();

  const [localMin, setLocalMin] = useState(minPrice ? String(minPrice) : '');
  const [localMax, setLocalMax] = useState(maxPrice ? String(maxPrice) : '');

  const activeCount = [type, bedrooms, minPrice, maxPrice].filter(v => v !== null).length;

  const handleApply = () => {
    setMinPrice(localMin ? Number(localMin) : null);
    setMaxPrice(localMax ? Number(localMax) : null);
    onClose();
  };

  const handleReset = () => {
    setLocalMin('');
    setLocalMax('');
    resetFilters();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-[#f5f5f5]">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-neutral-100 bg-white px-5 pb-4 pt-6">
          <Pressable onPress={onClose} hitSlop={8} className="p-1">
            <X size={22} weight="regular" color="#171717" />
          </Pressable>
          <Text className="font-jakarta-bold text-lg text-neutral-900">Filters</Text>
          <Pressable onPress={handleReset} hitSlop={8}>
            <Text className="font-jakarta-semibold text-sm text-neutral-900">Reset</Text>
          </Pressable>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Property Type */}
          <Text className="mb-3 font-jakarta-bold text-base text-neutral-900">Property Type</Text>
          <View className="mb-6 flex-row flex-wrap gap-2">
            {TYPES.map(item => (
              <Pressable
                key={String(item.value)}
                onPress={() => setType(item.value)}
                className={chip(type === item.value)}
              >
                <Text className={chipText(type === item.value)}>{item.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Bedrooms */}
          <Text className="mb-3 font-jakarta-bold text-base text-neutral-900">Bedrooms</Text>
          <View className="mb-6 flex-row gap-2">
            {BEDS.map(item => {
              const active = bedrooms === item.value;
              return (
                <Pressable
                  key={String(item.value)}
                  onPress={() => setBedrooms(item.value)}
                  className={`flex-1 items-center rounded-2xl py-3 ${
                    active ? 'bg-[#8FE07A]' : 'bg-white'
                  }`}
                >
                  <Text
                    className={`font-jakarta-semibold text-sm ${
                      active ? 'text-neutral-900' : 'text-neutral-500'
                    }`}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Price Range */}
          <Text className="mb-3 font-jakarta-bold text-base text-neutral-900">Price Range (₦)</Text>
          <View className="mb-3 flex-row gap-3">
            {[
              {
                label: 'Min Price',
                value: localMin,
                onChange: setLocalMin,
                placeholder: '0',
              },
              {
                label: 'Max Price',
                value: localMax,
                onChange: setLocalMax,
                placeholder: 'Any',
              },
            ].map(({ label, value, onChange, placeholder }) => (
              <View key={label} className="flex-1">
                <Text className="mb-1.5 font-jakarta-medium text-xs text-neutral-500">{label}</Text>
                <View className="h-[52px] flex-row items-center rounded-2xl bg-white px-4">
                  <Text className="mr-1 font-jakarta text-sm text-neutral-400">₦</Text>
                  <TextInput
                    className="flex-1 font-jakarta text-[14px] text-neutral-900"
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Price Presets */}
          <View className="flex-row flex-wrap gap-2">
            {PRICE_PRESETS.map(p => {
              const active = minPrice === p.min && maxPrice === p.max;
              return (
                <Pressable
                  key={presetLabel(p.min, p.max)}
                  onPress={() => {
                    setLocalMin(p.min ? String(p.min) : '');
                    setLocalMax(p.max ? String(p.max) : '');
                    setMinPrice(p.min);
                    setMaxPrice(p.max);
                  }}
                  className={`rounded-full px-3 py-1.5 ${active ? 'bg-[#EAFBE3]' : 'bg-white'}`}
                >
                  <Text
                    className={`font-jakarta-medium text-xs ${
                      active ? 'text-neutral-900' : 'text-neutral-500'
                    }`}
                  >
                    {presetLabel(p.min, p.max)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View className="border-t border-neutral-100 bg-white px-5 pb-8 pt-4">
          <Pressable
            onPress={handleApply}
            className="items-center rounded-2xl bg-[#8FE07A] py-4 active:opacity-80"
          >
            <Text className="font-jakarta-semibold text-base text-neutral-900">
              Apply Filters{activeCount > 0 ? ` (${activeCount})` : ''}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
