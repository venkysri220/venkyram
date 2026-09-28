import {
  createContext,
  useContext,
  useState
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  const [cart, setCart] = useState([]);


  // Add food
  const addToCart = (food) => {

    setCart((currentCart) => {

      const existingItem =
        currentCart.find(
          (item) =>
            item._id === food._id
        );


      if (existingItem) {

        return currentCart.map((item) =>

          item._id === food._id

            ? {
                ...item,
                quantity:
                  item.quantity + 1
              }

            : item
        );
      }


      return [
        ...currentCart,

        {
          ...food,
          quantity: 1
        }
      ];
    });
  };


  // Increase quantity
  const increase = (id) => {

    setCart((currentCart) =>

      currentCart.map((item) =>

        item._id === id

          ? {
              ...item,
              quantity:
                item.quantity + 1
            }

          : item
      )
    );
  };


  // Decrease quantity
  const decrease = (id) => {

    setCart((currentCart) =>

      currentCart

        .map((item) =>

          item._id === id

            ? {
                ...item,
                quantity:
                  item.quantity - 1
              }

            : item
        )

        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };


  // Clear cart
  const clearCart = () => {

    setCart([]);
  };


  // Total price
  const total = cart.reduce(

    (sum, item) =>

      sum +
      item.price *
        item.quantity,

    0
  );


  return (

    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increase,
        decrease,
        clearCart,
        total
      }}
    >

      {children}

    </CartContext.Provider>
  );
}


export const useCart = () =>
  useContext(CartContext);