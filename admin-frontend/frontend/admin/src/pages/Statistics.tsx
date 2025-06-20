import React, { useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import AverageGrades from "../components/statistics/AverageGrades";
import AverageWaiting from "../components/statistics/AverageWaiting";
import getStatistics from "../services/getStatistics";
import AverageCheque from "../components/statistics/AverageCheque";
import authToken from "../config/authToken";
import { useNavigate } from "react-router-dom";
import PopularDishes from "../components/statistics/PopularDishes";
import IDish from "../components/interfaces/IDish";
import IAverageRating from "../components/interfaces/IAverageRating";
import ClientsAmount from "../components/statistics/ClientsAmount";
import Income from "../components/statistics/Income";

const Statistics = () => {
  const navigate = useNavigate();

  const [popularDishes, setPopularDishes] = useState<
    Array<{ dish: IDish; count: number }>
  >([]);
  const [averageBillData, setAverageBillData] = useState<number>(0);
  const [avgBillPerDay, setAvgBillPerDay] = useState<Array<[string, number]>>(
    []
  );
  const [guestsPerDay, setGuestsPerDay] = useState<Array<[string, number]>>([]);
  const [orderExecutions, setOrderExecutions] = useState<
    Array<[number, number]>
  >([]);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [revenuePerDay, setRevenuePerDay] = useState<Array<[string, number]>>(
    []
  );
  const [averageRating, setAverageRating] = useState<IAverageRating>({
    overallRating: 0,
    aiRating: 0,
    atmosphereRating: 0,
    staffRating: 0,
    foodRating: 0,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем все данные параллельно для оптимизации
        const [
          averageBill,
          popularDishesData,
          avgBillPerDayData,
          guestsPerDayData,
          orderExecutionsData,
          totalRevenueData,
          revenuePerDayData,
          averageRatingData,
        ] = await Promise.all([
          getStatistics.getAverageBill(),
          getStatistics.getPopularDishes(),
          getStatistics.getAvgBillPerDay(),
          getStatistics.getGuestsPerDay(),
          getStatistics.getOrderExecutions(),
          getStatistics.getTotalRevenue(),
          getStatistics.getRevenuePerDay(),
          getStatistics.getAverageRating(),
        ]);

        // Обновляем состояния
        setAverageBillData(averageBill);
        setPopularDishes(popularDishesData);
        setAvgBillPerDay(avgBillPerDayData);
        setGuestsPerDay(guestsPerDayData);
        setOrderExecutions(orderExecutionsData);
        setTotalRevenue(totalRevenueData);
        setRevenuePerDay(revenuePerDayData);
        setAverageRating(averageRatingData);
        setError(null);
      } catch (err) {
        if (err.response?.status === 403) {
          navigate("/login");
          return;
        }
        setError(err instanceof Error ? err.message : "Неизвестная ошибка");
      }
    };

    loadData();
  }, []);

  // Если токен отсутствует, показываем пустой контейнер до срабатывания редиректа
  if (!authToken()) {
    return null;
  }

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
          //backgroundColor: "#f5f6fa",
          minHeight: "50vh",
        }}
      >
        <AverageWaiting data={orderExecutions} />
        <ClientsAmount data={guestsPerDay} />
        <AverageCheque totalAverage={averageBillData} data={avgBillPerDay} />
        <Income data={revenuePerDay} totalRevenue={totalRevenue} />
        <AverageGrades data={averageRating} />
      </div>
      <div>
        <PopularDishes data={popularDishes} />
      </div>
    </>
  );
};
export default Statistics;
