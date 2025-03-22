import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", sales: 65 },
  { month: "Feb", sales: 59 },
  { month: "Mar", sales: 80 },
  { month: "Apr", sales: 81 },
  { month: "May", sales: 56 },
  { month: "Jun", sales: 55 },
];

const Chart2 = () => {
  return (
    <div style={{ width: "625px", height: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          width={600}
          height={300}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fill: "#666" }} />
          <YAxis tick={{ fill: "#666" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
            }}
          />
          <Bar
            dataKey="sales"
            name="Monthly Sales"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
            activeBar={{
              fill: "#6d9eeb",
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart2;
