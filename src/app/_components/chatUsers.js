import React, { useEffect } from 'react';
import { useUsersStore } from '../zustand/useUsersStore';
import { useAuthStore } from '../zustand/useAuthStore';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useChatMsgsStore } from '../zustand/useChatMsgsStore';
import toast from 'react-hot-toast';

const ChatUsers = ({ onlineList = [] }) => {
  const { users } = useUsersStore();
  const { authDetails } = useAuthStore();
  const authName = authDetails?.displayName;
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

        const data = await res.json();
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

  // helper: determine online boolean from onlineList (case-sensitive match on displayName)
  const isOnline = (displayName) => {
    if (!Array.isArray(onlineList)) return false;
    return onlineList.includes(displayName);
  };

  return (
    <div className="space-y-2">
      {users?.map((user, index) => {
        const name = user.displayName ?? `User ${index + 1}`;
        const online = isOnline(name);
        const selected = chatReceiver === name;

        return (
          <button
            key={user.id ?? name}
            onClick={() => setChatReceiver(user)}
            className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-shadow
              ${selected ? 'ring-2 ring-blue-300 bg-blue-50' : 'bg-white hover:shadow-sm'}
            `}
            aria-pressed={selected}
          >
            {/* Avatar */}
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-400 text-white font-semibold">
              {name.charAt(0).toUpperCase()}
            </div>

            {/* Name and status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="truncate font-medium text-sm">{name}</div>
                {/* Online indicator dot */}
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden
                    className={`inline-block h-2.5 w-2.5 rounded-full ${online ? 'bg-green-500' : 'bg-gray-300'}`}
                    title={online ? 'Online' : 'Offline'}
                  />
                </div>
              </div>

              <div className="text-xs text-gray-500 truncate">
                {name === authName ? 'You' : online ? 'Active now' : 'Offline'}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default ChatUsers;
