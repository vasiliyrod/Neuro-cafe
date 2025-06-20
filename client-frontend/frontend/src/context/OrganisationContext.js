import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { getOrganisationInfo } from '@/services/organisation/organisation';
import Loader from '@/components/Loading/Loading';

export const OrganisationContext = createContext();

export const OrganisationProvider = ({ children }) => {
  const [organisation, setOrganisation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrganisationInfo();
        setOrganisation(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        setError(error);
        navigate('/error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <OrganisationContext.Provider value={{ organisation, error }}>
      {children}
    </OrganisationContext.Provider>
  );
};