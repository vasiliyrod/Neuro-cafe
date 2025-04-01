import React, { useState, useEffect } from 'react';
import styles from '@/pages/Booking/Booking.module.css';
import Popup from 'reactjs-popup';
import Cookies from 'js-cookie';
import 'reactjs-popup/dist/index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsXLg } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';

import {
  fetchCurrentBooking,
  cancelBooking,
  fetchAvailableTables,
  createBooking
} from '@/services/booking/booking';

const BookingPage = () => {
  const [tables, setTables] = useState([]);
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [showHall, setShowHall] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [formErrors, setFormErrors] = useState({
    timeError: '',
    dateError: '',
    durationError: '',
    workingHoursError: ''
  });

  useEffect(() => {
    const userID = Cookies.get('UID');

    if (!userID) {
      navigate('/errorlog');
      return;
    }
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.backgroundColor = '#FDFAF0';
    }

    return () => {
      if (navbar) {
        navbar.style.backgroundColor = '';
      }
    };
  }, []);

  useEffect(() => {
    const loadCurrentBooking = async () => {
      try {
        const booking = await fetchCurrentBooking();
        setCurrentBooking(booking);
      } catch (error) {
        console.error('Ошибка:', error);
      }
    };

    loadCurrentBooking();
  }, []);

  const validateForm = () => {
    const errors = {
      timeError: '',
      dateError: '',
      durationError: '',
      workingHoursError: ''
    };
    let isValid = true;

    if (currentBooking) {
      toast.error('У вас уже есть активное бронирование');
      return false;
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`);
      const end = new Date(`2000-01-01T${formData.endTime}`);

      if (end <= start) {
        errors.timeError = 'Время окончания должно быть позже времени начала';
        isValid = false;
      }

      const duration = (end - start) / (1000 * 60 * 60);
      if (duration > 3) {
        errors.durationError = 'Максимальная продолжительность бронирования - 3 часа';
        isValid = false;
      }

      const startHours = start.getHours();
      const endHours = end.getHours();
      if (startHours < 9 || endHours > 22 || (endHours === 22 && end.getMinutes() > 0)) {
        errors.workingHoursError = 'Бронирование доступно только с 9:00 до 22:00';
        isValid = false;
      }
    }

    if (formData.date) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(formData.date);

      if (selectedDate < today) {
        errors.dateError = 'Нельзя выбрать прошедшую дату';
        isValid = false;
      }

      if (selectedDate.getTime() === today.getTime()) {
        const now = new Date();
        const startTime = new Date(`2000-01-01T${formData.startTime}`);
        if (startTime.getHours() < now.getHours() ||
            (startTime.getHours() === now.getHours() && startTime.getMinutes() < now.getMinutes())) {
          errors.timeError = 'Нельзя выбрать прошедшее время для сегодняшней даты';
          isValid = false;
        }
      }
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCancelBooking = async () => {
    if (!currentBooking) return;

    setIsLoading(true);
    try {
      await cancelBooking();
      const booking = await fetchCurrentBooking();
      setCurrentBooking(booking);
      toast.success('Бронирование успешно отменено!');
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error(error.message || 'Произошла ошибка при отмене бронирования');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors({
      timeError: '',
      dateError: '',
      durationError: '',
      workingHoursError: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.startTime || !formData.endTime) {
      toast.error('Пожалуйста, заполните все поля формы');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchAvailableTables(
        formData.date,
        formData.startTime,
        formData.endTime
      );
      setTables(data);
      setShowHall(true);
    } catch (error) {
      console.error('Ошибка:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedOption) {
      toast.error('Пожалуйста, выберите стол');
      return;
    }

    if (currentBooking) {
      toast.error('У вас уже есть активное бронирование');
      return;
    }

    setIsLoading(true);
    try {
      await createBooking(
        selectedOption,
        formData.date,
        formData.startTime,
        formData.endTime
      );
      const booking = await fetchCurrentBooking();
      setCurrentBooking(booking);
      setSelectedOption(null);
      setPopupOpen(false);
      setShowHall(false);
      setFormData({ date: '', startTime: '', endTime: '' });
      toast.success('Бронирование успешно завершено!');
    } catch (error) {
      console.error('Ошибка бронирования:', error);
      toast.error(error.message || 'Произошла ошибка при бронировании');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionChange = (id) => {
    const table = tables.find(t => t.id === id);
    if (table && !table.occupied && !currentBooking) {
      setSelectedOption(id);
      setPopupOpen(true);
    }
  };

  const isFormValid = formData.date && formData.startTime && formData.endTime;

  return (
    <div className={styles.container}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName={styles.toast}
      />
      <div className={styles.twoColumnLayout}>
        <div className={styles.bookingForm}>
          <h2>Форма бронирования</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="date">Дата:</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
              {formErrors.dateError && <p className={styles.errorText}>{formErrors.dateError}</p>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="startTime">Время начала:</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleInputChange}
                required
                min="09:00"
                max="22:00"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="endTime">Время окончания:</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleInputChange}
                required
                min="09:00"
                max="22:00"
              />
              {formErrors.timeError && <p className={styles.errorText}>{formErrors.timeError}</p>}
              {formErrors.durationError && <p className={styles.errorText}>{formErrors.durationError}</p>}
              {formErrors.workingHoursError && <p className={styles.errorText}>{formErrors.workingHoursError}</p>}
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isFormValid || isLoading || currentBooking}
            >
              {isLoading ? 'Загрузка...' : 'Показать доступные столы'}
            </button>
            {currentBooking && <p className={styles.errorText}>У вас уже есть активное бронирование</p>}
          </form>
        </div>

        <div className={styles.seatSelection}>
          {currentBooking && (
            <div className={styles.currentBooking}>
              <div className={styles.bookingInfo}>
                <h3>Ваше текущее бронирование</h3>
                <p><strong>Стол №:</strong> {currentBooking.table_id}</p>
                <p><strong>Дата:</strong> {currentBooking.date}</p>
                <p><strong>Время:</strong> {currentBooking.timeStart.slice(0, 5)} - {currentBooking.timeEnd.slice(0, 5)}</p>
              </div>
              <button
                className={styles.cancelButton}
                onClick={handleCancelBooking}
                disabled={isLoading}
              >
                {isLoading ? 'Отмена...' : 'Отменить бронь'}
              </button>
            </div>
          )}

          <h2>Схема зала</h2>

          {!showHall ? (
            <p>Пожалуйста, заполните форму и нажмите "Показать доступные столы"</p>
          ) : isLoading ? (
            <p>Загружаем данные...</p>
          ) : tables.length === 0 ? (
            <p>На выбранное время нет доступных столов</p>
          ) : (
            <>
              <div className={styles.tableWrapper}>
                <div className={styles.tableContainer}>
                  <img
                    src="https://i.postimg.cc/50DnGSZv/Group-14.png"
                    alt="План зала"
                    className={styles.tableImage}
                  />
                  <div className={styles.gridTable}>
                    {tables.map((table) => (
                      <div
                        key={`${table.x}-${table.y}`}
                        className={styles.tableMarker}
                        style={{
                          left: `${table.x}%`,
                          top: `${table.y}%`,
                        }}
                        onClick={() => !table.occupied && !currentBooking && handleOptionChange(table.id)}
                      >
                        <input
                          type="radio"
                          id={`option-${table.id}`}
                          name="tableSelection"
                          checked={selectedOption === table.id}
                          onChange={() => {}}
                          disabled={table.occupied || currentBooking}
                          className={styles.hiddenRadio}
                        />
                        {table.occupied && (
                          <div className={styles.occupiedMarker}>
                            <BsXLg className={styles.occupiedIcon} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Popup
                open={popupOpen && selectedOption !== null && !currentBooking}
                onClose={() => setPopupOpen(false)}
                position="right center"
                modal
                nested
                contentStyle={{
                  display: 'flex',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  alignItems: 'center',
                  backgroundColor: '#FDFAF0',
                  padding: '20px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.8)',
                  color: 'rgb(110, 121, 110)',
                  width: 'auto',
                  maxWidth: '300px'
                }}
                overlayStyle={{ background: 'rgba(97,112,97,0.5)' }}
              >
                <div className={styles.popupContent}>
                  <h3>Информация о столе №{selectedOption}</h3>
                  {selectedOption && (
                    <div>
                      <p><strong>Дата:</strong> {formData.date}</p>
                      <p><strong>Время:</strong> {formData.startTime} - {formData.endTime}</p>
                      <p><strong>Мест:</strong> {tables.find(t => t.id === selectedOption)?.seats_count || 'Не указано'}</p>
                    </div>
                  )}
                  <button
                    className={styles.selectButton}
                    onClick={handleBooking}
                    disabled={isLoading || currentBooking}
                  >
                    {isLoading ? 'Бронируем...' : 'Забронировать'}
                  </button>
                  {currentBooking && <p className={styles.errorText}>У вас уже есть активное бронирование</p>}
                </div>
              </Popup>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;