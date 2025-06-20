import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: [string, number][];
  totalAverage: number;
}

const AverageCheque = ({ totalAverage, data }: Props) => {
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
        Средний чек за всё время: {totalAverage.toLocaleString("ru-RU")}₽
        <p style={{ margin: "10px 0 0", fontSize: "0.9rem", fontWeight: 400 }}>
          Средний чек в течение недели
        </p>
      </h3>

      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
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
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#ff7300"
              name="Средний чек"
              strokeWidth={2}
              dot={{ fill: "#ff7300", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AverageCheque;
