import React, { useState } from 'react';

import { sendChatMessage } from '../../services/chat/chat';

import styles from './ChatAI.module.css';

const ChatAIPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { text: inputText, isUser: true, dishes: [] };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');

    setIsLoading(true);

    try {
      const response = await sendChatMessage(inputText);
      const botMessage = {
        text: response.message,
        isUser: false,
        dishes: response.dishes || [],
      };

      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {

      console.error('Ошибка при отправке сообщения:', error);
      const errorMessage = { text: 'Ошибка при получении ответа', isUser: false, dishes: [] };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container_body}>
      <div className={styles.container}>
        <div className={styles.chatWindow}>
          {messages.map((message, index) => (
            <div key={index}>
              <div
                className={`${styles.message} ${message.isUser ? styles.userMessage : styles.botMessage}`}
              >
                {message.text}
              </div>

              {message.dishes && message.dishes.length > 0 && (
                <div className={styles.dishesContainer}>
                  {message.dishes.map((dish, dishIndex) => (
                    <div key={dishIndex} className={styles.dish}>
                      <h3>{dish.name}</h3>
                      <p>{dish.desc}</p>
                      <p>Цена: {dish.cost} руб.</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isLoading && <div className={styles.loading}>ЖДЕМ ОТВЕТ...</div>}
        </div>
        <div className={styles.inputContainer}>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Введите Ваш запрос..."
            className={styles.inputField}
          />
          <button onClick={handleSendMessage} className={styles.sendButton}>
            >
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAIPage;