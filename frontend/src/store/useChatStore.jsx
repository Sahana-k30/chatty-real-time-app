import {create} from "zustand";
import toast from "react-hot-toast";
import { axiosInstance} from '../lib/axios';
import { useAuthStore } from "./useAuthStore";

export const useChatStore= create((set,get)=>({
    messages:[],
    users : [],
    selectedUser:null,
    isUsersLoading : false,
    isMsgLoading: false,

    getUsers: async()=>{
        set({isUsersLoading:true});
        try{
            const res= await axiosInstance.get("/message/user");
            set({ users: res.data.filteredUsers });

        }
        catch(err){
            toast.error("err.response.data.message");
        }
        finally{
            set({isUsersLoading:false})
        }
    },

    getMessages: async(userId)=>{
        set({isMsgLoading:true})
        try{
            const res= await axiosInstance.get(`/message/${userId}`);
            set({messages: res.data.messages});
        }catch(err){
            toast.error(err.response.data.message);
        }finally{
            set({isMsgLoading:false})
        }
    },

    //later
    setSelectedUser: (selectedUser)=> set({selectedUser}),

   sendMessages: async (messageData) => {
  const { selectedUser, messages } = get();
  if (!selectedUser?._id) {
    toast.error("No user selected");
    return;
  }

  try {
    const res = await axiosInstance.post(
      `/message/send/${selectedUser._id}`,
      messageData
    );

    console.log("API response from /message/send:", res);

    const updatedMessages = Array.isArray(messages) ? messages : [];
    set({ messages: [...updatedMessages, res.data] });

  } catch (err) {
    console.error("Error sending message:", err);
    toast.error(err.response?.data?.message || "Failed to send message");
  }
},

subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },

  unsubscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

}));