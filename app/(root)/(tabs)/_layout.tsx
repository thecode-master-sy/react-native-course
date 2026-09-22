import { useUserStore } from '@/store/userStore';
import { Ionicons } from '@expo/vector-icons';
import { TabList, Tabs, TabSlot, TabTrigger } from 'expo-router/ui';
import { forwardRef } from 'react';
import { Pressable, PressableProps, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, SparkleIcon, HeartIcon, UserCircleIcon } from 'phosphor-react-native';

const ACTIVE = '#171717'; // green icon on the white circle
const INACTIVE = '#171717';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

type TabButtonProps = PressableProps & {
  icon?: IconName;
  activeIcon?: IconName;
  renderIcon?: (focused: boolean) => React.ReactNode; // NEW
  isFocused?: boolean;
};

const TabButton = forwardRef<View, TabButtonProps>(function TabButton(
  { icon, activeIcon, renderIcon, isFocused, ...props },
  ref
) {
  return (
    <Pressable
      ref={ref}
      {...props}
      style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: isFocused ? '#8FE07A' : 'transparent',
      }}
    >
      {renderIcon ? (
        renderIcon(!!isFocused)
      ) : (
        <Ionicons
          name={isFocused ? activeIcon! : icon!}
          size={22}
          color={isFocused ? '#8FE07A' : INACTIVE}
        />
      )}
    </Pressable>
  );
});

export default function TabsLayout() {
  const isAdmin = useUserStore(state => state.isAdmin);
  const insets = useSafeAreaInsets();

  return (
    <Tabs>
      {/* Screens render here, full height, behind the floating bar */}
      <TabSlot />

      <TabList
        className="shadow-sm"
        style={{
          position: 'absolute',
          bottom: insets.bottom + 12,
          paddingVertical: 4,
          paddingHorizontal: 4,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#f5f5f5',
          alignSelf: 'center',
          borderRadius: 999,
        }}
      >
        <TabTrigger name="index" href="/(root)/(tabs)" asChild>
          <TabButton
            renderIcon={focused => (
              <House size={24} weight={'regular'} color={focused ? ACTIVE : INACTIVE} />
            )}
          />
        </TabTrigger>

        <TabTrigger name="search" href="/(root)/(tabs)/search" asChild>
          <TabButton
            renderIcon={focused => (
              <SparkleIcon size={24} weight={'regular'} color={focused ? ACTIVE : INACTIVE} />
            )}
          />
        </TabTrigger>

        {isAdmin && (
          <TabTrigger name="create" href="/(root)/(tabs)/create" asChild>
            <TabButton icon="add-circle-outline" activeIcon="add-circle" />
          </TabTrigger>
        )}

        <TabTrigger name="saved" href="/(root)/(tabs)/saved" asChild>
          <TabButton
            renderIcon={focused => (
              <HeartIcon size={24} weight={'regular'} color={focused ? ACTIVE : INACTIVE} />
            )}
          />
        </TabTrigger>

        <TabTrigger name="profile" href="/(root)/(tabs)/profile" asChild>
          <TabButton
            renderIcon={focused => (
              <UserCircleIcon size={24} weight={'regular'} color={focused ? ACTIVE : INACTIVE} />
            )}
          />
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}
