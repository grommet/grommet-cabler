// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { clearConfiguration } from '../actions';
import Split from 'grommet/components/Split';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Section from 'grommet/components/Section';
import Topology from 'grommet/components/Topology';
import Menu from 'grommet/components/Menu';
import Button from 'grommet/components/Button';
import Filter from './Filter';
import Cables from './Cables';

class Diagram extends Component {

  constructor () {
    super();
    this._onHome = this._onHome.bind(this);
    this._onToggleCables = this._onToggleCables.bind(this);
    this._onResponsive = this._onResponsive.bind(this);

    this.state = {showCables: false};
  }

  componentDidUpdate () {
    // scroll to first link if not visible
    const { links } = this.props;
    if (links.length > 0) {
      let port = document.getElementById(links[0].ids[0]);
      if (port) {
        // TODO:
      }
    }
  }

  _onHome (event) {
    event.preventDefault();
    this.props.dispatch(clearConfiguration());
  }

  _onToggleCables (event) {
    event.preventDefault();
    this.setState({showCables: ! this.state.showCables});
  }

  _onResponsive (responsive) {
    this.setState({responsive: responsive});
  }

  _renderTopology () {
    const { racks, links } = this.props;

    const parts = racks.map(function (rack) {

      const devices = rack.contents.map(function (device) {

        const slots = device.slots.map(function (slot) {

          const ports = slot.ports.map(function (port) {
            return (
              <Topology.Part key={port.name} label={port.name} status="disabled"
                id={port.id} align="center" />
            );
          });

          return (
            <Topology.Part key={slot.name} label={slot.name}>
              {ports}
            </Topology.Part>
          );
        });

        return (
          <Topology.Part key={device.name} label={device.name} direction="row">
            <Topology.Part />
            <Topology.Parts direction="column">
              {slots}
            </Topology.Parts>
            <Topology.Part />
          </Topology.Part>
        );
      });

      return (
        <Topology.Part key={rack.name} direction="column">
          {devices}
        </Topology.Part>
      );
    });

    return (
      <Topology links={links} linkOffset={72}>
        <Topology.Parts direction="row" align="end">
          {parts}
        </Topology.Parts>
      </Topology>
    );
  }

  render () {
    const { title } = this.props;
    let article;
    if (! this.state.showCables || 'multiple' === this.state.responsive) {
      let cablesControl;
      if (! this.state.showCables) {
        cablesControl = <Button onClick={this._onToggleCables}>Cables</Button>;
      }
      const topology = this._renderTopology();

      article = (
        <Article>
          <Header pad={{horizontal: "medium"}} justify="between">
            <Title onClick={this._onHome}>{title}</Title>
            <Menu inline={true} direction="row" align="center" responsive={false}>
              <Filter />
              {cablesControl}
            </Menu>
          </Header>
          <Section pad={{horizontal: "medium"}}>
            {topology}
          </Section>
        </Article>
      );
    }

    let cables;
    if (this.state.showCables) {
      cables = (
        <Cables onClose={this._onToggleCables} />
      );
    }

    return (
      <Split flex="left" separator={true} onResponsive={this._onResponsive}>
        {article}
        {cables}
      </Split>
    );
  }
}

Diagram.propTypes = {
  links: PropTypes.array.isRequired,
  racks: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired
};

let select = (state, props) => ({
  links: state.topologyData.links,
  racks: state.topologyData.racks,
  title: state.title
});

export default connect(select)(Diagram);
