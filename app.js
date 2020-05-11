const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

const provinceRoutes = require('./api/routes/provinces');
const districtRoutes = require('./api/routes/districts');
const accountRoutes = require('./api/routes/accounts');
const userRoutes = require('./api/routes/users');
const feedbackRoutes = require('./api/routes/feedbacks');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/provinces', provinceRoutes);
app.use('/districts', districtRoutes);
app.use('/accounts', accountRoutes);
app.use('/users', userRoutes);
app.use('/feedbacks', feedbackRoutes);

module.exports = app;