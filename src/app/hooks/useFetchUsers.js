
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllUsers } from "../utils/firebaseAuth";
import { useUsersStore } from "../zustand/useUsersStore";


export const useFetchUsers = () => {
  const { updateUsers } = useUsersStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersList = await getAllUsers();
        updateUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [updateUsers]);

  return { loading };
};
