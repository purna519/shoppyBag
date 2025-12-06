import React from 'react'

export default function Spinner({ size = 'sm' }){
  const dim = size === 'lg' ? 32 : 18
  return <div className="spinner-border text-light" role="status" style={{width:dim, height:dim}}></div>
}
