import React from 'react'

const Helmet = (props) => {
    document.title = 'MSM Angadi - ' + props.title
  return (
    <div className='w-100' >{props.childern}</div>
  )
}

export default Helmet