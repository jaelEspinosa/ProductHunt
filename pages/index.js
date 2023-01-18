import { useContext, useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { collection, getDocs } from "firebase/firestore";
import { FirebaseContext } from "../firebase";
import DetallesProducto from "../components/layout/DetallesProducto";
import Spinner from "../components/layout/Spinner";
import Link from "next/link";
import styled from "@emotion/styled";
import useAutenticacion from "../hooks/useAutenticacion";


const Enlaces = styled.a`
    border: 2px solid gray;
    padding: 5px;
    border-radius: 10px;
    font-size: 32px;
    color:gray;
    text-transform: capitalize;
    transition: .5s;
    cursor: pointer;
&:hover{
  background-color: darkgray;
}

`;

export default function Home() {
  /* const [productos, setProductos] = useState([]); */
  const [cargando, setCargando] = useState(false);
  const { firebase, productos, setProductos, cargarState, setCargarState } =
    useContext(FirebaseContext);

  const  usuario  = useAutenticacion();

  console.log("usuario desde index: ", usuario?.displayName);

  const [isLogged, setIsLogged] = useState(false);

  let orderedArray = [];

  useEffect(() => {
    const obtenerProductos = async () => {

      setCargando(true);

      if (usuario?.displayName) {
        setIsLogged(true);
      }
      try {
        const querySnapShot = await getDocs(
          collection(firebase.db, "productos")
        );

        const productos = querySnapShot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          };
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
        orderedArray = productos.sort((a, b) => {
          if (a.creado > b.creado) {
            return -1;
          }
          if (a.creado < b.creado) {
            return 1;
          }
        });
      } catch (error) {
        console.log(error);
        setIsLogged(false);
      }

      setProductos(orderedArray);
      setCargando(false);
      setCargarState(false);
    };
    obtenerProductos();
  }, [cargarState, usuario]);

  return (
    <div>
      <Layout>
        {cargando ? (
          <Spinner />
        ) : !isLogged ? (
          <div style={{ height:'75vh', display:'flex', flexDirection:'column',gap:'50px', alignItems:'center', justifyContent:'center'}}>
            <h1 style={{textAlign:'center', color:'gray'}}>Logeate o Crea una Cuenta</h1>
            <p style={{fontSize:'16px', color:'gray'}} >Para poder ver los contenidos deberás estar logeado</p>
            <p style={{fontSize:'16px', color:'gray'}} >Una nueva cuenta se crea en 10 segundos.</p>
           <div style={{ marginTop:'1px' ,display:'flex', flexdirection:'row', alingItems:'center', justifyContent:'center', gap:'25px'}}>
           <Link href={'/login'}>
              <Enlaces style={{fontSize:'32px',color:'gray', textTransform:'capitalize' }}>Login</Enlaces>
            </Link>
            <Link href={'/crearCuenta'}>
              <Enlaces className="enlaces">Nueva Cuenta</Enlaces>
            </Link>
           </div>
            
          </div>
        ) : (
          <div className="listado-productos">
            <div className="contenedor">
              <ul className="bg-white">
                {productos.map((producto, i) => (
                  <DetallesProducto key={producto.id} producto={producto} />
                ))}
              </ul>
            </div>
          </div>
        )}
      </Layout>
    </div>
  );
}
