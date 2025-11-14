/**
 * Sanitiza HTML para prevenir XSS
 * Remove tags e atributos perigosos
 * 
 * NOTA: Para produção, considere usar DOMPurify:
 * npm install dompurify
 * import DOMPurify from 'dompurify';
 * return DOMPurify.sanitize(html);
 */
export const sanitizeHTML = (html) => {
  if (!html || typeof html !== 'string') return '';

  // Remove scripts e eventos perigosos
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /on\w+\s*=\s*["'][^"']*["']/gi, // Remove event handlers como onclick, onerror, etc
    /javascript:/gi,
    /data:text\/html/gi,
  ];

  let sanitized = html;
  dangerousPatterns.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });

  // Permite apenas tags seguras
  const allowedTags = ['strong', 'em', 'br', 'span', 'div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  const tagPattern = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
  
  sanitized = sanitized.replace(tagPattern, (match, tagName) => {
    if (allowedTags.includes(tagName.toLowerCase())) {
      return match;
    }
    return ''; // Remove tags não permitidas
  });

  return sanitized;
};

/**
 * Cria um elemento HTML seguro
 * @param {string} html - HTML a ser sanitizado
 * @returns {object} - Objeto para usar com dangerouslySetInnerHTML
 */
export const createSafeHTML = (html) => {
  return { __html: sanitizeHTML(html) };
};

