import React from 'react';
import ReactDOM from 'react-dom';
import '../css/index.css';

class App extends React.Component {
  constructor(props) {
    
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <main>
        <h1>Hello, World!</h1>
      </main>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));