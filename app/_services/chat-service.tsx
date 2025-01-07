/* eslint-disable no-console */
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../_utils/firebase';
import { Chat, ChatToEdit } from '../_utils/schema';

export async function dbGetAllChats(id: string) {
  try {
    const allChatReference = collection(db, 'chats');
    const allChatQuery = query(allChatReference, where('employeeId', '==', id));
    const querySnapshot = await getDocs(allChatQuery);
    const chatList: Chat[] = [];
    querySnapshot.forEach((doc: any) => {
      const chat = {
        chatId: doc.id,
        ...doc.data(),
      };
      chatList.push(chat);
    });

    chatList.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });

    return chatList;
  } catch (error) {
    return console.log(error);
  }
}

export async function dbAddChat(chatObj: ChatToEdit) {
  try {
    const newEmployeeReference = collection(db, 'chats');

    await addDoc(newEmployeeReference, chatObj);
  } catch (error) {
    return console.log(error);
  }
}
