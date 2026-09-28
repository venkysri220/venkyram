import {
  useEffect,
  useState
} from "react";

import { api } from "../api";


const emptyForm = {

  name: "",

  category: "",

  price: "",

  description: "",

  image: "",

  available: true

};


function Admin() {

  const [foods, setFoods] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState(null);

  const [error, setError] =
    useState("");


  // Load food and orders
  const load = async () => {

    try {

      const [
        foodData,
        orderData
      ] = await Promise.all([

        api("/foods"),

        api("/orders")

      ]);


      setFoods(foodData);

      setOrders(orderData);

    } catch (error) {

      setError(
        error.message
      );
    }
  };


  useEffect(() => {

    load();

  }, []);


  // Add / Update food
  const submitFood =
    async (e) => {

      e.preventDefault();


      try {

        const body = {

          ...form,

          price:
            Number(form.price)

        };


        if (editingId) {

          await api(
            `/foods/${editingId}`,
            {
              method: "PUT",

              body:
                JSON.stringify(body)
            }
          );

        } else {

          await api(
            "/foods",
            {
              method: "POST",

              body:
                JSON.stringify(body)
            }
          );

        }


        setForm(
          emptyForm
        );

        setEditingId(null);

        load();

      } catch (error) {

        setError(
          error.message
        );
      }
    };


  // Edit food
  const editFood =
    (food) => {

      setEditingId(
        food._id
      );


      setForm({

        name: food.name,

        category:
          food.category,

        price:
          food.price,

        description:
          food.description,

        image:
          food.image,

        available:
          food.available

      });
    };


  // Delete food
  const deleteFood =
    async (id) => {

      if (
        !confirm(
          "Delete this food item?"
        )
      ) {

        return;
      }


      try {

        await api(
          `/foods/${id}`,
          {
            method:
              "DELETE"
          }
        );


        load();

      } catch (error) {

        setError(
          error.message
        );
      }
    };


  // Change order status
  const changeStatus =
    async (
      id,
      status
    ) => {

      try {

        await api(
          `/orders/${id}/status`,
          {

            method:
              "PATCH",

            body:
              JSON.stringify({
                status
              })

          }
        );


        load();

      } catch (error) {

        setError(
          error.message
        );
      }
    };


  return (

    <section>

      <h1>
        Admin Dashboard
      </h1>


      {error && (

        <p className="error">
          {error}
        </p>

      )}


      {/* Food management */}

      <div className="admin-section">

        <h2>

          {editingId
            ? "Update Food Item"
            : "Add Food Item"}

        </h2>


        <form
          className="form"
          onSubmit={
            submitFood
          }
        >

          <input
            placeholder="Food name"
            value={form.name}

            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value
              })
            }

            required
          />


          <input
            placeholder="Category"
            value={
              form.category
            }

            onChange={(e) =>
              setForm({
                ...form,
                category:
                  e.target.value
              })
            }

            required
          />


          <input
            placeholder="Price"
            type="number"
            min="0"
            value={form.price}

            onChange={(e) =>
              setForm({
                ...form,
                price:
                  e.target.value
              })
            }

            required
          />


          <input
            placeholder="Image URL"
            value={form.image}

            onChange={(e) =>
              setForm({
                ...form,
                image:
                  e.target.value
              })
            }
          />


          <textarea
            placeholder="Description"
            value={
              form.description
            }

            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value
              })
            }
          />


          <label>

            <input
              type="checkbox"
              checked={
                form.available
              }

              onChange={(e) =>
                setForm({
                  ...form,
                  available:
                    e.target.checked
                })
              }
            />

            Available

          </label>


          <button>

            {editingId
              ? "Update Food"
              : "Add Food"}

          </button>


          {editingId && (

            <button
              type="button"

              onClick={() => {

                setEditingId(
                  null
                );

                setForm(
                  emptyForm
                );

              }}
            >

              Cancel

            </button>

          )}

        </form>


        <h2>
          Food Items
        </h2>


        {foods.map(
          (food) => (

            <div
              className="cart-row"
              key={food._id}
            >

              <span>

                <b>
                  {food.name}
                </b>

                {" — ₹"}

                {food.price}

                {" — "}

                {food.category}

              </span>


              <span>

                <button
                  onClick={() =>
                    editFood(food)
                  }
                >
                  Edit
                </button>


                <button
                  onClick={() =>
                    deleteFood(
                      food._id
                    )
                  }
                >
                  Delete
                </button>

              </span>

            </div>

          )
        )}

      </div>


      {/* Order management */}

      <div className="admin-section">

        <h2>
          All Orders
        </h2>


        {orders.map(
          (order) => (

            <div
              className="order-card"
              key={order._id}
            >

              <p>

                <b>
                  Order:
                </b>{" "}

                {order._id}

              </p>


              <p>

                <b>
                  Student:
                </b>{" "}

                {order.user?.name}

                {" ("}

                {order.user?.email}

                {")"}

              </p>


              <p>

                <b>
                  Total:
                </b>{" "}

                ₹{order.totalAmount}

              </p>


              <p>

                <b>
                  Status:
                </b>{" "}

                {order.status}

              </p>


              <select

                value={
                  order.status
                }

                onChange={(e) =>
                  changeStatus(
                    order._id,
                    e.target.value
                  )
                }
              >

                <option>
                  PLACED
                </option>

                <option>
                  CONFIRMED
                </option>

                <option>
                  PREPARING
                </option>

                <option>
                  READY
                </option>

                <option>
                  COMPLETED
                </option>

                <option>
                  CANCELLED
                </option>

              </select>

            </div>

          )
        )}

      </div>

    </section>
  );
}

export default Admin;