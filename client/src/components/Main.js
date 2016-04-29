import 'normalize.css/normalize.css'
import 'styles/App.css'

import React from 'react';

class AppComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <div className="notice">pmhub</div>
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
