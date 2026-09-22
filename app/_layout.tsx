import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Slot } from "expo-router";
import { useEffect } from "react"; // added
import * as SplashScreen from "expo-splash-screen"; // added
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans"; // added
import "../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

// 1. Keep the splash screen up until fonts are ready (module level)
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // 2. Load the fonts
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  // 3. Hide the splash once fonts are loaded (or failed)
  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Slot />
    </ClerkProvider>
  );
}
