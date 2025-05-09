import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AiTwotoneAudio } from "react-icons/ai";

import { sendChatMessage, getChatHistory } from '@/services/chat/chat';
import { addDishToOrder } from '@/services/dishes/disheslist';
import styles from '@/pages/ChatAI/ChatAI.module.css';
import { OrderContext } from '@/context/OrderContext';
import { EditOrderContext } from '@/context/EditOrderContext';


const ChatAIPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateOrderCount } = useContext(OrderContext);
  const { orderItems, updateQuantity } = useContext(EditOrderContext);
  const [isListening, setIsListening] = useState(false);

  const chatWindowRef = useRef(null);

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'ru-RU';
  recognition.interimResults = false;
  recognition.continuous = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setInputText(transcript);
    setIsListening(false);
  };

  recognition.onerror = (event) => {
    console.error('Ошибка распознавания речи:', event.error);
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getChatHistory();
        if (history.messages && history.messages.length > 0) {
//          const formattedMessages = history.messages.map((msg) => ({
//            text: str      msg.message,
//            isUser: bool   msg.sender === "client",
//            dishes: []     msg.dishes || [],
//          }));

          setMessages(history.messages);
        } else {
          setMessages([{
            text: 'Добро пожаловать! Задайте мне любой вопрос, и я помогу вам подобрать подходящие блюда.',
            isUser: false,
            dishes: [],
          }]);
        }
      } catch (error) {
        console.error('Ошибка при загрузке истории:', error);
        setMessages([{
          text: 'Добро пожаловать! Задайте мне любой вопрос, и я помогу вам подобрать подходящие блюда.',
          isUser: false,
          dishes: [],
        }]);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.backgroundColor = '#778477';
    }

    return () => {
      if (navbar) {
        navbar.style.backgroundColor = '';
      }
    };
  }, []);

  const handleAddToOrder = async (dishId) => {
    try {
      await addDishToOrder(dishId);
      updateQuantity(dishId, 1);
      updateOrderCount();
    } catch (error) {
      console.error('Ошибка при добавлении блюда в заказ:', error);
    }
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity >= 0) {
      updateQuantity(id, newQuantity);
      updateOrderCount();
    }
  };

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
        <div className={styles.chatWindow} ref={chatWindowRef}>
          {messages.map((message, index) => (
            <div key={index}>
              <div
                className={`${styles.message} ${message.isUser ? styles.userMessage : styles.botMessage}`}
              >
                {message.text}
              </div>

              {message.dishes && message.dishes.length > 0 && (
                <div className={styles.dishesContainer}>
                  {message.dishes.map((dish, dishIndex) => {
                    const orderItem = orderItems.find((item) => item.id === dish.id);
                    const quantity = orderItem ? orderItem.quantity : 0;

                    return (
                      <div key={dishIndex} className={styles.dish}>
                        <img
                          src={dish.img_link}
                          alt="dish_photo"
                          className={styles.image}
                        />
                        <div className={styles.dishInfo}>
                          <h3>{dish.name}</h3>
                          <p>Цена: {dish.cost} руб.</p>
                          <div className={styles.dishButtons}>
                            {quantity > 0 ? (
                              <div className={styles.quantitySection}>
                                <button
                                  onClick={() => handleUpdateQuantity(dish.id, quantity - 1)}
                                  className={styles.quantityButton}
                                >
                                  -
                                </button>
                                <span className={styles.quantity}>{quantity}</span>
                                <button
                                  onClick={() => handleUpdateQuantity(dish.id, quantity + 1)}
                                  className={styles.quantityButton}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => handleAddToOrder(dish.id)}
                                className={styles.addButton}
                              >
                                Добавить в заказ
                              </button>
                            )}
                            <Link to={`/item/${dish.id}`} className={styles.detailsButton}>
                              Узнать больше
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          {isLoading && <div className={styles.loading}>ЖДЕМ ОТВЕТ...</div>}
        </div>
      </div>

      <div className={styles.footer}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Введите Ваш запрос..."
          className={styles.inputField}
        />
        <button onClick={handleSendMessage} className={styles.sendButton}>
          ➤
        </button>
        <button
          onClick={toggleListening}
          className={`${styles.voiceButton} ${isListening ? styles.active : ''}`}
        >
          {isListening ? '◼️' : <AiTwotoneAudio />}
        </button>
      </div>
    </div>
  );
};

export default ChatAIPage;