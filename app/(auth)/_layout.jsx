import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import PageLoader from "../../components/PageLoader";

export default function AuthRoutesLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.replace("/");
      } else {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
