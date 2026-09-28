import { useNavigate } from "react-router-dom";

import { api } from "../api";

import {
  useCart
} from "../context/CartContext";

import {
  useAuth
} from "../context/AuthContext";


function Cart() {

  const {
    cart,
    increase,
    decrease,
    clearCart,
    total
  } = useCart();


  const {
    user
  } = useAuth();


  const navigate =
    useNavigate();


  // Place order
  const placeOrder = async () => {

    if (!user) {

      navigate("/login");

      return;
    }


    try {

      await api(
        "/orders",
        {
          method: "POST",

          body: JSON.stringify({

            items: cart.map(
              (item) => ({

                food: item._id,

                quantity:
                  item.quantity

              })
            )

          })
        }
      );


      clearCart();

      alert(
        "Order placed successfully!"
      );

      navigate("/orders");

    } catch (error) {

      alert(
        error.message
      );
    }
  };


  if (cart.length === 0) {

    return (

      <h2>
        Your cart is empty.
      </h2>

    );
  }


  return (

    <section>

      <h1>
        My Cart
      </h1>


      {cart.map((item) => (

        <div
          className="cart-row"
          key={item._id}
        >

          <div>

            <b>
              {item.name}
            </b>

            <p>
              ₹{item.price} ×{" "}
              {item.quantity}
            </p>

          </div>


          <div>

            <button
              onClick={() =>
                decrease(item._id)
              }
            >
              -
            </button>


            <span className="qty">
              {item.quantity}
            </span>


            <button
              onClick={() =>
                increase(item._id)
              }
            >
              +
            </button>

          </div>

        </div>

      ))}


      <h2>
        Total: ₹{total}
      </h2>


      <button
        onClick={placeOrder}
      >
        Place Order
      </button>

    </section>
  );
}

export default Cart;