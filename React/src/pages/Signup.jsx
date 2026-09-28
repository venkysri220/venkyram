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


function Signup() {

  const [form, setForm] =
    useState({
      name: "",
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
          "/auth/signup",
          {
            method: "POST",

            body:
              JSON.stringify(form)
          }
        );


      login(data);

      navigate("/");

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
        Student Signup
      </h1>


      {error && (

        <p className="error">
          {error}
        </p>

      )}


      <input
        placeholder="Name"
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
        Create Account
      </button>

    </form>
  );
}

export default Signup;