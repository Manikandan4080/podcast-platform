import React from "react";
import { Link } from "react-router-dom";
import './style.css'

const PodcastCard = ({id, title, displayImage, createdBy}) => {
    return (
        <Link className="podcast-card-link" to={`/podcasts/${id}`}>
            <div className="podcast-card">
                <img className="podcast-dispaly-image" src={displayImage} alt={title}/>
                <h5 className="podcast-card-title">{title}</h5>

                <p>{createdBy}</p>
            </div>
        </Link>
    );
}

export default PodcastCard;