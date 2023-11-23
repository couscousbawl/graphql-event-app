import React from 'react'

import './bookingList.css';

const BookingList = props => (

    <ul className="booking_list">
      {props.bookings.map((booking) => {
        return (
          <li key={booking._id} className="booking_listitem">
            <div className="booking_details">
              {booking.event.title} -{" "}
              {new Date(booking.createdAt).toLocaleDateString()}
            </div>
            <div className="booking_actions">
              <button className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel Booking</button>
            </div>
          </li>
        );
      })}
    </ul>
)

export default BookingList