const verifyApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY || 'kuncirahasia123';
  
    if (!apiKey || apiKey !== validApiKey) {
      return res.status(401).json({
        status: 'error',
        message: 'Akses Ditolak. Harap masukkan API Key yang valid.'
      });
    }
    next();
  };
  
  module.exports = verifyApiKey;