import { useAuth, useUser } from '@clerk/expo';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Bell, CaretRight, Camera, Gear, Heart, Question, SignOut } from 'phosphor-react-native';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpdateProfileImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to update your profile picture.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled) return;

      setIsUpdating(true);

      const base64Image = result.assets[0].base64;
      const uri = result.assets[0].uri;
      const filename = uri.split('/').pop() || 'profile.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const mimeType = match ? `image/${match[1]}` : 'image/jpeg';
      const dataUrl = `data:${mimeType};base64,${base64Image}`;

      await user?.setProfileImage({ file: dataUrl });

      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('Error updating profile image:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#171717" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="mb-10 flex-1 bg-white">
      {/* Avatar + Name */}
      <View className="items-center py-8">
        <View className="relative">
          <Image
            source={{ uri: user.imageUrl }}
            className="mb-4 h-24 w-24 rounded-full bg-neutral-200"
          />
          <Pressable
            onPress={handleUpdateProfileImage}
            disabled={isUpdating}
            className="absolute bottom-3 right-0 h-9 w-9 items-center justify-center rounded-full bg-[#8FE07A] active:opacity-80"
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#171717" />
            ) : (
              <Camera size={16} weight="fill" color="#171717" />
            )}
          </Pressable>
        </View>
        <Text className="font-jakarta-bold text-xl text-neutral-900">
          {user.firstName} {user.lastName}
        </Text>
        <Text className="mt-1 font-jakarta text-sm text-neutral-500">
          {user.emailAddresses[0].emailAddress}
        </Text>
      </View>

      {/* Menu Items */}
      <View className="gap-2 px-6">
        <MenuItem
          icon={Heart}
          label="Saved Properties"
          onPress={() => router.push('/(root)/(tabs)/saved')}
        />
        <MenuItem
          icon={Bell}
          label="Notifications"
          onPress={() => Alert.alert('Coming Soon', 'Notifications coming soon!')}
        />
        <MenuItem
          icon={Gear}
          label="Settings"
          onPress={() => Alert.alert('Coming Soon', 'Settings coming soon!')}
        />
        <MenuItem
          icon={Question}
          label="Help & Support"
          onPress={() =>
            Linking.openURL(
              'mailto:piyushagarwalvo@gmail.com?subject=Help%20%26%20Support%20-%20Kribb%20App'
            )
          }
        />
      </View>

      {/* Sign Out */}
      <View className="mb-8 mt-auto px-6">
        <Pressable
          onPress={handleSignOut}
          className="flex-row items-center justify-center gap-2 rounded-2xl bg-red-50 py-4 active:opacity-80"
        >
          <SignOut size={20} weight="regular" color="#EF4444" />
          <Text className="font-jakarta-semibold text-base text-red-500">Sign Out</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onPress,
}: {
  icon: React.ComponentType<{ size?: number; weight?: any; color?: string }>;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 rounded-2xl bg-[#f5f5f5] px-4 py-4 active:opacity-80"
    >
      <Icon size={22} weight="regular" color="#737373" />
      <Text className="flex-1 font-jakarta-medium text-base text-neutral-700">{label}</Text>
      <CaretRight size={18} weight="regular" color="#D1D5DB" />
    </Pressable>
  );
}
