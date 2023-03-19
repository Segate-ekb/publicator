// serverManagement.js

export const restartServer = async () => {
    try {
      const response = await fetch(`/api/v1/ws/restart`);
  
      if (response.ok) {
        const data = await response.json();
        return { success: true, message: 'Сервер успешно перезапущен' };
      } else {
        return { success: false, message: `Ошибка при перезапуске сервера: ${response.statusText}` };
      }
    } catch (error) {
      return { success: false, message: `Ошибка при перезапуске сервера: ${error.message}` };
    }
  };
  
  export const stopServer = async () => {
    try {
      const response = await fetch(`/api/v1/ws/stop`);
  
      if (response.ok) {
        const data = await response.json();
        return { success: true, message: 'Сервер успешно остановлен' };
      } else {
        return { success: false, message: `Ошибка при остановке сервера: ${response.statusText}` };
      }
    } catch (error) {
      return { success: false, message: `Ошибка при остановке сервера: ${error.message}` };
    }
  };
  
  export const startServer = async () => {
    try {
      const response = await fetch(`/api/v1/ws/start`);
  
      if (response.ok) {
        const data = await response.json();
        return { success: true, message: 'Сервер успешно запущен' };
      } else {
        return { success: false, message: `Ошибка при запуске сервера: ${response.statusText}` };
      }
    } catch (error) {
      return { success: false, message: `Ошибка при запуске сервера: ${error.message}` };
    }
  };



  export const saveToServer = async (jsonData) => {
    try {
      const response = await fetch('/api/v1/updateconfig', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData, null, 2)
      });
  
      if (response.ok) {
        const data = await response.json();
        return { success: true, message: 'Уонфигурация успешно записана' };
    } else {
        return { success: false, message: `Ошибка при запуске сервера: ${response.statusText}` };
      }
    } catch (error) {
      return { success: false, message: `Ошибка при запуске сервера: ${error.message}` };
    }
  };