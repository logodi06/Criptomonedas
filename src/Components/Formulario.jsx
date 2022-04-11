import {useEffect, useState} from 'react';
import styled from '@emotion/styled';
import { useSelectMonedas } from '../hooks/useSelectMonedas';
import { monedas } from '../Data/monedas';
import { Error } from './Error';

const InputSubmit = styled.input`
    background-color: #9497FF;
    border: none;
    width: 100%;
    padding: 10px;
    color: #FFF;
    font-weight: 700;
    text-transform: uppercase;
    font-size: 20px;
    border-radius: 5px;
    transition: background-color .3s ease;
    margin-top: 30px;
    &:hover {
        background-color: #7A7DFE;
        cursor: pointer;
    } 
`

export const Formulario = ( {setMonedas} ) => { 

    const [criptos, setCriptos] = useState([]);

    //al ser arreglos, se puede definir el nombre que sea porque el arreglo no retorna valor por nombre,
    //si no por indice (posición).
    const [moneda, SelectMonedas] = useSelectMonedas('Elige tu moneda', monedas);
    const [criptomoneda, SelectCriptomoneda] = useSelectMonedas('Elige tu Criptomoneda', criptos);
    const [error, setError] = useState(false);

    useEffect(() => {
        const consultaAPI  = async () => {
            const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';
            const resp = await fetch(url);
            const {Data} = await resp.json();
            
            const arrayCriptos = Data.map( cripto => {
                const objeto =  {
                    id: cripto.CoinInfo.Name,
                    nombre: cripto.CoinInfo.FullName
                }
                return objeto;
            });
           
            setCriptos(arrayCriptos);
        }

        consultaAPI();
    }, [])

    const handleSubmit =  e  =>{
        e.preventDefault();

        if([moneda, criptomoneda].includes('') ){
            setError(true);
            return;
        }

        setError(false);
        setMonedas( {
            moneda,
            criptomoneda
        } );
    }

    return (
        <>
            { error && <Error>Todos los campos son obligatorios</Error> }
            <form onSubmit={ handleSubmit }>
                <SelectMonedas />
                <SelectCriptomoneda />
                    
                <InputSubmit type="submit" value="Cotizar" />
            </form>
        </>
    )
}
