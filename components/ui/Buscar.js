import React, { useState } from 'react'
import styled from '@emotion/styled';
import {css } from '@emotion/react';
import  Router  from 'next/router';


const InputText = styled.input`
 /*  border-bottom: 1px solid var(--gris3); */
  border:none;
  border-bottom: 2px solid black;
  padding: 1rem;
  padding-right: 5rem;
  min-width: 300px;
  font-size: 2.2rem;
  :focus {
    outline: none;
  }
  
`;

const InputSubmit = styled.button`
  height: 3rem;
  width: 3rem;
  display: block;
  background-size: 4rem;
  background-image: url('/static/img/buscar.png');
  background-repeat: no-repeat;
  position: absolute;
  right: 2rem;
  top: 1px;
  background-color: white;
  border: none;
  &:hover{
    cursor: pointer;
  }
`;


const Buscar = () => {
  const [busqueda, setBusqueda] = useState('')

  const buscarProducto = e =>{
    e.preventDefault()
    if(busqueda.trim() === '')return;
    
    Router.push({
    pathname: '/buscar',
    query:{
       q:busqueda
    }
    })
  }

  return (
    <form css = {css ` 
          position: relative;
    `}
    onSubmit={buscarProducto}
    >

        <InputText
        placeholder='Buscar Productos'
        onChange={e => setBusqueda(e.target.value)}
         type='text'/>

        <InputSubmit type='submit'></InputSubmit>
    </form>
  )
}

export default Buscar