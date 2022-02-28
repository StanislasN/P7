const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
      //récupérer le token par un split puis le userId = token
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, TOKEN_SECRET);
      const userId = decodedToken.userId;
      //comparer le userId de la reqête au userId
      if (req.body.userId && req.body.userId !== userId) {
        throw 'Invalid user ID';
      } else {
        next();
      }
    } catch {
      res.status(401).json({
        error: new Error('Invalid request!')
      });
    }
  };