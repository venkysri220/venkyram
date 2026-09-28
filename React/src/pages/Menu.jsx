import {
  useEffect,
  useState
} from "react";

import { api } from "../api";

import { useCart } from "../context/CartContext";


function Menu() {

  const [foods, setFoods] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [error, setError] =
    useState("");


  const {
    addToCart
  } = useCart();


  // Get foods
  const loadFoods = async (
    searchText = ""
  ) => {

    try {

      const data = await api(
        `/foods?search=${encodeURIComponent(
          searchText
        )}`
      );

      setFoods(data);

    } catch (error) {

      setError(error.message);
    }
  };


  useEffect(() => {

    loadFoods();

  }, []);


  return (

    <section>

      <h1>
        Food Menu
      </h1>


      {/* Search */}

      <input
        className="search"
        placeholder="Search food..."
        value={search}

        onChange={(e) => {

          setSearch(e.target.value);

          loadFoods(
            e.target.value
          );

        }}
      />


      {error && (

        <p className="error">
          {error}
        </p>

      )}


      {/* Food cards */}

      <div className="grid">

        {foods.map((food) => (

          <div
            className="card"
            key={food._id}
          >

            {food.image && (

              <img
                src={food.image}
                alt={food.name}
                className="food-image"
              />

            )}


            <h3>
              {food.name}
            </h3>


            <p>
              {food.description}
            </p>


            <p>
              <b>
                Category:
              </b>{" "}
              {food.category}
            </p>


            <p>
              <b>
                ₹{food.price}
              </b>
            </p>


            <button
              disabled={!food.available}

              onClick={() =>
                addToCart(food)
              }
            >

              {food.available
                ? "Add to Cart"
                : "Unavailable"}

            </button>

          </div>

        ))}

      </div>

    </section>
  );
}

export default Menu;