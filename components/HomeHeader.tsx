import { BellIcon, ListIcon } from 'phosphor-react-native';
import { Image, Pressable, Text, View } from 'react-native';

const AVATAR =
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

type Props = {
  name: string;
  hasUnread?: boolean;
  onNotificationPress?: () => void;
  onMenuPress?: () => void;
};

function CircleButton({ onPress, children }: { onPress?: () => void; children: React.ReactNode }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      className="h-11 w-11 items-center justify-center rounded-full bg-white active:bg-neutral-100"
    >
      {children}
    </Pressable>
  );
}

export default function HomeHeader({
  name,
  hasUnread = true,
  onNotificationPress,
  onMenuPress,
}: Props) {
  return (
    <View className="flex-row items-center justify-between px-5 pb-5 pt-4">
      {/* Avatar + greeting */}
      <View className="flex-row items-center gap-3">
        <Image source={{ uri: AVATAR }} className="h-[50px] w-[50px] rounded-full bg-neutral-200" />
        <View>
          <Text className="font-jakarta text-neutral-500">{getGreeting()}</Text>
          <Text className="font-jakarta-semibold text-neutral-900">{name}</Text>
        </View>
      </View>

      {/* Action buttons */}
      <View className="flex-row items-center gap-3">
        <CircleButton onPress={onNotificationPress}>
          <BellIcon size={24} weight="regular" color="#171717" />
          {hasUnread && (
            <View className="absolute right-[-4px] top-0 h-5 w-5  items-center justify-center rounded-full border border-white bg-[#8FE07A]">
              <Text
                className="font-jakarta-medium text-[7px] text-[#171717]"
                style={{
                  includeFontPadding: false,
                  textAlignVertical: 'center',
                  textAlign: 'center',
                }}
              >
                4
              </Text>
            </View>
          )}
        </CircleButton>

        <CircleButton onPress={onMenuPress}>
          <ListIcon size={24} weight="regular" color="#171717" />
        </CircleButton>
      </View>
    </View>
  );
}
