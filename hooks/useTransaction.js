import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export const useTransaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    expenses: 0,
    income: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/transaction`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(response.data);

      setIsLoading(false);
    } catch (err) {
      console.log("Error fetching transactions:", err);
    }
  }, []);
  const fetchSummary = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/transaction/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSummary({
        balance: response.data.balance,
        expenses: response.data.expenses,
        income: response.data.income,
      });
      setIsLoading(false);
    } catch (err) {
      console.log("Error fetching summary:", err);
      setIsLoading(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (err) {
      console.log("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary]);

  const deleteTransaction = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/transaction/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await loadData();
      Alert.alert("Success", "Transaction deleted successfully!");
    } catch (err) {
      Alert.alert("Error", "Failed to delete transaction");
      console.log("Error deleting transaction:", err);
    }
  };
  return {
    transactions,
    summary,
    isLoading,
    loadData,
    deleteTransaction,
  };
};
