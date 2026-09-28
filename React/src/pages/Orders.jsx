import {
  useEffect,
  useState
} from "react";

import { api } from "../api";


function Orders() {

  const [orders, setOrders] =
    useState([]);

  const [error, setError] =
    useState("");


  useEffect(() => {

    api("/orders/my")

      .then((data) => {

        setOrders(data);

      })

      .catch((error) => {

        setError(
          error.message
        );

      });

  }, []);


  return (

    <section>

      <h1>
        Order History
      </h1>


      {error && (

        <p className="error">
          {error}
        </p>

      )}


      {orders.length === 0 &&
        !error && (

          <p>
            No orders yet.
          </p>

        )}


      {orders.map((order) => (

        <div
          className="order-card"
          key={order._id}
        >

          <h3>
            Order ID:
            {" "}
            {order._id}
          </h3>


          <p>

            <b>
              Status:
            </b>{" "}

            {order.status}

          </p>


          <p>

            <b>
              Total:
            </b>{" "}

            ₹{order.totalAmount}

          </p>


          <ul>

            {order.items.map(
              (item) => (

                <li
                  key={item.food}
                >

                  {item.name}
                  {" × "}
                  {item.quantity}

                  {" = ₹"}

                  {item.price *
                    item.quantity}

                </li>

              )
            )}

          </ul>


          <small>

            {new Date(
              order.createdAt
            ).toLocaleString()}

          </small>

        </div>

      ))}

    </section>
  );
}

export default Orders;