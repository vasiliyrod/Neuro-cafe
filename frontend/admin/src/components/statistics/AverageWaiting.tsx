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
  data: [number, number][];
}

const AverageWaiting = ({ data }: Props) => {
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
        Среднее время ожидания заказов
      </h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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
  );
};

export default AverageWaiting;
