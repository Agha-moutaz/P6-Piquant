
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const sauceRoutes = require ('./routes/sauce');
const userRoutes = require ('./routes/user');
const path = require('path');

mongoose.connect('mongodb+srv://mali:lyne2021@cluster0.wo9ixvt.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

var cors = require('cors')
app.use(cors())


app.use(express.json());

// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept,Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methodes', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     next();
// })

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app .use('/images', express.static(path.join(__dirname,'images')))



module.exports = app;
