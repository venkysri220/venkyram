require("dotenv").config();


const express =
  require("express");

const cors =
  require("cors");


const connectDB =
  require("./config/db");


const authRoutes =
  require("./routes/authRoutes");

const foodRoutes =
  require("./routes/foodRoutes");

const orderRoutes =
  require("./routes/orderRoutes");


// Connect MongoDB
connectDB();


const app =
  express();


// Middleware
app.use(
  cors()
);

app.use(
  express.json()
);


// Test API
app.get(
  "/",
  (req, res) => {

    res.json({

      message:
        "Online Canteen API is running"

    });

  }
);


// Routes
app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/foods",
  foodRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);


// Server
const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,

  () => {

    console.log(
      `Server running on http://localhost:${PORT}`
    );

  }
);