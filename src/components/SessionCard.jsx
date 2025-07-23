import React from 'react'

export const SessionCard = ({color, day="23", month="Ene", year="", hourStart="16:00:00",final_day, final_month, final_year, hourFinal, body}) => {
  const meses = [" ", "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]  
  
  return (
    <div className="card col-lg-3 col-md-5 col-sm-5 col-10 p-0 shadow-sm mt-3 pb-0 px-0 mx-2">
      {/* Ubicacion  */}
      <div className={`card-header bg-${color} text-${color =="white"? "dark":"white"} p-0`}>
        <p className="m-0 px-4 text-center" 
        // style={{ maxWidth: "500px" }}
        >{body}</p>
      </div>

      {/* Cuerpo  */}
      <div className="d-flex flex-row col-12">
        {/* Comienzo  */}
        <div className='d-flex flex-column flex-nowrap col-6 m-0 p-4'>
          <h5 className="fw-bold mb-1">{day} {meses[month]}</h5>
          <p className="text-muted" 
          // style={{ maxWidth: "500px" }}
          >{hourStart}</p>
          <small>{year}</small>
        </div>
        {/* Final  */}
        <div className='bg-dark text-white d-flex flex-column flex-nowrap col-6 m-0 p-4 border-radius rounded-bottom'>
          <h5 className="fw-bold mb-1">{final_day} {meses[final_month]}</h5>
          <p className="" 
          // style={{ maxWidth: "500px" }}
          >{hourFinal}</p>
          <small>{final_year}</small>
        </div>
      </div>
    </div>
  );
}
