import { css } from "@emotion/react";
import React, { useState } from "react";
import Router from 'next/router'
import Layout from "../components/layout/Layout";
import firebase from "../firebase";
import {
  Campo,
  Error,
  Exito,
  Formulario,
  Inputsubmit,
} from "../components/ui/Formulario";

// validaciones
import useValidacion from "../hooks/useValidacion";
import validarIniciarSesion from "../validacion/validarIniciarSesion";
const STATE_INICIAL = {
  email: "",
  password: "",
};



const Login = () => {

  const [errorLogin, setErrorLogin] = useState('')
  const [exito, setExito] = useState('')
 
 const iniciarSesion =  async ()=>{
  try {
    await firebase.login(email, password)
   
    setExito('Sesión iniciada')
    
    setTimeout(() => {
      setExito('')
      Router.push('/')
    }, 1000);
  } catch (error) {
    console.log(error.message)
    if (error.message.includes('wrong-password')){
      setErrorLogin('Password no válido')
    }else if (error.message.includes('user-not-found')){
      setErrorLogin('usuario no registrado o cuenta inválida')
    }
  }
 }
  const { valores, errores, submitForm, handleSubmit, handleChange, handleKeyDown } =
    useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

  const { email, password } = valores;

  return (
    <div>
      <Layout>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >
          Iniciar Sesión
        </h1>
        <Formulario onSubmit={handleSubmit} noValidate>
         
          <Campo>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Tu Email"
              name="email"
              value={email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Campo>
          {errores?.email && <Error>{errores.email}</Error>}
          {errorLogin && <Error>{errorLogin}</Error>}
          <Campo>
            <label htmlFor="password">password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Campo>
          {errores?.password && <Error>{errores.password}</Error>}
          {exito && <Exito>{exito}</Exito>}
          <Inputsubmit type="submit" value="Iniciar Sesión" />
        </Formulario>
      </Layout>
    </div>
  );
};

export default Login;
