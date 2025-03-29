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
}

const ClientsAmount = ({ data }: Props) => {
  // Преобразуем данные в формат, понятный для Recharts
  const chartData = data.map(([day, guests]) => ({
    day: day.trim(), // Удаляем лишние пробелы
    guests,
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
        Количество гостей
      </h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fill: "#2d3436" }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="guests" name="Количество гостей" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ClientsAmount;
