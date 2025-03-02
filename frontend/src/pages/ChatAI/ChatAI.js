import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { sendChatMessage } from '../../services/chat/chat';
import { addDishToOrder } from '../../services/dishes/disheslist';
import styles from './ChatAI.module.css';
import { OrderContext } from '../../context/OrderContext';

const ChatAIPage = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateOrderCount } = useContext(OrderContext);
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
    const welcomeMessage = {
      text: 'Добро пожаловать! Задайте мне любой вопрос, и я помогу вам подобрать подходящие блюда.',
      isUser: false,
      dishes: [],
    };
    setMessages([welcomeMessage]);
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
      updateOrderCount();
    } catch (error) {
      console.error('Ошибка при добавлении блюда в заказ:', error);
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
                  {message.dishes.map((dish, dishIndex) => (
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
                          <button onClick={() => handleAddToOrder(dish.id)}
                              className={styles.addButton}>
                              Добавить в заказ
                          </button>
                          <Link to={`/item/${dish.id}`} className={styles.detailsButton}>
                            Узнать больше
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
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
          {isListening ? '◼️' : '. ♬ ݁˖'}
        </button>
      </div>
    </div>
  );
};

export default ChatAIPage;