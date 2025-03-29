import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";
import IAverageRating from "../interfaces/IAverageRating";

interface Props {
  data: IAverageRating;
}

const AverageGrades = ({ data }: Props) => {
  // Преобразование данных в подходящий формат для RadarChart
  const chartData = [
    { criterion: "Overall", score: data.overallRating },
    { criterion: "AI", score: data.aiRating },
    { criterion: "Atmosphere", score: data.atmosphereRating },
    { criterion: "Staff", score: data.staffRating },
    { criterion: "Food", score: data.foodRating },
  ];

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
        Средние оценки
      </h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
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
  );
};

export default AverageGrades;
