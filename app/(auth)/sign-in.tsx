import { useSignIn } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [code, setCode] = useState("");

  const isLoading = fetchStatus === "fetching";

  const goToWelcome = () => router.replace("/");

  const finalize = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          console.log(session?.currentTask);
          return;
        }
        const url = decorateUrl("/");
        router.replace(url as any);
      },
    });
  };

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });
    if (error) {
      return;
    }

    if (signIn.status === "complete") {
      await finalize();
    } else if (signIn.status === "needs_second_factor") {
      await signIn.mfa.sendPhoneCode();
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code"
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
      }
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  const onVerifyPress = async () => {
    await signIn.mfa.verifyEmailCode({ code });

    if (signIn.status === "complete") {
      await finalize();
    } else {
      console.error("Sign-in attempt not complete:", signIn);
    }
  };

  // Verification step
  if (signIn.status === "needs_client_trust") {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        className="flex-1 bg-white"
      >
        <ScrollView
          className="px-6"
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <BackButton onPress={() => signIn.reset()} />

          <View className="flex-1 justify-center pb-16">
          <Text className="mb-2 font-jakarta-bold text-[26px] tracking-tight text-neutral-900">
            Verify your account
          </Text>
          <Text className="mb-8 font-jakarta text-sm leading-5 text-neutral-500">
            Enter the verification code we sent to your email.
          </Text>

          <TextInput
            className="h-[52px] w-full rounded-full bg-[#f5f5f5] px-6 font-jakarta text-[14px] text-neutral-900"
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
              <Text className="font-jakarta-medium text-[14px] text-neutral-900">
                Verify
              </Text>
            )}
          </Pressable>

          <View className="mt-6 items-center gap-3">
            <Pressable onPress={() => signIn.mfa.sendEmailCode()}>
              <Text className="font-jakarta-medium text-sm text-neutral-900">
                I need a new code
              </Text>
            </Pressable>
            <Pressable onPress={() => signIn.reset()}>
              <Text className="font-jakarta text-sm text-neutral-500">
                Start over
              </Text>
            </Pressable>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // Sign-in form
  return (
    <KeyboardAvoidingView
      behavior="padding"
      className="flex-1 bg-white"
    >
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

        <View className="flex-1 justify-center pb-16">
        <Text className="mb-2 font-jakarta-bold text-[26px] tracking-tight text-neutral-900">
          Welcome back
        </Text>
        <Text className="mb-8 font-jakarta text-sm leading-5 text-neutral-500">
          Log in to continue finding your future home.
        </Text>

        <TextInput
          className="h-[52px] w-full rounded-full bg-[#f5f5f5] px-6 font-jakarta text-[14px] text-neutral-900"
          placeholder="Email address"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.fields.identifier && (
          <Text className="mt-2 px-2 font-jakarta text-xs text-red-500">
            {errors.fields.identifier.message}
          </Text>
        )}

        <View className="mt-3 h-[52px] w-full flex-row items-center rounded-full bg-[#f5f5f5] pl-6 pr-4">
          <TextInput
            className="flex-1 font-jakarta text-[14px] text-neutral-900"
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
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
          onPress={onSignInPress}
          disabled={isLoading}
          className="mt-6 h-[52px] w-full flex-row items-center justify-center rounded-full bg-[#8FE07A] active:opacity-80"
        >
          {isLoading ? (
            <ActivityIndicator color="#171717" />
          ) : (
            <Text className="font-jakarta-medium text-[14px] text-neutral-900">
              Log In
            </Text>
          )}
        </Pressable>
        </View>

        <View className="flex-row items-center justify-center">
          <Text className="font-jakarta text-sm text-neutral-500">
            Don&apos;t have an account?{" "}
          </Text>
          <Link href="/sign-up" replace>
            <Text className="font-jakarta-medium text-sm text-neutral-900">
              Sign Up
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
