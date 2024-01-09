const Checkit = require('checkit');
const { Product, Purchase, ProductPurchase } = require('../../database/models');
const moment = require('moment/moment');
const { Op } = require('sequelize');

async function index(req, res) {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const startIndex = (page - 1) * pageSize;

    const whereClause = query
      ? {
          name: {
            [Op.like]: `%${query}%`,
          },
        }
      : {}; 

    const products = await Product.findAll({
      where: whereClause,
      offset: startIndex,
      limit: pageSize
    });

    const totalCount = await Product.count({ where: whereClause });
    const totalPages = Math.ceil(totalCount / pageSize);

    return res.status(200).json({
      data: products,
      page,
      pageSize,
      totalCount,
      totalPages,
    });
  } catch (e) {
    res.status(500).json({
      message: 'Error interno'
    });
  }
}

async function store(req, res) {
  const checkit = new Checkit({
    lotNumber: 'required',
    name: 'required',
    price: ['required', 'numeric', function (value) {
      if (value < 0) {
        throw new Error('The price cannot be less than 0')
      }
    }],
    quantity: ['required', 'numeric', function (value) {
      if (value < 0) {
        throw new Error('The quantity cannot be less than 0')
      }
    }],
    entryDate: ['required', function (value) {
      const result = moment(value).isValid();
      if (!result) {
        throw new Error('Incorrect entryDate format date');
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
    const { lotNumber, name, price, quantity, entryDate } = req.body;

    const product = await Product.findOne({
      where: { lotNumber }
    });

    if (product) {
      return res.status(400).json({
        message: 'Producto ya existente'
      });
    }

    await Product.create({
      lotNumber,
      name,
      price,
      quantity,
      entryDate
    });

    res.status(201).json({
      message: '¡Producto creado!'
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

    const product = await Product.findOne({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        message: 'Producto no encontrado'
      });
    }

    res.status(200).json(product);
  } catch (e) {
    res.status(500).json({
      message: 'Error interno'
    });
  }
}

async function update(req, res) {
  const checkit = new Checkit({
    name: 'required',
    price: ['required', 'numeric', function (value) {
      if (value < 0) {
        throw new Error('The price cannot be less than 0')
      }
    }],
    quantity: ['required', 'numeric', function (value) {
      if (value < 0) {
        throw new Error('The quantity cannot be less than 0')
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
    const { name, price, quantity } = req.body;
    const { id } = req.params;

    const product = await Product.findOne({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        message: 'Producto no existe'
      });
    }

    await product.update({ name, price, quantity });

    res.status(200).json({
      message: '¡Producto actualizado!'
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

    const product = await Product.findOne({
      where: { id }
    });

    if (!product) {
      return res.status(404).json({
        message: 'Producto no existe'
      });
    }

    await Product.update({ deletedAt: new Date() }, { where: { id }});

    res.status(200).json({
      message: '¡Producto eliminado!'
    });
  } catch (e) {
    res.status(500).json({
      message: 'Error interno'
    });
  }
}

async function history(req, res) {
  try {
    const { id } = req.userAuth;

    const productsPurchased = await Purchase.findAll({
      where: { userId: id },
      include: [
        {
          model: Product,
          attributes: ['name'],
          through: {
            model: ProductPurchase,
            attributes: ['quantity']
          },
        }
      ],
    });

    const result = productsPurchased.map(purchase => {
      const productInfo = purchase.Products.map(product => ({
        name: product.name,
        quantity: product.ProductPurchases.quantity,
      }));

      return productInfo;
    });
    
    const quantityMap = new Map();
    
    result.forEach(subArray => {
      subArray.forEach(obj => {
        const { name, quantity } = obj;
        quantityMap.set(name, (quantityMap.get(name) || 0) + quantity);
      });
    });

    const resultArray = [...quantityMap.entries()].map(([name, quantity]) => ({ name, quantity }));
    
    res.status(200).json(resultArray);
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
  destroy,
  history
}