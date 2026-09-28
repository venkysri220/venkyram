const express = require("express");

const Order = require("../models/Order");

const Food = require("../models/Food");

const {
  protect,
  adminOnly
} = require("../middleware/auth");


const router =
  express.Router();


/*
  STUDENT PLACE ORDER
*/

router.post(
  "/",

  protect,

  async (req, res) => {

    try {

      const {
        items
      } = req.body;


      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {

        return res.status(400).json({

          message:
            "Cart is empty"

        });
      }


      const foodIds =
        items.map(
          (item) =>
            item.food
        );


      const foods =
        await Food.find({

          _id: {
            $in: foodIds
          },

          available:
            true

        });


      if (
        foods.length !==
        foodIds.length
      ) {

        return res.status(400).json({

          message:
            "One or more food items are unavailable"

        });
      }


      const orderItems =
        items.map(
          (item) => {

            const food =
              foods.find(
                (f) =>
                  String(f._id) ===
                  String(item.food)
              );


            const quantity =
              Number(
                item.quantity
              );


            if (
              !Number.isInteger(
                quantity
              ) ||
              quantity < 1
            ) {

              throw new Error(
                "Invalid quantity"
              );
            }


            return {

              food:
                food._id,

              name:
                food.name,

              price:
                food.price,

              quantity

            };

          }
        );


      const totalAmount =
        orderItems.reduce(

          (total, item) =>

            total +
            item.price *
              item.quantity,

          0

        );


      const order =
        await Order.create({

          user:
            req.user._id,

          items:
            orderItems,

          totalAmount

        });


      res.status(201).json(
        order
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
  STUDENT ORDER HISTORY
*/

router.get(
  "/my",

  protect,

  async (req, res) => {

    try {

      const orders =
        await Order.find({

          user:
            req.user._id

        })

        .populate(
          "user",
          "name email"
        )

        .sort({
          createdAt: -1
        });


      res.json(orders);

    } catch (error) {

      res.status(500).json({

        message:
          error.message

      });
    }
  }
);


/*
  GET SINGLE ORDER
*/

router.get(
  "/:id",

  protect,

  async (req, res) => {

    try {

      const order =
        await Order.findById(
          req.params.id
        )

        .populate(
          "user",
          "name email"
        );


      if (!order) {

        return res.status(404).json({

          message:
            "Order not found"

        });
      }


      if (

        req.user.role !==
          "ADMIN" &&

        String(
          order.user._id
        ) !==
          String(
            req.user._id
          )

      ) {

        return res.status(403).json({

          message:
            "You are not allowed to view this order"

        });
      }


      res.json(order);

    } catch (error) {

      res.status(400).json({

        message:
          error.message

      });
    }
  }
);


/*
  ADMIN VIEW ALL ORDERS
*/

router.get(
  "/",

  protect,

  adminOnly,

  async (req, res) => {

    try {

      const orders =
        await Order.find()

        .populate(
          "user",
          "name email"
        )

        .sort({
          createdAt: -1
        });


      res.json(orders);

    } catch (error) {

      res.status(500).json({

        message:
          error.message

      });
    }
  }
);


/*
  ADMIN CHANGE ORDER STATUS
*/

router.patch(
  "/:id/status",

  protect,

  adminOnly,

  async (req, res) => {

    try {

      const allowedStatuses = [

        "PLACED",

        "CONFIRMED",

        "PREPARING",

        "READY",

        "COMPLETED",

        "CANCELLED"

      ];


      const {
        status
      } = req.body;


      if (
        !allowedStatuses.includes(
          status
        )
      ) {

        return res.status(400).json({

          message:
            "Invalid order status"

        });
      }


      const order =
        await Order.findByIdAndUpdate(

          req.params.id,

          {
            status
          },

          {
            new: true
          }

        );


      if (!order) {

        return res.status(404).json({

          message:
            "Order not found"

        });
      }


      res.json(order);

    } catch (error) {

      res.status(400).json({

        message:
          error.message

      });
    }
  }
);


module.exports = router;