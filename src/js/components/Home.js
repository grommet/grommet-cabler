// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component } from 'react';
import Split from 'grommet/components/Split';
import Section from 'grommet/components/Section';
import Configuration from './Configuration';

export default class Home extends Component {

  constructor () {
    super();
    this._onResponsive = this._onResponsive.bind(this);
    this.state = {};
  }

  _onResponsive (responsive) {
    this.setState({responsive: responsive});
  }

  render () {
    let image;
    if ('multiple' === this.state.responsive) {
      image = (
        <Section full={true} pad="none"
          texture="url(img/3PAR_ManPullingDriveSquattingHR.jpg)" />
      );
    }

    return (
      <Split flex="left" separator={true} onResponsive={this._onResponsive}>
        {image}
        <Configuration />
      </Split>
    );
  }
}
