import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: [string, number][];
  totalRevenue: number;
}

const Income = ({ data, totalRevenue }: Props) => {
  // Исправлена опечатка в деструктуризации
  // Преобразуем данные в нужный формат
  const chartData = data.map(([day, amount]) => ({
    day: day.trim(), // Убираем лишние пробелы
    amount,
  }));

  return (
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
        Выручка: {totalRevenue.toLocaleString("ru-RU")}₽{" "}
        {/* Добавлена локаль для рубля */}
      </h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fill: "#2d3436" }} />
            <YAxis />
            <Tooltip
              formatter={(value) => [
                value.toLocaleString("ru-RU") + "₽",
                "Сумма",
              ]}
            />
            <Legend />
            <Bar dataKey="amount" name="Выручка за день" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Income;
