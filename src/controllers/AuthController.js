const { User, Purchase } = require('../../database/models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Checkit = require('checkit');
const { Op } = require('sequelize');

async function login(req, res) {  
  const checkit = new Checkit({
    email: ['required', 'email'],
    password: ['required', 'minLength:6', 'maxLength:30'],
  });

  try {
    await checkit.run(req.body);
  } catch (e) {
    return res.status(400).json({
      message: 'Error en la validación de datos',
      errors: e.errors
    });
  }

  try {
    const { email, password } = req.body;

    const user = await User.scope('withPassword').findOne({ where: { email: email } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({
        message: 'Credenciales incorrectas'
      });
    }

    const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '365d',
    });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      authToken: token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error interno' });
  }
}

async function register(req, res) {  
  const checkit = new Checkit({
    username: 'required',
    email: ['required', 'email'],
    password: ['required', 'minLength:6', 'maxLength:30'],
    confirmPassword: ['required', `isEqual:${req.body.password}`]
  });

  try {
    await checkit.run(req.body);
  } catch (e) {
    return res.status(400).json({
      message: 'Error en la validación de datos',
      errors: e.errors
    });
  }

  try {
    const { username, email, password } = req.body;
    
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (user) {
      return res.status(400).json({
        message: 'Usuario existente'
      });
    }

    await User.create({ username, email, password });

    res.status(201).json({
      message: '¡Registro exitoso!'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error interno'
    });
  }
}

async function profile(req, res) {
  try {
    const { id, username, email, role } = req.userAuth;

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;

    const startIndex = (page - 1) * pageSize;

    const purchases = await Purchase.findAll({
      where: { userId: id },
      offset: startIndex,
      limit: pageSize,
      order: [ ['createdAt', 'DESC'] ]
    });

    const totalCount = await Purchase.count({ where: { userId: id } });
    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      user: { username, email, role },
      purchases: {
        data: purchases,
        page,
        pageSize,
        totalCount,
        totalPages
      }
    });
  } catch (e) {
    res.status(500).json({
      message: 'Error interno'
    });
  }
}

async function changePassword(req, res) {
  const checkit = new Checkit({
    currentPassword: 'required',
    password: ['required', 'minLength:6', 'maxLength:30'],
    confirmPassword: ['required', `isEqual:${req.body.password}`]
  });

  try {
    await checkit.run(req.body);
  } catch (e) {
    return res.status(400).json({
      message: 'Error en la validación de datos',
      errors: e.errors
    });
  }

  try {
    const { currentPassword, password }= req.body;
    const { id } = req.userAuth;

    const user = await User.scope('withPassword').findOne({ where: { id }});

    if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
      return res.status(401).json({
        message: 'La contraseña actual propocionada no coincide con la contraseña actual'
      });
    }

    await User.update({ password }, { where: { id } });

    res.status(201).json({
      message: 'Contraseña cambiada'
    });
  } catch (e) {
    res.status(500).json({
      message: 'Error interno'
    });
  }
}

module.exports = {
  login,
  register,
  profile,
  changePassword
};
