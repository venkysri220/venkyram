import {
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import { api } from "../api";

import {
  useAuth
} from "../context/AuthContext";


function Login() {

  const [form, setForm] =
    useState({
      email: "",
      password: ""
    });


  const [error, setError] =
    useState("");


  const {
    login
  } = useAuth();


  const navigate =
    useNavigate();


  const submit = async (e) => {

    e.preventDefault();


    try {

      const data =
        await api(
          "/auth/login",
          {
            method: "POST",

            body:
              JSON.stringify(form)
          }
        );


      login(data);


      if (
        data.user.role ===
        "ADMIN"
      ) {

        navigate("/admin");

      } else {

        navigate("/");

      }

    } catch (error) {

      setError(
        error.message
      );
    }
  };


  return (

    <form
      className="form"
      onSubmit={submit}
    >

      <h1>
        Login
      </h1>


      {error && (

        <p className="error">
          {error}
        </p>

      )}


      <input
        placeholder="Email"
        type="email"
        value={form.email}

        onChange={(e) =>
          setForm({
            ...form,
            email:
              e.target.value
          })
        }

        required
      />


      <input
        placeholder="Password"
        type="password"
        value={form.password}

        onChange={(e) =>
          setForm({
            ...form,
            password:
              e.target.value
          })
        }

        required
      />


      <button>
        Login
      </button>

    </form>
  );
}

export default Login;