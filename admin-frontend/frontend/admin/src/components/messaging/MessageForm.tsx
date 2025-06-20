import React, { useState, useRef, FormEvent } from "react";
import "./MessageForm.css";
import { sendMessage } from "../../services/sendMessage";
import "../StyleСhooseButtons.css";
import { useNavigate } from "react-router";

interface TelegramMessageFormProps {}

const MessageForm: React.FC<TelegramMessageFormProps> = () => {
  const [message, setMessage] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Добавляем проверку на файл
    if (!message.trim() || !selectedFile) {
      setError("Пожалуйста, заполните все обязательные поля");
      return;
    }

    try {
      setIsLoading(true);
      // Теперь selectedFile гарантированно существует
      const response = await sendMessage.send(message, selectedFile!);

      if (!response.ok) throw new Error("Ошибка сервера");

      setSuccess(true);
      setMessage("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      if (err.response?.status === 403) {
        navigate("/login");
        return; // Выходим, чтобы не обновлять состояние ошибки
      }
      setError("Ошибка при отправке сообщения. Попробуйте снова.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="telegram-form-container">
      <h2>Рассылка в Telegram</h2>
      <form onSubmit={handleSubmit} className="message-form">
        <div className="form-group">
          <label htmlFor="message">Текст сообщения:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="file">Прикрепить файл:</label>
          <input
            type="file"
            id="file"
            ref={fileInputRef}
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && (
          <div className="success-message">Сообщение успешно отправлено!</div>
        )}

        <button
          type="submit"
          className="left-aligned-button active-button"
          disabled={isLoading}
        >
          {isLoading ? "Отправка..." : "Отправить"}
        </button>
      </form>
    </div>
  );
};

export default MessageForm;
