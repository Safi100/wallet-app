import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";

export const useTransaction = () => {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    expenses: 0,
    income: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Handle token expiration and redirect to sign in
  const handleTokenExpired = useCallback(async () => {
    console.log("🔐 Token expired - logging out...");
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    router.replace("(auth)/sign-in");
  }, [router]);

  const fetchTransactions = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/transaction`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTransactions(response.data);

      setIsLoading(false);
    } catch (err) {
      const errorMsg = err.response?.data || err.message;
      console.log("Error fetching transactions:", errorMsg);

      // Check if token is invalid or expired
      if (
        err.response?.status === 401 ||
        errorMsg.toString().includes("Invalid or expired token")
      ) {
        handleTokenExpired();
      }
    }
  }, [handleTokenExpired]);
  const fetchSummary = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/transaction/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSummary({
        balance: response.data.balance,
        expenses: response.data.expenses,
        income: response.data.income,
      });
      setIsLoading(false);
    } catch (err) {
      const errorMsg = err.response?.data || err.message;
      console.log("Error fetching summary:", errorMsg);
      setIsLoading(false);

      // Check if token is invalid or expired
      if (
        err.response?.status === 401 ||
        errorMsg.toString().includes("Invalid or expired token")
      ) {
        handleTokenExpired();
      }
    }
  }, [handleTokenExpired]);

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
      const response = await axios.delete(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/transaction/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Get the deleted transaction from response
      const deletedTransaction = response.data.transaction;

      // Update transactions list by removing the deleted transaction
      setTransactions((prevTransactions) => {
        return prevTransactions
          .map((group) => ({
            ...group,
            transactions: group.transactions.filter((tx) => tx._id !== id),
          }))
          .filter((group) => group.transactions.length > 0);
      });

      // Update summary based on deleted transaction type and amount
      setSummary((prevSummary) => {
        const newBalance = prevSummary.balance - deletedTransaction.amount;
        const newIncome =
          deletedTransaction.type === "income"
            ? prevSummary.income - deletedTransaction.amount
            : prevSummary.income;
        const newExpenses =
          deletedTransaction.type === "expenses"
            ? prevSummary.expenses - deletedTransaction.amount
            : prevSummary.expenses;

        return {
          balance: newBalance,
          income: newIncome,
          expenses: newExpenses,
        };
      });

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
