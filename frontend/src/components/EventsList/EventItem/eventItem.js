import React from "react";

import './eventItem.css';

const EventItem = (props) => (
  <li className="events_list-item" key={props.eventId}>
    <div>
      <h1>{props.title}</h1>
      <h2>${props.price}</h2>
      <h3>{new Date(props.date).toLocaleDateString()}</h3>
    </div>
    <div>
      {props.userId === props.created_by ? (
        <p>You are the owner of this event</p>
      ) : (
        <button className="btn" onClick={props.onDetail.bind(this,  props.eventId)}>View Details</button>
      )}
    </div>
  </li>
);

export default EventItem;