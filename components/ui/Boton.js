import styled from '@emotion/styled'


const Boton = styled.a`
  display: block;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid #d1d1d1;
  padding: 0.8rem 2rem;
  margin-right: 1rem;
  margin: 2rem auto;
  text-align: center;
  background-color: ${props => props.bgColor ? '#DA552f' : 'white'};
  color: ${props => props.bgColor ? 'white' : '#000'};
  font-size: 2rem;
  @media (min-width: 768px){
    font-size: 1.5rem;
  }
  &:hover{
    cursor: pointer;
  }
  &:last-of-type{
    margin-right: 0;

  }
`;


export default Boton