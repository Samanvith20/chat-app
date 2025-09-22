
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllUsers } from "../utils/firebaseAuth";
import { useUsersStore } from "../zustand/useUsersStore";
import { useAuthStore } from "../zustand/useAuthStore";



export const useFetchUsers = () => {
  const { updateUsers } = useUsersStore();
  const [loading, setLoading] = useState(true);
  const{authDetails}=useAuthStore()
  console.log("authDetails", authDetails?.uid);
 

  useEffect(() => {
    const fetchUsers = async () => {
        if(!authDetails?.uid) {
          
           setLoading(false);
          return
        }
      try {
        setLoading(true);
        const usersList = await getAllUsers(authDetails.uid);
        updateUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [updateUsers, authDetails?.uid]);

  return { loading };
};
