import React from 'react'
import { signInWithEmailAndPassword, auth } from '../config/firebase'
import Loginform from "../componets/Loginform"
import { Link, useNavigate } from 'react-router-dom';

function Login() {

  let navigate = useNavigate()

  const signinuser = (values) => {
    signInWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/dashboard")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }



  return (
    <div style={{
        textAlign: "center"
    }}>
      <Loginform signinuser={signinuser}/>
    </div>
  )
}

export default Login
