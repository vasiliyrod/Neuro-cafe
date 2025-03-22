import React from "react";
import {
  LineChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import NavigationBar from "../components/NavigationBar";

const Statistics = () => {
  // 1. Среднее время ожидания заказов по часам
  const waitingTimeData = Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    time: Math.floor(Math.random() * 20 + 20 + (i % 10)), // 20-40 минут
  }));

  // 2. Количество гостей по дням недели
  const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const guestsData = days.map((day, i) => ({
    day,
    guests: Math.floor(Math.random() * 120 + 80 + i * 15), // 80-200+
  }));

  // 3. Популярные блюда
  const popularDishes = [
    { name: "Стейк Рибай", orders: 234 },
    { name: "Цезарь", orders: 198 },
    { name: "Паста Карбонара", orders: 176 },
    { name: "Бургер", orders: 162 },
    { name: "Тирамису", orders: 148 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // 4. Средний чек
  const averageBillData = days.map((day, i) => ({
    day,
    amount: Math.floor(Math.random() * 1500 + 2000 - i * 100), // ~2000-3500
  }));
  const totalAverage =
    averageBillData.reduce((acc, cur) => acc + cur.amount, 0) / 7;

  // 5. Radar по кухням
  const cuisinesData = [
    { cuisine: "Итальянская", popularity: 9 },
    { cuisine: "Японская", popularity: 7 },
    { cuisine: "Мексиканская", popularity: 6 },
    { cuisine: "Грузинская", popularity: 8 },
    { cuisine: "Французская", popularity: 5 },
  ];

  // 6. Выручка
  const revenueData = days.map((day, i) => ({
    day,
    amount: Math.floor(Math.random() * 120000 + 180000 + i * 20000), // 180k-300k+
  }));
  const totalRevenue = revenueData.reduce((acc, cur) => acc + cur.amount, 0);

  // 7. Оценки
  const ratingsData = [
    { criterion: "Качество еды", score: 8.7 },
    { criterion: "Обслуживание", score: 9.2 },
    { criterion: "Атмосфера", score: 8.9 },
    { criterion: "Чистота", score: 9.1 },
    { criterion: "Скорость", score: 8.4 },
  ];

  return (
    <>
      <NavigationBar page="Статистика" />
      <div
        className="statistics-container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "30px",
          padding: "30px",
          backgroundColor: "#f5f6fa",
          minHeight: "100vh",
        }}
      >
        {/* График времени ожидания */}
        <div
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            transition: "transform 0.2s ease",
          }}
        >
          <h3
            style={{
              margin: "0 0 15px 0",
              color: "#2d3436",
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            Среднее время ожидания заказов
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={waitingTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="time" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Посетители по дням */}
        <div
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            transition: "transform 0.2s ease",
          }}
        >
          <h3
            style={{
              margin: "0 0 15px 0",
              color: "#2d3436",
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            Количество гостей
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={guestsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="guests" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Популярные блюда */}
        <div
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            transition: "transform 0.2s ease",
          }}
        >
          <h3
            style={{
              margin: "0 0 15px 0",
              color: "#2d3436",
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            Популярные блюда
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={popularDishes}
                  dataKey="orders"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  {popularDishes.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Средний чек */}
        <div
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            transition: "transform 0.2s ease",
          }}
        >
          <h3
            style={{
              margin: "0 0 15px 0",
              color: "#2d3436",
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            Средний чек: {totalAverage.toFixed(0)}₽
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={averageBillData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#ff7300" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Радар кухонь */}
        <div
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            transition: "transform 0.2s ease",
          }}
        >
          <h3
            style={{
              margin: "0 0 15px 0",
              color: "#2d3436",
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            Популярность кухонь
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={cuisinesData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="cuisine" />
                <PolarRadiusAxis />
                <Radar
                  dataKey="popularity"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Выручка */}
        <div
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            transition: "transform 0.2s ease",
          }}
        >
          <h3
            style={{
              margin: "0 0 15px 0",
              color: "#2d3436",
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            Выручка: {totalRevenue.toLocaleString()}₽
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Оценки */}
        <div
          style={{
            background: "white",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
            transition: "transform 0.2s ease",
          }}
        >
          <h3
            style={{
              margin: "0 0 15px 0",
              color: "#2d3436",
              fontSize: "1.2rem",
              fontWeight: 600,
            }}
          >
            Средние оценки
          </h3>
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={ratingsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="criterion" />
                <PolarRadiusAxis domain={[0, 10]} />
                <Radar
                  dataKey="score"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};
export default Statistics;
