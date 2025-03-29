import IDish from "../components/interfaces/IDish";
import authToken from "../config/authToken";
import API_BASE_URL from "../config/config";
import IAverageRating from "../components/interfaces/IAverageRating";

const path =`${API_BASE_URL}/analytics/`

export const getStatistics = {
  async getAverageBill(): Promise<number> {
    const response = await fetch(`${path}average_bill`, {
        headers: {
          [import.meta.env.VITE_authHeader]: String(authToken()),
          [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
          'Content-Type': 'application/json'
        }
      });
    console.log(response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as number;
  },

  async getAvgBillPerDay(): Promise<Array<[string, number]>> {
    const response = await fetch(`${path}average_bill_per_day`, {
        headers: {
          [import.meta.env.VITE_authHeader]: String(authToken()),
          [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
          'Content-Type': 'application/json'
        }
      });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as Array<[string, number]>;
  },

  async getPopularDishes(): Promise<Array<{ dish: IDish; count: number }>> {
    const response = await fetch(`${path}popular_dishes`, {
        headers: {
          [import.meta.env.VITE_authHeader]: String(authToken()),
          [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
          'Content-Type': 'application/json'
        }
      });
    //console.log(response.json());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as Array<{ dish: IDish; count: number }>;
  },

  async getGuestsPerDay(): Promise<Array<[string, number]>> {
    const response = await fetch(`${path}guests_per_day`, {
        headers: {
          [import.meta.env.VITE_authHeader]: String(authToken()),
          [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
          'Content-Type': 'application/json'
        }
      });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as Array<[string, number]>;
  },

  async getOrderExecutions(): Promise<Array<[number, number]>> {
    const response = await fetch(`${path}order_execution`, {
        headers: {
          [import.meta.env.VITE_authHeader]: String(authToken()),
          [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
          'Content-Type': 'application/json'
        }
      });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as Array<[number, number]>;
  },

  async getTotalRevenue(): Promise<number> {
    const response = await fetch(`${path}revenue_per_day`, {
        headers: {
          [import.meta.env.VITE_authHeader]: String(authToken()),
          [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
          'Content-Type': 'application/json'
        }
      });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as number;
  },

  async getRevenuePerDay(): Promise<Array<[string, number]>> {
    const response = await fetch(`${path}revenue_per_day`, {
        headers: {
          [import.meta.env.VITE_authHeader]: String(authToken()),
          [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
          'Content-Type': 'application/json'
        }
      });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as Array<[string, number]>;
  },

  async getAverageRating(): Promise<IAverageRating> {
    const response = await fetch(`${path}average_rating`, {
        headers: {
          [import.meta.env.VITE_authHeader]: String(authToken()),
          [import.meta.env.VITE_userIDheader]: String(import.meta.env.VITE_userId),
          'Content-Type': 'application/json'
        }
      });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json() as IAverageRating;
  },

  }

  export default getStatistics;