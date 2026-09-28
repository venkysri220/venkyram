const express = require("express");

const Food = require("../models/Food");

const {
  protect,
  adminOnly
} = require("../middleware/auth");


const router =
  express.Router();


/*
  GET FOOD MENU

  Example:
  GET /api/foods

  Search:
  GET /api/foods?search=biryani
*/

router.get(
  "/",

  async (req, res) => {

    try {

      const search =
        req.query.search || "";


      const foods =
        await Food.find({

          name: {
            $regex:
              search,

            $options:
              "i"
          }

        }).sort({
          createdAt: -1
        });


      res.json(foods);

    } catch (error) {

      res.status(500).json({

        message:
          error.message

      });
    }
  }
);


/*
  ADMIN ADD FOOD
*/

router.post(
  "/",

  protect,

  adminOnly,

  async (req, res) => {

    try {

      const food =
        await Food.create(
          req.body
        );


      res.status(201).json(
        food
      );

    } catch (error) {

      res.status(400).json({

        message:
          error.message

      });
    }
  }
);


/*
  ADMIN UPDATE FOOD
*/

router.put(
  "/:id",

  protect,

  adminOnly,

  async (req, res) => {

    try {

      const food =
        await Food.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,

            runValidators:
              true
          }
        );


      if (!food) {

        return res.status(404).json({

          message:
            "Food item not found"

        });
      }


      res.json(food);

    } catch (error) {

      res.status(400).json({

        message:
          error.message

      });
    }
  }
);


/*
  ADMIN DELETE FOOD
*/

router.delete(
  "/:id",

  protect,

  adminOnly,

  async (req, res) => {

    try {

      const food =
        await Food.findByIdAndDelete(
          req.params.id
        );


      if (!food) {

        return res.status(404).json({

          message:
            "Food item not found"

        });
      }


      res.json({

        message:
          "Food item deleted"

      });

    } catch (error) {

      res.status(400).json({

        message:
          error.message

      });
    }
  }
);


module.exports = router;