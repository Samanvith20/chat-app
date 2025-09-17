import React, { useEffect } from 'react';
import { useUsersStore } from '../zustand/useUsersStore';
import { useAuthStore } from '../zustand/useAuthStore';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';
import toast from 'react-hot-toast';

const ChatUsers = () => {
  const { users } = useUsersStore();
  const { authDetails } = useAuthStore();
  let authName=authDetails?.displayName
  const { chatReceiver, updateChatReceiver } = useChatReceiverStore();
  const { updateChatMsgs } = useChatMsgsStore();

  const setChatReceiver = (user) => {
    updateChatReceiver(user.displayName);
  };

  useEffect(() => {
    // do not fetch if no authName (user not logged in)
    if (!authName) {
      toast.error('You are not logged in');
      updateChatMsgs([]); // clear messages
      return;
    }

    if (!chatReceiver) {
      // no receiver selected — clear messages
      updateChatMsgs([]);
      return;
    }

  

    const getMsgs = async () => {
      try {
        const params = new URLSearchParams({
          sender: authName,
          receiver: chatReceiver,
        });

        const url = `${process.env.NEXT_PUBLIC_BE_HOST?.replace(/\/$/, '') || ''}/msgs?${params.toString()}`;

        const res = await fetch(url, {
          method: 'GET',
          
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          // server returned HTTP error
          console.log('Failed to fetch messages', res.status, res.statusText);
          updateChatMsgs([]);
          return;
        }
        console.log("res", res);

        const data = await res.json();
         console.log("data", data);

        if (Array.isArray(data) && data.length !== 0) {
          updateChatMsgs(data);
        } else {
          updateChatMsgs([]);
        }
      } catch (err) {
       
        console.log('Error fetching messages', err);
        updateChatMsgs([]);
      }
    };

    getMsgs();

   
  }, [chatReceiver, authName, updateChatMsgs]);

  return (
    <div>
      {users?.map((user, index) => (
        <div
          key={user.id ?? user.displayName ?? index}
          onClick={() => setChatReceiver(user)}
          className="bg-blue-300 rounded-xl m-3 p-5 cursor-pointer"
        >
          {user.displayName}
        </div>
      ))}
    </div>
  );
};

export default ChatUsers;
