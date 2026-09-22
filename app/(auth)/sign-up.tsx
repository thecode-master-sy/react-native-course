import { useAuth, useSignUp } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      className="mb-8 h-11 w-11 items-center justify-center rounded-full bg-[#f5f5f5] active:bg-[#ececec]"
    >
      <Ionicons name="arrow-back" size={22} color="#171717" />
    </Pressable>
  );
}

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const [passwordFocused, setPasswordFocused] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState('');

  const isLoading = fetchStatus === 'fetching';

  const goToWelcome = () => router.replace('/');

  const onSignUpPress = async () => {
    const { error } = await signUp.password({
      emailAddress: email,
      password,
    });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    await signUp.verifications.sendEmailCode();
  };

  const onVerifyPress = async () => {
    await signUp.verifications.verifyEmailCode({ code });

    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            console.log(session?.currentTask);
            return;
          }
          const url = decorateUrl('/');
          router.replace(url as any);
        },
      });
    } else {
      console.error('Sign-up attempt not complete:', signUp);
    }
  };

  if (signUp.status === 'complete' || isSignedIn) {
    return null;
  }

  // OTP verification step
  if (
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0
  ) {
    return (
      <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
        <ScrollView
          className="px-6"
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back returns to the sign-up form */}
          <BackButton onPress={() => signUp.reset()} />

          <View className="flex-1 justify-center pb-16">
            <Text className="mb-2 text-center font-jakarta-bold text-[26px] tracking-tight text-neutral-900">
              Verify your email
            </Text>
            <Text className="mb-8 text-center font-jakarta text-sm leading-5 text-neutral-500">
              We sent a code to {email}
            </Text>

            <TextInput
              className="h-[52px] w-full rounded-xl bg-[#f5f5f5] px-6 font-jakarta text-[14px] text-neutral-900"
              placeholder="Verification code"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
            />
            {errors.fields.code && (
              <Text className="mt-2 px-2 font-jakarta text-xs text-red-500">
                {errors.fields.code.message}
              </Text>
            )}

            <Pressable
              onPress={onVerifyPress}
              disabled={isLoading}
              className="mt-6 h-[52px] w-full flex-row items-center justify-center rounded-full bg-[#8FE07A] active:opacity-80"
            >
              {isLoading ? (
                <ActivityIndicator color="#171717" />
              ) : (
                <Text className="font-jakarta-medium text-[14px] text-neutral-900">Verify</Text>
              )}
            </Pressable>

            <View className="mt-6 items-center gap-3">
              <Pressable onPress={() => signUp.verifications.sendEmailCode()}>
                <Text className="font-jakarta-medium text-sm text-neutral-900">
                  I need a new code
                </Text>
              </Pressable>
              <Pressable onPress={() => signUp.reset()}>
                <Text className="font-jakarta text-neutral-500">Go back</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Sign-up form
  return (
    <KeyboardAvoidingView behavior="padding" className="flex-1 bg-white">
      <ScrollView
        className="px-6"
        contentContainerStyle={{
          flexGrow: 1,

          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton onPress={goToWelcome} />

        <View className="flex-1 items-center justify-center">
          <Text className="mb-2 font-jakarta-bold text-[22px] text-center tracking-tight text-neutral-900">
            Create account
          </Text>
          <Text className="mb-8 text-center max-w-[260px] font-jakarta text-sm leading-5 text-neutral-500">
            Where comfort meets location, find your future home.
          </Text>

          <TextInput
            className="h-[52px] w-full focus:border focus:border-[#8FE07A] rounded-xl bg-[#f5f5f5] px-6 font-jakarta text-[14px] text-neutral-900 transition-colors"
            placeholder="Email address"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {errors.fields.emailAddress && (
            <Text className="mt-2 px-2 font-jakarta text-sm text-center text-red-500">
              {errors.fields.emailAddress.message}
            </Text>
          )}

          <View
            className={`mt-3 h-[52px] w-full flex-row items-center transition-colors rounded-xl border bg-[#f5f5f5] pl-6 pr-4 ${
              passwordFocused ? 'border-[#8FE07A]' : 'border-transparent'
            }`}
          >
            <TextInput
              className="flex-1 font-jakarta text-[14px] text-neutral-900"
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <Pressable onPress={() => setShowPassword(v => !v)} hitSlop={8}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color="#737373"
              />
            </Pressable>
          </View>
          {errors.fields.password && (
            <Text className="mt-2 px-2 font-jakarta text-xs text-red-500">
              {errors.fields.password.message}
            </Text>
          )}

          <Pressable
            onPress={onSignUpPress}
            disabled={isLoading}
            className="mt-6 h-[52px] w-full flex-row items-center justify-center rounded-full bg-[#8FE07A] active:opacity-80"
          >
            {isLoading ? (
              <ActivityIndicator color="#171717" />
            ) : (
              <Text className="font-jakarta-medium text-[14px] text-neutral-900">Continue</Text>
            )}
          </Pressable>
          <View className="flex-row items-center justify-center mt-4">
            <Text className="font-jakarta text-sm text-neutral-500">Already have an account? </Text>
            <Link href="/sign-in" replace>
              <Text className="font-jakarta-medium text-sm text-neutral-900">Log In</Text>
            </Link>
          </View>
        </View>

        <View nativeID="clerk-captcha" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
