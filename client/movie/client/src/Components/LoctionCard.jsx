import React from 'react'

function LoctionCard({Location}) {
  return (
    <div className="Location-card">
    <h3>{location_name}</h3>
    <img src={location_img} alt="" width={200} />
    <p>${price}</p> 
  </div>
  )
}

export default LoctionCard