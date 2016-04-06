// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { toggleCableHighlight, toggleNodeDataPathHighlight } from '../actions';
import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header';
import Menu from 'grommet/components/Menu';
import Anchor from 'grommet/components/Anchor';
import CloseIcon from 'grommet/components/icons/base/Close';
import Table from 'grommet/components/Table';
import Legend from 'grommet/components/Legend';

class Cables extends Component {

  constructor () {
    super();
    this._onToggle = this._onToggle.bind(this);
    this._onToggleNodeDataPath = this._onToggleNodeDataPath.bind(this);
  }

  _onToggle (cable) {
    this.props.dispatch(toggleCableHighlight(cable.index));
  }

  _onToggleNodeDataPath (nodeName, dataPathName) {
    this.props.dispatch(toggleNodeDataPathHighlight(nodeName, dataPathName));
  }

  render () {
    const { cables } = this.props;
    let selected = [];
    let rows = [];
    let dataPathName;
    let nodeName;
    cables.forEach(cable => {
      if (cable.dataPathName !== dataPathName || cable.nodeName !== nodeName) {
        if (cable.dataPath.highlight && cable.node.highlight) {
          selected.push(rows.length);
        }
        const series = [{
          label: cable.nodeName + ' ' + cable.dataPathName,
          colorIndex: cable.dataPath.colorIndex
        }];
        rows.push(
          <tr key={cable.nodeName + cable.dataPathName}
            onClick={this._onToggleNodeDataPath.bind(this, cable.nodeName,
              cable.dataPathName)}>
            <td colSpan="5">
              <Legend series={series} />
            </td>
          </tr>
        );
        dataPathName = cable.dataPathName;
        nodeName = cable.nodeName;
      }
      if (cable.highlight) {
        selected.push(rows.length);
      }
      rows.push(
        <tr key={cable.index} onClick={this._onToggle.bind(this, cable)}>
          <td><strong>{cable.index}</strong></td>
          <td>1</td>
          <td>?</td>
          <td>{cable.ids[0]}</td>
          <td>{cable.ids[1]}</td>
        </tr>
      );
    });

    return (
      <Sidebar size="large">
        <Header pad={{horizontal: "medium"}} justify="between" fixed={true}>
          Cables
          <Menu inline={true} direction="row" align="center" responsive={false}>
            <Anchor href="" onClick={this.props.onClose}><CloseIcon /></Anchor>
          </Menu>
        </Header>
        <Table selectable={true} selected={selected}>
          <thead>
            <tr>
              <th>#</th>
              <th>(m)</th>
              <th>Id</th>
              <th>From</th>
              <th>To</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </Table>
      </Sidebar>
    );
  }
}

Cables.propTypes = {
  cables: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
};

let select = (state, props) => ({
  cables: state.topologyData.cables
});

export default connect(select)(Cables);
