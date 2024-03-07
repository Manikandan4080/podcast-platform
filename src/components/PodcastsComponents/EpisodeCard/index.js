import React from 'react'
import Button from '../../Common/Button'
import './style.css'

function EpisodeCard({title, description, audio, onClick, index}) {
  return (
    <div className='episode-details'>
        <h2>{index}. {title}</h2>
        <p>{description}</p>
        <Button 
            text={"Play"} 
            onClick={() => onClick(audio)}
            width={"150px"}
        />
    </div>
  )
}

export default EpisodeCard
