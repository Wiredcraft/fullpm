import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';

function main() {
  const app = document.createElement('div');

  document.body.appendChild(app);

  ReactDOM.render(<Root />, app);
}

main();
