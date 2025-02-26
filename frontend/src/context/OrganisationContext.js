import React, { createContext, useState, useEffect } from 'react';
import { getOrganisationInfo } from '../services/organisation/organisation';

export const OrganisationContext = createContext();

export const OrganisationProvider = ({ children }) => {
  const [organisation, setOrganisation] = useState({
    name: '',
    tg_link: '',
    email: '',
    phone: '',
    longitude: 0.0,
    latitude: 0.0,
    address: '',
    desc: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrganisationInfo();
        setOrganisation(data);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <OrganisationContext.Provider value={{ organisation }}>
      {children}
    </OrganisationContext.Provider>
  );
};