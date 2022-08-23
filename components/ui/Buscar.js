import React from 'react'
import styled from '@emotion/styled';
import {css } from '@emotion/react';


const InputText = styled.input`
  border: 1px solid var(--gris3);
  padding: 1rem;
  min-width: 100px;
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
  return (
    <form css = {css `
          position: relative;
    `}>

        <InputText
        placeholder='Buscar Productos'
         type='text'/>

        <InputSubmit type='submit'></InputSubmit>
    </form>
  )
}

export default Buscar