import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../../assets/style/categories.styles";
import PageLoader from "../../components/PageLoader";
import { COLORS } from "../../constants/colors";

const CategoriesScreen = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/category/with-transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(response.data);
    } catch (err) {
      console.log("Error fetching categories:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };

  if (isLoading && !refreshing) {
    return <PageLoader />;
  }

  const renderCategoryCard = ({ item }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() =>
        router.push({
          pathname: "/category-details",
          params: { categoryId: item._id, categoryName: item.name },
        })
      }
    >
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.icon} size={28} color={COLORS.primary} />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryCount}>
          {item.transactionCount || 0} transaction
          {item.transactionCount !== 1 ? "s" : ""}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={categories}
        keyExtractor={(item) => item._id}
        renderItem={renderCategoryCard}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default CategoriesScreen;
