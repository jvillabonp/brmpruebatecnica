const jwt = require('jsonwebtoken');
const { User } = require('../../database/models');

async function authenticateToken(req, res, next) {
  const tokenHeader = req.headers.authorization;

  if (!tokenHeader || !tokenHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = tokenHeader.slice(7);

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    const userAuth = await User.findOne({ where: { username: user.username } });

    if (!userAuth) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.userAuth = userAuth;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = authenticateToken;
