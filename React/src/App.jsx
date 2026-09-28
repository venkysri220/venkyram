import {
  Link,
  Route,
  Routes
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";


function App() {

  const {
    user,
    logout
  } = useAuth();


  return (

    <>

      {/* Navigation */}

      <nav className="navbar">

        <Link
          to="/"
          className="brand"
        >
          College Canteen
        </Link>


        <div className="nav-links">

          <Link to="/">
            Menu
          </Link>


          {user && (

            <Link to="/cart">
              Cart
            </Link>

          )}


          {user && (

            <Link to="/orders">
              My Orders
            </Link>

          )}


          {user?.role === "ADMIN" && (

            <Link to="/admin">
              Admin
            </Link>

          )}


          {!user ? (

            <>

              <Link to="/login">
                Login
              </Link>

              <Link to="/signup">
                Signup
              </Link>

            </>

          ) : (

            <button
              onClick={logout}
            >
              Logout
            </button>

          )}

        </div>

      </nav>


      {/* Pages */}

      <main className="container">

        <Routes>

          <Route
            path="/"
            element={<Menu />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/signup"
            element={<Signup />}
          />

          <Route
            path="/admin"
            element={<Admin />}
          />

        </Routes>

      </main>

    </>
  );
}

export default App;