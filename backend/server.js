const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const courseRoutes = require('./routes/courses');
const registrationRoutes = require('./routes/registration');

app.use('/api/courses', courseRoutes);
app.use('/api/registrations', registrationRoutes);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.get('/', (req, res) => res.send('API Running'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
