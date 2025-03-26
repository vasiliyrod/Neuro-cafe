import React, { useState, useEffect } from 'react';
import styles from '@/pages/Booking/Booking.module.css';

const BookingPage = () => {
  const [sampleCheckboxes, setSampleCheckboxes] = useState([]);
  const [bookingInfo, setBookingInfo] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bookingResponse = await fetch('http://localhost:8001/api/bookings');
        const bookingData = await bookingResponse.json();
        setBookingInfo(bookingData.bookedTables || []);

        if (formData.date && formData.startTime && formData.endTime) {
          const tablesResponse = await fetch('http://localhost:8001/api/tables', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });
          const tablesData = await tablesResponse.json();
          setSampleCheckboxes(tablesData.availableTables || []);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const navbar = document.querySelector('nav');
    if (navbar) navbar.style.backgroundColor = '#FDFAF0';

    return () => {
      if (navbar) navbar.style.backgroundColor = '';
    };
  }, [formData.date, formData.startTime, formData.endTime]);

  const handleOptionChange = (id) => {
    setSelectedOptions(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.startTime || !formData.endTime) {
      alert('Пожалуйста, заполните все поля формы');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8001/api/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setSampleCheckboxes(data.availableTables || []);
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isSelectionValid || !formData.date || !formData.startTime || !formData.endTime) {
      alert('Пожалуйста, заполните все данные и выберите столы');
      return;
    }

    setIsLoading(true);
    try {
      const bookingRequest = {
        ...formData,
        tableIds: selectedOptions
      };

      const response = await fetch('http://localhost:8001/api/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingRequest)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка бронирования');
      }

      const bookingResponse = await fetch('http://localhost:8001/api/bookings');
      const bookingData = await bookingResponse.json();
      setBookingInfo(bookingData.bookedTables || []);

      setSelectedOptions([]);

      alert('Бронирование успешно завершено!');
    } catch (error) {
      console.error('Ошибка бронирования:', error);
      alert(error.message || 'Произошла ошибка при бронировании');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.date && formData.startTime && formData.endTime;
  const isSelectionValid = selectedOptions.length > 0;

  return (
    <div className={styles.container}>
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
              />
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
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? 'Загрузка...' : 'Узнать занятость'}
            </button>
          </form>
        </div>

        <div className={styles.seatSelection}>
          <h2>Схема зала</h2>

          {isLoading && sampleCheckboxes.length === 0 ? (
            <p>Загружаем данные...</p>
          ) : sampleCheckboxes.length === 0 ? (
            <p>Пожалуйста, укажите дату и время для просмотра доступных столов</p>
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
                    {sampleCheckboxes.map((cell) => {
                      const isBooked = bookingInfo.includes(cell.id);
                      const isSelected = selectedOptions.includes(cell.id);

                      return (
                        <div
                          key={`${cell.x}-${cell.y}`}
                          className={`${styles.checkboxContainer} ${
                            isBooked ? styles.booked :
                            isSelected ? styles.selected :
                            styles.available
                          }`}
                          style={{
                            left: `${cell.x}%`,
                            top: `${cell.y}%`,
                          }}
                        >
                          <input
                            type="checkbox"
                            id={`option-${cell.id}`}
                            checked={isSelected}
                            onChange={() => !isBooked && handleOptionChange(cell.id)}
                            disabled={isBooked}
                            className={styles.hiddenCheckbox}
                          />
                          <div className={styles.customCheckbox} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className={styles.selectionResult}>
                <h3>Выбранные места:</h3>
                {selectedOptions.length > 0 ? (
                  <ul>
                    {selectedOptions.map(id => (
                      <li key={id}>Стол №{id}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Пожалуйста, выберите места</p>
                )}
              </div>

              <button
                className={styles.selectButton}
                onClick={handleBooking}
                disabled={!isSelectionValid || isLoading}
              >
                {isLoading ? 'Бронируем...' : 'Забронировать'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;