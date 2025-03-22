import React, { useContext, useState } from 'react';
import { OrganisationContext } from '@/context/OrganisationContext';
import styles from '@/pages/Booking/Booking.module.css';
import Loader from '@/components/Loading/Loading';

const Booking = () => {
  const { organisation, error } = useContext(OrganisationContext);
  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(10);

  const tablesData = [
    [0, 0, 0, 0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 2, 0, 3, 3, 3, 0, 1],
  ];

  const movies = [
    { value: 10, name: "The Big Lebowski" },
    { value: 12, name: "Fargo" },
    { value: 8, name: "O Brother" },
    { value: 9, name: "No Country for Old Men" },
  ];

  const groupTables = (data) => {
    const groupedData = [];
    for (let rowIndex = 0; rowIndex < data.length; rowIndex++) {
      const row = data[rowIndex];
      const groupedRow = [];
      for (let colIndex = 0; colIndex < row.length; colIndex++) {
        if (row[colIndex] === 3 && row[colIndex + 1] === 3 && row[colIndex + 2] === 3) {
          groupedRow.push({ type: 3, start: colIndex, end: colIndex + 2 });
          colIndex += 2;
        } else {
          groupedRow.push({ type: row[colIndex], start: colIndex, end: colIndex });
        }
      }
      groupedData.push(groupedRow);
    }
    return groupedData;
  };

  const groupedTablesData = groupTables(tablesData);

  const handleTableSelect = (rowIndex, colIndex, tableType) => {
    if (tableType === 0) return;

    const tableKey = `${rowIndex}-${colIndex}`;

    if (selectedTables.includes(tableKey)) {
      setSelectedTables(selectedTables.filter((key) => key !== tableKey));
    } else {
      setSelectedTables([...selectedTables, tableKey]);
    }
  };

  const handleMovieSelect = (value) => {
    setSelectedMovie(Number(value));
  };

  const totalSeats = selectedTables.reduce((total, key) => {
    const [rowIndex, colIndex] = key.split('-').map(Number);
    const table = groupedTablesData[rowIndex][colIndex];
    return total + (table.type === 3 ? 3 : table.type);
  }, 0);

  const totalPrice = totalSeats * selectedMovie;

  if (error) {
    return null;
  }

  if (!organisation) {
    return <Loader />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.welcomeText}>Бронирование столиков</h1>
        <p className={styles.text_typical}>
          Выберите фильм и столик для бронирования.
        </p>

        <div className={styles.movieContainer}>
          <label htmlFor="movie" className={styles.movieLabel}>Выберите фильм:</label>
          <select
            id="movie"
            className={styles.movieSelect}
            value={selectedMovie}
            onChange={(e) => handleMovieSelect(e.target.value)}
          >
            {movies.map((movie) => (
              <option key={movie.value} value={movie.value}>
                {movie.name} (${movie.value})
              </option>
            ))}
          </select>
        </div>

        <div className={styles.tablesContainer}>
          {groupedTablesData.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {row.map((table, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`${styles.table} ${
                    table.type === 0 ? styles.empty : ""
                  } ${table.type === 1 ? styles.single : ""} ${
                    table.type === 2 ? styles.double : ""
                  } ${table.type === 3 ? styles.triple : ""
                  } ${selectedTables.includes(`${rowIndex}-${colIndex}`) ? styles.selected : ""}`}
                  onClick={() => handleTableSelect(rowIndex, colIndex, table.type)}
                  style={{
                    gridColumn: table.type === 3 ? `${table.start + 1} / ${table.end + 2}` : "auto",
                  }}
                >
                  {table.type !== 0 && (
                    <div className={styles.seats}>
                      {Array.from({ length: table.type === 3 ? 3 : table.type }).map((_, seatIndex) => (
                        <div
                          key={seatIndex}
                          className={`${styles.seat} ${
                            table.type === 1 ? styles.singleSeat : ""
                          }`}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        <p className={styles.bookingSummary}>
          Вы выбрали <span className={styles.highlight}>{totalSeats}</span> мест(а) на сумму $
          <span className={styles.highlight}>{totalPrice}</span>.
        </p>
      </div>
    </div>
  );
};

export default Booking;