/* eslint-disable no-console */
'use client';

import { useEffect, useState } from 'react';
import { Roboto } from 'next/font/google';
import { Button, TextInput } from '@mantine/core';
import { useInventory } from '../../app/_utils/inventory-context';
import { Chat, defaultMessage } from '../../app/_utils/schema';
import { addChats, fetchChats, queryAssistant } from '../../app/_utils/utility';
import classnames from './ChatAssistant.module.css';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
});

export default function ChatAssistant() {
  const [chat, setChat] = useState('');
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [messageKey, setMessageKey] = useState(0);
  const [animate, setAnimate] = useState<boolean>(false);
  const [assistantResponse, setAssistantResponse] = useState('');
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const { inventory, setRefresh, currentEmployee, supplierList } = useInventory();

  const handleChat = (newTxt: string) => setChat(newTxt);

  // Send message to AI when button is clicked
  const handleSendMessage = async () => {
    // Create new chat message body with the required attributes
    if (inventory && chat) {
      const newAssistantQuery = {
        messages: [
          {
            role: 'user',
            content: `${defaultMessage} \n ${JSON.stringify(inventory)} \n ${JSON.stringify(supplierList)} \n ${chat}`,
          },
        ],
        model: 'gpt-4o',
        temperature: 0.5,
      };

      try {
        if (currentEmployee) {
          await addChats(currentEmployee.employeeId, chat, 'employee');
          setChat('');
          setMessageKey((prev) => prev + 1);
          setAnimate(true)
          // Show loading ducks
          setShowLoading(true);
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
            setShowLoading(false);
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
    if (chatHistory.length && !initialLoadComplete) {
      setInitialLoadComplete(true);
    }
  }, [chatHistory, initialLoadComplete]);

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
    whiteSpace: 'pre-wrap',
  };

  const assistantChatStyle = {
    width: 'max-content',
    maxWidth: '50%',
    margin: 5,
    padding: 10,
    backgroundColor: '#e8f4f9',
    color: '#000',
    borderRadius: 8,
    whiteSpace: 'pre-wrap',
  };

  const mappedChats = chatHistory.map((chat, index) => {
    const isNewMessage = index === chatHistory.length - 1;
    const chatClass = isNewMessage && initialLoadComplete && animate
      ? `${classnames.animate}`
      : ''
    return (
      <div
        key={index}
        style={{
          display: 'flex',
          flexDirection: chat.type === 'employee' ? 'row-reverse' : 'row',
          width: '100%',
          alignSelf: 'flex-end',
        }}
        className={chatClass}
      >
        <pre
          style={chat.type === 'employee' ? employeeChatStyle : assistantChatStyle}
          className={roboto.className}
        >
          {chat.message}
        </pre>
      </div>
    );
  });

  return (
    <main>
      <section
        id="chat-container"
        style={{
          flexDirection: 'column',
          height: '85vh',
          marginBottom: 20,
          overflowY: 'scroll',
          scrollbarWidth: 'none',
        }}
      >
        {mappedChats}
        {showLoading && (
          <section className={classnames.duckSection}>
            <img src="/assets/loading/duck1.gif" alt="Loading..." />
            <img src="/assets/loading/duck1.gif" alt="Loading..." />
            <img src="/assets/loading/duck1.gif" alt="Loading..." />
          </section>
        )}
      </section>
      <section>
        <TextInput
          style={{ paddingBottom: 10 }}
          placeholder="Enter message"
          value={chat}
          onChange={(event) => handleChat(event.target.value)}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </section>
    </main>
  );
}
