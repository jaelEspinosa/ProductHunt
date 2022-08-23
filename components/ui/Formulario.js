import styled from '@emotion/styled'


export const Formulario = styled.form `
   max-width: 600px;
   width: 95%;
   margin:5rem auto 0 auto;
   
   fieldset{
      margin: 2rem 0;
      border:  1px solid #e1e1e1;
   }

`;

export const Campo = styled.div`
margin-bottom: 2rem;
display: flex;
align-items: center;

 label{
    flex: 0 0 150px;
    font-size: 1.8rem;

 }
 input, textarea{
    flex:1;
    padding: 1rem;
 }
 textarea{
   height: 300px;
 }
`;

export const Inputsubmit = styled.input `
 background-color: var(--naranja);
 width: 100%;
 padding: 1.5rem;
 text-align: center;
 color: white;
 font-size: 1.8rem;
 text-transform: uppercase;
 border: none;
 font-family: 'PT Sans', sans-serif;
 font-weight: 700;

   &:hover
{
    cursor: pointer;
}`;

export const Error = styled.p`
    background-color: red;
    padding: 0.3rem;
    font-family: 'PT Sans', sans-serif;
    font-weight: 700;
    font-size: 1.4rem;
    color:white;
    text-align: center;
    text-transform: uppercase;
    margin: 0.5rem 0;
    

`;

export const Exito = styled.p`
background-color: green;
    padding: 0.3rem;
    font-family: 'PT Sans', sans-serif;
    font-weight: 700;
    font-size: 1.4rem;
    color:white;
    text-align: center;
    text-transform: uppercase;
    margin: 0.5rem 0;
`;

export const Progress = styled.p`
    background-color: green;
    padding: 0.3rem 1rem;
    font-family: 'PT Sans', sans-serif;
    font-weight: 700;
    font-size: 1.4rem;
    color:white;
    text-align: center;
    text-transform: uppercase;
    margin: 0.5rem 0;
    border-radius: 5px;
`;
export const Progress1 = styled.p`
    background-color: orange;
    padding: 0.3rem 1rem;
    font-family: 'PT Sans', sans-serif;
    font-weight: 700;
    font-size: 1.4rem;
    color:white;
    text-align: center;
    text-transform: uppercase;
    margin: 0.5rem 0;
    border-radius: 5px;
`;


