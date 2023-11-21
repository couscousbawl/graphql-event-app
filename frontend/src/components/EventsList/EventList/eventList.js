import React from 'react'
import EventItem from '../EventItem/eventItem';

import './eventList.css';

const EventList = (props) => {
  const events = props.events.map((event) => {
    return (
      <EventItem
        key={event._id}
        eventId={event._id}
        title={event.title}
        price={event.price}
        date={event.date}
        userId={props.authUserId}
        created_by={event.created_by._id}
        onDetail={props.onViewDetail}
      />
    );
  });
  return <ul className="events_list">{events}</ul>;
};

export default EventList