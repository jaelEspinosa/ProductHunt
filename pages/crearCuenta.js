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
import validarCrearCuenta from "../validacion/validarCrearCuenta";

const STATE_INICIAL = {
  nombre: "",
  email: "",
  password: "",
};

const CrearCuenta = () => {

  const [errorCorreo, setErrorCorreo] = useState('')
  const [exito, setExito] = useState('')
 
  const crearCuenta = async () => {
   
    try {
    await firebase.signUp(nombre, email, password);
    setExito('Cuenta Registrada con éxito')
    
    setTimeout(() => {
      setExito('')
      Router.push('/')
    }, 1500);
     
    } catch (error) {
           
      if (error.message.includes('auth/email-already-in-use')){
        setErrorCorreo('este email, ya registrado en otra cuenta');
      }
  
    }


  };
  const { valores, errores, submitForm, handleSubmit, handleChange, handleOnblur,handleKeyDown } =
    useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

  const { nombre, email, password } = valores;

  return (
    <div>
      <Layout>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >
          Crear Cuenta
        </h1>
        <Formulario onSubmit={handleSubmit} noValidate>
          <Campo>
            <label htmlFor="nombre">Nombre</label>

            <input
              type="text"
              id="nombre"
              placeholder="tu Nombre"
              name="nombre"
              value={nombre}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Campo>
          {errores?.nombre && <Error>{errores.nombre}</Error>}
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
          {errorCorreo && <Error>{errorCorreo}</Error>}
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
          <Inputsubmit type="submit" value="Crear Cuenta" />
        </Formulario>
      </Layout>
    </div>
  );
};

export default CrearCuenta;
