import { Button } from 'antd'
import React from 'react'
import './card.css'
import user from '../../assets/images/user.png'

function Card({details}) {

    const handleEdit = ()=>{
        console.log("clicked")
    }

  return (
    <div>
        <div className="card-content">
          <div className='card-header'>
            <div className='avatar'>BK</div>    {/* person/organization name ka avatar*/}
            <div className=''>{details?.title}</div>  {/* title */}
          </div>
          <div className='card-header'>
            <img src={user} alt='icon' className='user-icon'/>
            <div className=''>{details?.lead_type_value}</div>   {/* person/organization name */}
          </div>
          <div className='card-header' style={{justifyContent:'space-between'}}>
            <div className=''>{details?.description}</div>    {/* description */}
            <div className=''>$ {details?.deal_value}</div>  {/* sales value */}
          </div>
          <div style={{ display:'flex', justifyContent:'flex-end'}}>
            <div className='footer'>Created at: 10, May 2023</div>  {/* created at */}
          </div>
      </div>

    </div>
  )
}

export default Card