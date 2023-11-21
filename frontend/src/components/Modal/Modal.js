import React from 'react'

import './modal.css'

const Modal = (props) => (
  <div className="modal">
    <header className="modal_header">{props.title}</header>
    <section className="modal_content">{props.children}</section>
    <section className="modal_actions">
      {props.canConfirm && (
        <button className="btn" onClick={props.onConfirm}>
          {props.confirmText}
        </button>
      )}
      {props.canCancel && (
        <button className="btn" onClick={props.onCancel}>
          Cancel
        </button>
      )}
    </section>
  </div>
);

export default Modal