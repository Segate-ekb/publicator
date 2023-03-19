import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useBasesData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [jsonData, setJsonData] = useState({ bases: [] });
  const [basesData, setBasesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://1cdevelopers.ru/api/v1/getconfig.json');
        const strResponce = await response.text();
        const data = JSON.parse(strResponce);
        setJsonData(data);
        setBasesData(data.bases);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setJsonData((prevJsonData) => ({
      ...prevJsonData,
      bases: basesData,
    }));
  }, [basesData]);

  const refreshData = async () => {
    try {
      const response = await fetch('https://1cdevelopers.ru/api/v1/getconfig.json');
      const strResponce = await response.text();
      const data = JSON.parse(strResponce);
      setJsonData(data);
      setBasesData(data.bases);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
<DataContext.Provider value={{ basesData, setBasesData, jsonData, refreshData }}>
  {children}
</DataContext.Provider>
  );
};