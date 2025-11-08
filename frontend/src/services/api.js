import axios from 'axios';

// 1. Creamos nuestra instancia "inteligente" de Axios
const api = axios.create({
  // 2. Definimos la URL base de nuestro backend
  baseURL: 'http://localhost:8080/api',
});

// 3. ¡EL INTERCEPTADOR!
// Esto se ejecutará ANTES de cada solicitud que salga de esta instancia 'api'
api.interceptors.request.use(
  (config) => {
    // 4. Intenta leer el token de localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // 5. Si el token existe, lo adjunta a los encabezados de la solicitud
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config; // Devuelve la solicitud (ahora con o sin token)
  },
  (error) => {
    // Si hay un error al configurar la solicitud, lo rechaza
    return Promise.reject(error);
  }
);

export default api;