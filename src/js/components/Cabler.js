// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { configureFromLocation, set } from '../actions';
import App from 'grommet/components/App';
import Home from './Home';
import Diagram from './Diagram';

class Cabler extends Component {

  constructor () {
    super();
    this.state = {};
  }

  componentDidMount () {
    window.onpopstate = this._popState;
    this._noPush = true;
    this.props.dispatch(configureFromLocation(window.location.pathname,
      window.location.search));
    ;
  }

  _pushState () {
    const { location, data } = this.props;
    if (location) {
      window.history.pushState(data, location.label, location.path);
    }
  }

  _popState (event) {
    this._noPush = true;
    if (event.state) {
      this.props.dispatch(set(event.state));
    } else {
      //Actions.clearConfiguration();
    }
  }

  // _onChange (data) {
  //   let push;
  //   if (! this._noPush) {
  //     push = this._pushState;
  //   } else {
  //     this._noPush = false;
  //   }
  //   this.replaceState(data, push);
  // }

  render () {
    const { data } = this.props;
    let contents;
    if (data.topologyData) {
      contents = <Diagram />;
    } else {
      contents = <Home />;
    }

    return (
      <App centered={false}>
        {contents}
      </App>
    );
  }
}

let select = (state, props) => ({
  location: state.location,
  data: state
});

export default connect(select)(Cabler);
