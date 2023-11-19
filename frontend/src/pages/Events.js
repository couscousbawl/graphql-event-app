import React, { Component } from 'react'

import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

import './events.css'

class EventsPage extends Component {

  state = {
    creating: false
  };

  startCreatingEventHandler = () => {
    this.setState({creating: true});
  };

  modalConfirmHandler = () => {
    this.setState({creating: false});
  };

  modalCancelHandler = () => {
    this.setState({creating: false});
  }

  render() {
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
          <p>content</p>
        </Modal>}
        <div className="events-control">
          <button className="btn" onClick={this.startCreatingEventHandler}>Create Event</button>
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage