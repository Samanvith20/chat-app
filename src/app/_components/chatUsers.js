import React, { useEffect } from 'react'


import { useUsersStore } from '../zustand/useUsersStore';
import { useAuthStore } from '../zustand/useAuthStore';

const ChatUsers = () => {
    const {users} = useUsersStore();
    const{authName}=useAuthStore()
    
    // const { chatReceiver, updateChatReceiver} = useChatReceiverStore();
    // const { updateChatMsgs} = useChatMsgsStore();
        console.log("users",users)
   



    // const setChatReceiver = (user) => {
    //     updateChatReceiver(user.username);
    //   }    
      
    //   useEffect(() => {
    //     const getMsgs = async () => {
    //         console.log('getting msgs------------');
    //         const res = await axios.get('http://localhost:8080/msgs',
    //             {
    //                 params: {
    //                     'sender': authName,
    //                     'receiver': chatReceiver
    //                 }
    //             },
    //             {
    //                 withCredentials: true
    //             });
    //         if (res.data.length !== 0) {
    //             updateChatMsgs(res.data);
    //         } else {
    //             updateChatMsgs([]);
    //         }
    //     }
    //     if(chatReceiver) {
    //         getMsgs();
    //    }
    // }, [chatReceiver]) 

    return (
        <div>
          {
  users?.map((user, index) => {
    return (
      <div key={index} className='bg-blue-300 rounded-xl m-3 p-5'>
        {user.displayName}
      </div>
    );
  })
}

        </div>
    )
}
export default ChatUsers