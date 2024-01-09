const Joi = require('joi');
const { Purchase, Product, ProductPurchase, User } = require('../../database/models');
const Checkit = require('checkit');

async function index(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const startIndex = (page - 1) * pageSize;

    const purchases = await Purchase.findAll({
      offset: startIndex,
      limit: pageSize,
      include: [
        {
          model: Product,
          through: { attributes: ['quantity', 'unitValue'] }
        },
        User
      ],
      order: [ ['createdAt', 'DESC' ] ]
    });

    const totalCount = await Purchase.count();
    const totalPages = Math.ceil(totalCount / pageSize);

    res.status(200).json({
      data: purchases,
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
    products: [
      'required',
      function (value) {
        if (!Array.isArray(value)) {
          throw new Error('Products list should be array');
        }
      },
      function (value) {
        if (value.length <= 0) {
          throw new Error('Products list should be min 1 element');
        }
      },
      function (values) {
        if (!Array.isArray(values)) { return; }

        values.map((val, key) => {
          const schema = Joi.object({
            productId: Joi.number().required(),
            quantity: Joi.number().required().min(1)
          });

          const result = schema.validate(val);

          if (result.error) {
            throw new Error(`Element error ${key}: ` + result.error.details.map(v => v.message));
          }
        });
      }
    ]
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
    const { products } = req.body;
    const id = req.userAuth.id;
    
    const purchase = await Purchase.create({
      userId: id,
      productQuantity: products.length,
      totalPrice: 0
    });

    let price = 0;

    for (const productInfo of products) {
      const { productId, quantity } = productInfo;

      const product = await Product.findByPk(productId);

      if (!product) {
        await Purchase.update({ deletedAt: new Date() }, { where: { id: purchase.id} })
        return res.status(404).json({
          message: 'Error en la validación de datos',
          errors: {
            products: [
              `ProductId '${productId}' not found`
            ]
          }
        });
      }

      if (product.quantity < quantity) {
        await Purchase.update({ deletedAt: new Date() }, { where: { id: purchase.id} })
        return res.status(403).json({
          message: 'Error en la validación de datos',
          product: {
            id: productId,
            quantity: product.quantity
          },
          errors: {
            products: [
              `There is not enough stock for the product '${productId}'`
            ]
          }
        });
      }

      await ProductPurchase.create({
        productId,
        purchaseId: purchase.id,
        quantity,
        unitValue: product.price
      });

      await product.update({ quantity: product.quantity - quantity });
      price += product.price * quantity;
    }

    await purchase.update({ totalPrice: price + 10000 });

    res.status(201).json({
      message: '¡Compra realizada!'
    });
  } catch (e) {
    res.status(500).json({
      message: 'Error interno'
    });
  }
}

async function show(req, res) {
  try {
    const { id } = req.params;
    const userAuth = req.userAuth;

    const purchase = await Purchase.findOne({
      where: { 
        id: id,
        userId: userAuth.id
      },
      include: {
        model: Product,
        through: { attributes: ['quantity', 'unitValue'] }
      },
    });

    if (!purchase) {
      return res.status(404).json({
        message: 'Compra no encontrada'
      });
    }

    res.status(200).json(purchase);
  } catch (error) {
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
}

module.exports = {
  index,
  show,
  store
};
