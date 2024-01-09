const { User } = require('../../database/models');
const Checkit = require('checkit');
const { Op } = require('sequelize');

async function index(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const startIndex = (page - 1) * pageSize;

    const users = await User.findAll({
      offset: startIndex,
      limit: pageSize,
    });

    const totalCount = await User.count();
    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      data: users,
      page,
      pageSize,
      totalCount,
      totalPages,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error interno'
    });
  }
}

async function store(req, res) {
  const checkit = new Checkit({
    username: 'required',
    email: ['required', 'email'],
    password: ['required', 'minLength:6', 'maxLength:30'],
    confirmPassword: ['required', `isEqual:${req.body.password}`],
    role: ['required', function (value) {
      if (!User.ALLOWED_ROLES.includes(value)) {
        throw new Error(`'${value}' role is not allowed, please use [${User.ALLOWED_ROLES.join(', ')}]`);
      }
    }]
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
    const { username, email, password, role } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [
          { username },
          { email }
        ]
      }
    });

    if (user) {
      return res.status(400).json({
        message: 'Usuario ya existente'
      });
    }

    await User.create({ username, email, password, role });

    res.status(201).json({
      message: '¡Usuario creado!'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error interno'
    });
  }
}

async function show(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id }
    });

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json(user);
  } catch (e) {
    res.status(500).json({
      message: 'Error interno'
    });
  }
}

async function update(req, res) {
  const checkit = new Checkit({
    role: ['required', function (value) {
      if (!User.ALLOWED_ROLES.includes(value)) {
        throw new Error(`'${value}' role is not allowed, please use [${User.ALLOWED_ROLES.join(', ')}]`);
      }
    }]
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
    const { role } = req.body;
    const { id } = req.params;

    const user = await User.findOne({
      where: { id }
    });
    if (!user || user.id == req.userAuth.id) {
      return res.status(404).json({
        message: 'Usuario no existe'
      });
    }

    await User.update({ role }, { where: { id } });

    res.status(200).json({
      message: '¡Usuario actualizado!'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error interno'
    });
  }
}

async function destroy(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { id }
    });

    if (!user || user.id == req.userAuth.id) {
      return res.status(404).json({
        message: 'Usuario no existe'
      });
    }

    await User.update({ deletedAt: new Date() }, { where: { id } });

    res.status(200).json({
      message: '¡Usuario eliminado!'
    });
  } catch (e) {
    res.status(500).json({
      message: 'Error interno'
    });
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy
};