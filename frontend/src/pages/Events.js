import React, { Component } from "react";

import Modal from "../components/Modal/Modal";
import Backdrop from "../components/Backdrop/Backdrop";

import "./events.css";
import AuthContext from "../context/auth-context";
import EventList from "../components/EventsList/EventList/eventList";
import Spinner from "../components/Spinner/spinner";

class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null,
  };

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  static contextType = AuthContext;

  startCreatingEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
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
      `,
    };

    const token = this.context.token;

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 200) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        this.setState((prevState) => {
          const updatedEvents = [...prevState.events];
          updatedEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            price: resData.data.createEvent.price,
            created_by: {
              _id: this.context.userId,
            },
          });
          return { events: updatedEvents };
        });
      })
      .catch((err) => {
        console.log(err);
      });

    this.setState({ creating: false });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  fetchEvents() {
    this.setState({ isLoading: true });
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
      `,
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 200) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        const events = resData.data.events;
        this.setState({ events: events, isLoading: false });
      })
      .catch((err) => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  showDetailHandler = (eventId) => {
    this.setState((prevState) => {
      const selectedEvent = prevState.events.find((e) => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = () => {
    const requestBody = {
      query: `
        mutation {
          bookEvent(eventId: "${this.state.selectedEvent._id}") {
            _id
            createdAt
            updatedAt
          }
        }
      `,
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + this.context.token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 200) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
       console.log(resData);
       this.setState({selectedEvent: null});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    return (
      <React.Fragment>
        <div className="modal-container">
          {(this.state.creating || this.state.selectedEvent) && <Backdrop />}
          {this.state.creating && (
            <Modal
              title="Add Event"
              canCancel
              canConfirm
              onConfirm={this.modalConfirmHandler}
              onCancel={this.modalCancelHandler}
              confirmText="Confirm"
            >
              <form>
                <div className="form-control">
                  <label htmlFor="title">Title</label>
                  <input type="text" id="title" ref={this.titleElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="price">Price</label>
                  <input type="number" id="price" ref={this.priceElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="date">Date</label>
                  <input type="datetime-local" id="date" ref={this.dateElRef} />
                </div>
                <div className="form-control">
                  <label htmlFor="description">Description</label>
                  <textarea
                    rows="4"
                    id="description"
                    ref={this.descriptionElRef}
                  />
                </div>
              </form>
            </Modal>
          )}
          {this.state.selectedEvent && (
            <Modal
              title={this.state.selectedEvent.title}
              canCancel
              canConfirm
              onConfirm={this.bookEventHandler}
              onCancel={this.modalCancelHandler}
              confirmText="Book Event"
            >
              <h1>{this.state.selectedEvent.title}</h1>
              <h2>${this.state.selectedEvent.price}</h2>
              <h3>
                {new Date(this.state.selectedEvent.date).toLocaleDateString()}
              </h3>
              <p>{this.state.selectedEvent.description}</p>
            </Modal>
          )}
          <div className="events-control">
            <button className="btn" onClick={this.startCreatingEventHandler}>
              Create Event
            </button>
          </div>
          {this.state.isLoading ? (
            <Spinner />
          ) : (
            <EventList
              events={this.state.events}
              authUserId={this.context.userId}
              onViewDetail={this.showDetailHandler}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default EventsPage;
