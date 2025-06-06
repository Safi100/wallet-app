import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import PageLoader from "../../components/PageLoader";

const Layout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/sign-in");
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
};

export default Layout;
