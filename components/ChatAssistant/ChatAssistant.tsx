/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Button, TextInput } from '@mantine/core';
import { useInventory } from '../../app/_utils/inventory-context';
import { Chat, defaultMessage } from '../../app/_utils/schema';
import { addChats, fetchChats, queryAssistant } from '../../app/_utils/utility';

export default function ChatAssistant() {
  const [chat, setChat] = useState('');
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [messageKey, setMessageKey] = useState(0);
  const [assistantResponse, setAssistantResponse] = useState('');
  const { inventory, setRefresh, currentEmployee } = useInventory();

  const handleChat = (newTxt: string) => setChat(newTxt);

  // Send message to AI when button is clicked
  const handleSendMessage = async () => {
    // Create new chat message body with the required attributes
    if (inventory && chat) {
      const newAssistantQuery = {
        messages: [
          {
            role: 'user',
            content: `${defaultMessage} \n ${JSON.stringify(inventory)} \n ${chat}`,
          },
        ],
        model: 'gpt-4o-mini',
        temperature: 0.5,
      };

      try {
        if (currentEmployee) {
          await addChats(currentEmployee.employeeId, chat, 'employee');
          setChat('');
          setMessageKey((prev) => prev + 1);
        }
      } catch (error) {
        console.log(error);
      }

      try {
        if (currentEmployee) {
          const response = await queryAssistant(newAssistantQuery);
          if (response) {
            await addChats(currentEmployee.employeeId, response, 'assistant');
            setAssistantResponse(response);
            console.log(assistantResponse);
            setMessageKey((prev) => prev + 1);
            setAssistantResponse('');
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (currentEmployee) {
      fetchChats(currentEmployee.employeeId, setChatHistory);
    }
  }, [currentEmployee, messageKey]);

  useEffect(() => {
    setRefresh((prev: number) => prev + 1);
  }, []);

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [chatHistory]);

  const employeeChatStyle = {
    width: 'max-content',
    maxWidth: '50%',
    margin: 5,
    padding: 10,
    backgroundColor: '#1B4965',
    color: '#f2f2f2',
    borderRadius: 8,
  };

  const assistantChatStyle = {
    width: 'max-content',
    maxWidth: '50%',
    margin: 5,
    padding: 10,
    backgroundColor: '#e8f4f9',
    color: '#000',
    borderRadius: 8,
  };

  const mappedChats = chatHistory.map((chat, index) => {
    return (
      <div
        key={index}
        style={{
          display: 'flex',
          flexDirection: chat.type === 'employee' ? 'row' : 'row-reverse',
          width: '100%',
          alignSelf: 'flex-end',
        }}
      >
        <div style={chat.type === 'employee' ? employeeChatStyle : assistantChatStyle}>
          {chat.message}
        </div>
      </div>
    );
  });

  return (
    <main>
      <section
        id="chat-container"
        style={{
          flexDirection: 'column',
          width: '100%',
          height: '85vh',
          marginBottom: 20,
          overflowY: 'scroll',
        }}
      >
        {mappedChats}
      </section>
      <section>
        <TextInput
          style={{ paddingBottom: 10 }}
          placeholder="enter message"
          value={chat}
          onChange={(event) => handleChat(event.target.value)}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </section>
    </main>
  );
}
