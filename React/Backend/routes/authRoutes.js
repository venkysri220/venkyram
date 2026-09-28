const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");


const router =
  express.Router();


const createToken = (id) => {

  return jwt.sign(
    { id },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d"
    }
  );
};


/*
  STUDENT SIGNUP
*/

router.post(
  "/signup",

  async (req, res) => {

    try {

      const {
        name,
        email,
        password
      } = req.body;


      if (
        !name ||
        !email ||
        !password
      ) {

        return res.status(400).json({

          message:
            "All fields are required"

        });
      }


      const existingUser =
        await User.findOne({
          email
        });


      if (existingUser) {

        return res.status(400).json({

          message:
            "Email already registered"

        });
      }


      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );


      const user =
        await User.create({

          name,

          email,

          password:
            hashedPassword,

          role:
            "STUDENT"

        });


      res.status(201).json({

        message:
          "Signup successful",

        token:
          createToken(
            user._id
          ),

        user: {

          id: user._id,

          name: user.name,

          email: user.email,

          role: user.role

        }

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message

      });
    }
  }
);


/*
  LOGIN
*/

router.post(
  "/login",

  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;


      if (
        !email ||
        !password
      ) {

        return res.status(400).json({

          message:
            "Email and password are required"

        });
      }


      const user =
        await User.findOne({
          email
        });


      if (!user) {

        return res.status(401).json({

          message:
            "Invalid email or password"

        });
      }


      const passwordMatch =
        await bcrypt.compare(
          password,
          user.password
        );


      if (!passwordMatch) {

        return res.status(401).json({

          message:
            "Invalid email or password"

        });
      }


      res.json({

        message:
          "Login successful",

        token:
          createToken(
            user._id
          ),

        user: {

          id: user._id,

          name: user.name,

          email: user.email,

          role: user.role

        }

      });

    } catch (error) {

      res.status(500).json({

        message:
          error.message

      });
    }
  }
);


module.exports = router;