const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/surveyDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Survey schema
const surveySchema = new mongoose.Schema({
  name: String,
  email: String,
  dob: String,
  contacts: String,
  food: [String], // Allow multiple food selections
  WatchMovies: String,
  ListenToradio: String,
  EatOut: String,
  WatchTV: String,
});

const Survey = mongoose.model('Survey', surveySchema);

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'Index.html'));
});

app.get('/view', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ViewResult.html'));
});

// Handle form submission
app.post('/submit', async (req, res) => {
  const formData = req.body;

  const newSurvey = new Survey({
    name: formData.name,
    email: formData.email,
    dob: formData.dob,
    contacts: formData.contacts,
    food: Array.isArray(formData.food) ? formData.food : [formData.food],
    WatchMovies: formData.q1,
    ListenToradio: formData.q2,
    EatOut: formData.q3,
    WatchTV: formData.q4,
  });

  try {
    await newSurvey.save();
    res.send('Survey submitted successfully!');
  } catch (error) {
    res.status(500).send('Error saving survey: ' + error.message);
  }
});

// Get survey results
app.get('/results', async (req, res) => {
  try {
    const surveys = await Survey.find();
    const totalSurveys = surveys.length;

    if (totalSurveys === 0) {
      return res.json({
        totalSurveys: 0,
        avgAge: 0,
        oldest: null,
        youngest: null,
        pizzaPercent: 0,
        pastaPercent: 0,
        papPercent: 0,
        rating: { q1: 0, q2: 0, q3: 0, q4: 0 },
      });
    }

    const today = new Date();
    const ages = surveys.map(s => {
      const dob = new Date(s.dob);
      return today.getFullYear() - dob.getFullYear();
    });

    const avgAge = (ages.reduce((a, b) => a + b, 0) / totalSurveys).toFixed(1);
    const maxAge = Math.max(...ages);
    const minAge = Math.min(...ages);

    // Fixed: Count food preferences properly
    const foodCount = { Pizza: 0, Pasta: 0, "Pap and Wors": 0 };
    surveys.forEach(s => {
      const foods = Array.isArray(s.food) ? s.food : [s.food];
      foods.forEach(f => {
        const cleaned = f.trim().toLowerCase();
        if (cleaned === 'pizza') foodCount.Pizza++;
        else if (cleaned === 'pasta') foodCount.Pasta++;
        else if (cleaned === 'pap and wors') foodCount["Pap and Wors"]++;
      });
    });

    const pizzaPercent = ((foodCount["Pizza"] / totalSurveys) * 100).toFixed(1);
    const pastaPercent = ((foodCount["Pasta"] / totalSurveys) * 100).toFixed(1);
    const papPercent = ((foodCount["Pap and Wors"] / totalSurveys) * 100).toFixed(1);

    // Ratings calculation
    const scale = {
      "Strongly Agree": 5,
      "Agree": 4,
      "Neutral": 3,
      "Disagree": 2,
      "Strongly Disagree": 1,
    };

    const getAvg = key => {
      const values = surveys.map(s => scale[s[key]] || 0).filter(n => n > 0);
      return values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1) : 0;
    };

    res.json({
      totalSurveys,
      avgAge,
      oldest: maxAge,
      youngest: minAge,
      pizzaPercent,
      pastaPercent,
      papPercent,
      rating: {
        q1: getAvg('WatchMovies'),
        q2: getAvg('ListenToradio'),
        q3: getAvg('EatOut'),
        q4: getAvg('WatchTV'),
      },
    });

  } catch (err) {
    res.status(500).send('Error retrieving data');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
  console.log(`📝 Survey form:     http://localhost:${PORT}/`);
  console.log(`📊 Survey results:  http://localhost:${PORT}/view`);
});
