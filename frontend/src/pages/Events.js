import React, { Component } from 'react'

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

import './events.css'
import AuthContext from '../context/auth-context';

class EventsPage extends Component {

  state = {
    creating: false,
    events: []
  };

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  };

  componentDidMount() {
    this.fetchEvents();
  };

  static contextType = AuthContext;

  startCreatingEventHandler = () => {
    this.setState({creating: true});
  };

  modalConfirmHandler = () => {
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if(title.trim().length === 0 || 
        price <= 0 || 
        date.trim().length === 0 || 
        description.trim().length === 0
      ){
      return;
    }

    const requestBody = {
      query: `
        mutation {
          createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
            _id
            title
            description
            date
            price
            created_by {
              _id
              email
            }
          }
        }
      `
    }

    const token = this.context.token;

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
    }).then(res => {
      if (res.status !== 200 && res.status !== 200) {
        throw new Error("Failed");
      }
      return res.json();
    })
    .then(resData => {
      this.fetchEvents();
    })
    .catch((err) => {
      console.log(err);
    });

    this.setState({creating: false});
  };

  modalCancelHandler = () => {
    this.setState({creating: false});
  };

  fetchEvents() {
    const requestBody = {
      query: `
        query {
          events {
            _id
            title
            description
            date
            price
            created_by {
              _id
              email
            }
          }
        }
      `
    }

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      },
    }).then(res => {
      if (res.status !== 200 && res.status !== 200) {
        throw new Error("Failed");
      }
      return res.json();
    })
    .then(resData => {
      const events = resData.data.events;
      this.setState({events: events}); 
    })
    .catch((err) => {
      console.log(err);
    });
  }

  render() {

    const eventsList = this.state.events.map(event => {
      return <li className='events_list-item' key={event._id}>{event.title}</li>;
    })

    return (
      <React.Fragment>
        {this.state.creating && <Backdrop />}
        {this.state.creating && <Modal 
              title="Add Event" 
              canCancel 
              canConfirm
              onConfirm={this.modalConfirmHandler}
              onCancel={this.modalCancelHandler} 
              >
          <form>
            <div className='form-control'>
              <label htmlFor='title'>Title</label>
              <input type='text' id='title' ref={this.titleElRef}/>
            </div>
            <div className='form-control'>
              <label htmlFor='price'>Price</label>
              <input type='number' id='price' ref={this.priceElRef}/>
            </div>
            <div className='form-control'>
              <label htmlFor='date'>Date</label>
              <input type='datetime-local' id='date' ref={this.dateElRef}/>
            </div>
            <div className='form-control'>
              <label htmlFor='description'>Description</label>
              <textarea rows='4' id='description' ref={this.descriptionElRef}/>
            </div>
          </form>
        </Modal>}
        <div className="events-control">
          <button className="btn" onClick={this.startCreatingEventHandler}>Create Event</button>
        </div>
        <ul className='events_list'>
          {eventsList}
        </ul>
      </React.Fragment>
    );
  }
}

export default EventsPage