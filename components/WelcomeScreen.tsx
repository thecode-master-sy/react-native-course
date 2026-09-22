import { View, Text, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, AntDesign, MaterialIcons, FontAwesome6 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GoogleLogo from '@/components/GoogleLogo';

const HERO = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <Image
        source={{ uri: HERO }}
        resizeMode="cover"
        className="absolute left-0 right-0 top-0 h-[62%] w-full"
      />

      <View
        className="mt-auto items-center rounded-t-[28px] bg-white px-6 pt-2.5"
        style={{ paddingBottom: insets.bottom + 12 }}
      >
        <View className="mb-6 h-1 w-9 rounded-full bg-neutral-200" />

        <Text className="mb-2 font-jakarta-bold tracking-tight text-[22px] text-neutral-900">
          Welcome to Kribb
        </Text>
        <Text className="mb-6 text-center font-jakarta text-sm leading-5 text-neutral-500">
          Where comfort meets location, find your future home.
        </Text>

        <Pressable className="mb-3 h-[52px] w-full flex-row gap-4 bg-[#f5f5f5] items-center justify-center rounded-full  active:bg-[#F2F2F2]">
          <Ionicons name="logo-apple" size={22} color="#000" />
          <Text className="font-jakarta-medium text-[14px] text-neutral-900">
            Continue with Apple
          </Text>
        </Pressable>

        <Pressable className="mb-3 h-[52px] w-full flex-row gap-4 bg-[#f5f5f5] items-center justify-center rounded-full active:bg-[#F2F2F2]">
          <View>
            <GoogleLogo />
          </View>
          <Text className="font-jakarta-medium text-[14px] text-neutral-900">
            Continue with Google
          </Text>
        </Pressable>

        <View className="my-3 w-full flex-row items-center">
          <View className="h-px flex-1 bg-neutral-200" />
          <Text className="mx-3 font-jakarta text-sm text-neutral-400">or</Text>
          <View className="h-px flex-1 bg-neutral-200" />
        </View>

        <Pressable
          onPress={() => router.push('/sign-up')}
          className="mb-[18px] h-[52px] w-full flex-row items-center justify-center rounded-full bg-[#8FE07A] active:opacity-80"
        >
          <Ionicons name="mail-outline" size={20} />
          <Text className="ml-2 font-jakarta-medium text-[14px] text-neutral-900">
            Continue with Email
          </Text>
        </Pressable>

        <Text className="font-jakarta text-sm text-neutral-500">
          Already have an account?{' '}
          <Text
            onPress={() => router.push('/sign-in')}
            className="font-jakarta-medium text-neutral-900"
          >
            Log In
          </Text>
        </Text>
      </View>
    </View>
  );
}
