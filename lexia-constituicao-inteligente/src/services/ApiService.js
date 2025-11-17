
const BASE_URL = 'http://localhost:5001';

/**

 *
 * @param {string} textoArtigo
 * @param {string} duvidaUsuario
 * @returns {Promise<object>}
 * @throws {Error} 
 */
export const analisarArtigo = async (textoArtigo, duvidaUsuario = '') => {
  

  const requestBody = {
    textoArtigo: textoArtigo,
    duvidaUsuario: duvidaUsuario
  };

  try {
    
    const response = await fetch(`${BASE_URL}/api/resumir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
    
      const errorData = await response.json();
      throw new Error(errorData.erro || `Falha na requisição: ${response.statusText}`);
    }

    const data = await response.json();
    
    return data;

  } catch (error) {
    console.error('Erro ao chamar a API de análise:', error);

    throw error;
  }
};