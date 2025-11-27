// ==========================================================
// TESTS HTTP / API EXTERNE
// Teste les appels à des API externes ou services
// ==========================================================

const request = require('supertest');
const app = require('../app');
const axios = require('axios');

// Mock axios pour éviter les vraies requêtes HTTP
jest.mock('axios');

describe('Tests HTTP / API externe', () => {
  
  // ==========================================================
  // ROUTE EXEMPLE : GET /weather/:city
  // Récupère la météo d'une ville via API externe
  // ==========================================================
  
  describe('GET /weather/:city', () => {
    
    it('devrait retourner la météo depuis l\'API externe', async () => {
      // Mock de la réponse de l'API externe
      const mockWeatherData = {
        data: {
          city: 'Paris',
          temperature: 15,
          condition: 'Nuageux'
        }
      };
      
      axios.get.mockResolvedValue(mockWeatherData);
      
      const response = await request(app).get('/weather/Paris');
      
      expect(response.statusCode).toBe(200);
      expect(response.body.city).toBe('Paris');
      expect(response.body.temperature).toBe(15);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining('api.weather.com')
      );
    });
    
    it('devrait gérer les erreurs de l\'API externe', async () => {
      // Simuler une erreur de l'API
      axios.get.mockRejectedValue(new Error('API indisponible'));
      
      const response = await request(app).get('/weather/Paris');
      
      expect(response.statusCode).toBe(500);
      expect(response.body.error).toBe('Impossible de récupérer la météo');
    });
  });
});


// ==========================================================
// ROUTE EXEMPLE : Code pour app.js
// ==========================================================

/*
app.get('/weather/:city', async (req, res) => {
  const { city } = req.params;
  
  try {
    const response = await axios.get(`https://api.weather.com/v1/weather?city=${city}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Impossible de récupérer la météo' });
  }
});
*/
