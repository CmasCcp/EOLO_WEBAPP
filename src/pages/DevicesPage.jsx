import React, { useEffect } from 'react'

export const DevicesPage = () => {

    useEffect(()=>{

        const fetchData =async()=>{

            try{
                const response = await fetch("https://api-sensores.cmasccp.cl/listarDatos?tabla=dispositivos")
                console.log(response);
            }catch{
                console.log("errr")
            }
            
        }

        fetchData();
    }, [])

  return (
    <div>DevicesPage</div>
  )
}
