const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dashboardRoute = require('./routes/dashboard');
const analyticsRoutes = require('./routes/analyticsRoutes'); // Import analytics routes
const applicantsRoute = require('./routes/applicants');
const jobsAnalyticsRoute = require('./routes/jobAnalyticsRoutes')
const freshLeadsRoutes = require("./routes/freshLeadsRoutes");




const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend URL
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve static files from the 'public' directory
app.set('view engine', 'ejs'); // Set EJS as the templating engine

// Use dashboard routes for main routes
app.use('/', dashboardRoute);

// Use analytics routes for API
app.use('/api/user-analytics', analyticsRoutes);

app.use('/api/applicants', applicantsRoute); // Use the applicants routes

app.use('/api/job-analytics', jobsAnalyticsRoute);

app.use("/api/fresh-leads", freshLeadsRoutes);


// MongoDB connection URI
const dbURI = 'mongodb+srv://develup:ErTOHk7NrQdqsV3w@develup.twn8z.mongodb.net/Develup?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// Routes
app.get('/', (req, res) => {
  res.sender('index'); // Render a basic homepage
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

