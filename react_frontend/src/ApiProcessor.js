// ApiProcessor.js
const serverApi = process.env.REACT_APP_SERVER_API;

const sendRequest = async (url, showSnackbar) => {
    const response = await fetch(url);
  
    if (response.ok) {
      const data = await response.json();
      if (data.message && typeof data.message === 'string') {
        showSnackbar && showSnackbar(data.message, "success");
      }
      return data;
    } else {
      showSnackbar && showSnackbar(`Произошла ошибка при выполнении запроса: ${response.statusText}`, "error");
      return null;
    }
  };

export const startServer = async (showSnackbar) => {
  return sendRequest(`/api/v1/ws/start`, showSnackbar);
};

export const stopServer = async (showSnackbar) => {
  return sendRequest(`/api/v1/ws/stop`, showSnackbar);
};

export const restartServer = async (showSnackbar) => {
  return sendRequest(`/api/v1/ws/restart`, showSnackbar);
};

export const getConfig = async (showSnackbar) => {
  return sendRequest(`https://publicator.1cdevelopers.ru/api/v1/config/getconfig`, showSnackbar);
};

export const getSettings = async (showSnackbar) => {
  return sendRequest(`https://publicator.1cdevelopers.ru/api/v1/config/getsettings`, showSnackbar);
};

const sendPostRequest = async (url, data, showSnackbar) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
  
      if (response.ok) {
        const responseData = await response.json();
        showSnackbar && showSnackbar(responseData.message, "success");
        return responseData;
      } else {
        showSnackbar && showSnackbar(`Произошла ошибка при выполнении запроса: ${response.statusText}`, "error");
        return null;
      }
  };
  
  export const updateSettings = async (settings, showSnackbar) => {
    return sendPostRequest(`/api/v1/config/updatesettings`, settings, showSnackbar);
  };
  
  export const updateConfig = async (bases, crs, showSnackbar) => {
    return sendPostRequest(`/api/v1/config/updateconfig`, { bases, crs }, showSnackbar);
  };