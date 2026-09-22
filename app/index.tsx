import { Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";
import WelcomeScreen from "@/components/WelcomeScreen";

export default function Index() {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null;

  if (isSignedIn) return <Redirect href="/(root)/(tabs)" />;

  return <WelcomeScreen />;
}
