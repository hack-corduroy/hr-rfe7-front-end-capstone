import React from 'react';
import api from '../../api.js';

const ClickHandler = ({ children }) => {
  let log = (e) => {
    let el = e.target.getAttribute('data-id');

    if (el) {
      let arr = el.split('_');
      let widget = arr.shift();
      let element = arr.join('_');
      let time = new Date().toString();

      api.logInteraction({ element, widget, time }).catch((err) => console.error(err));
    }

    // api.logInteraction()
  };
  return <div onClick={(e) => log(e)}>{children}</div>;
};

export default ClickHandler;
