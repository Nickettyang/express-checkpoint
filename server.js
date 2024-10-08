const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files (like CSS)
app.use(express.static(path.join(__dirname, "public")));

// Middleware to check working hours
const workingHoursMiddleware = (req, res, next) => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const hour = now.getHours();

  // Check if it's Monday to Friday (1 to 5) and between 9 AM and 5 PM
  if (day >= 1 && day <= 5 && hour >= 9 && hour < 17) {
    next();
  } else {
    res
      .status(403)
      .send(
        "The application is only available during working hours (Monday to Friday, 9 AM to 5 PM)."
      );
  }
};

// Apply the middleware to all routes
app.use(workingHoursMiddleware);

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/services", (req, res) => {
  res.render("services");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
