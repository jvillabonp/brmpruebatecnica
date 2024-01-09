require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./src/config/database');
const routes = require('./src/routes');
const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views');

// Middlewares
app.use((req, res, next) => {
  bodyParser.json()(req, res, err => {
    if (err) {
      return res.status(400).json({ message: 'Incorrect JSON format' });
    }

    next();
  });
});

app.use('', routes);
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not found' });
});

const PORT = process.env.PORT || 3000;

// Sincronizar con la base de datos
sequelize.sync()
  .then(() => {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.trim() == '') {
      throw new Error('Añade la varibale de entorno JWT_SECRET');
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });