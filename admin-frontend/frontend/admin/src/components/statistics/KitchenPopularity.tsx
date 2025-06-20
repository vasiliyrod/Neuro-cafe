import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: any;
}

const KitchenPopularity = ({ data }: Props) => {
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
        Популярность кухонь
      </h3>
      <div style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
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
  );
};

export default KitchenPopularity;
