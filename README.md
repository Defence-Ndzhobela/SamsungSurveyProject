# Survey App

A simple web application that collects survey responses from users and stores the data in a MongoDB database. It also provides a results page that summarizes the collected data with statistical analysis.

## Features

- Users can:
  - Fill out a survey form
  - Select their favorite food (multiple selections allowed)
  - Rate activities like watching movies, eating out, etc.
- Admins (or viewers) can:
  - View a summary of results including:
    - Total responses
    - Average age
    - Food preference percentages
    - Average ratings per activity

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Tools**: Body-parser, CORS

## Project Structure
project/
│
├── public/
│ ├── Index.html # Survey form page
│ ├── ViewResult.html # Results summary page
│ ├── Style.css # Stylesheet
│ └── Sumsang.js # Optional JS (for dynamic actions)
│
├── server.js # Express backend server
├── package.json
└── README.md
