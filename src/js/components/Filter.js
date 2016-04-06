// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { toggleNodeHighlight, clearAllNodeHighlights, toggleDataPathHighlight,
  clearAllDataPathHighlights, clearAllHighlights } from '../actions';
import FilterIcon from 'grommet/components/icons/base/Filter';
import Menu from 'grommet/components/Menu';
import Box from 'grommet/components/Box';
import Anchor from 'grommet/components/Anchor';
import CheckBox from 'grommet/components/CheckBox';

class Filter extends Component {

  constructor () {
    super();
    this._onChangeNode = this._onChangeNode.bind(this);
    this._onChangeNodeAll = this._onChangeNodeAll.bind(this);
    this._onChangeDataPath = this._onChangeDataPath.bind(this);
    this._onChangeDataPathAll = this._onChangeDataPathAll.bind(this);
    this._onReset = this._onReset.bind(this);
  }

  _onChangeNode (node) {
    this.props.dispatch(toggleNodeHighlight(node.name));
  }

  _onChangeNodeAll () {
    this.props.dispatch(clearAllNodeHighlights());
  }

  _onChangeDataPath (dataPath) {
    this.props.dispatch(toggleDataPathHighlight(dataPath.name));
  }

  _onChangeDataPathAll () {
    this.props.dispatch(clearAllDataPathHighlights());
  }

  _onReset (event) {
    event.preventDefault();
    this.props.dispatch(clearAllHighlights());
  }

  _renderNodes () {
    const { nodes } = this.props;
    let result = [];
    // don't bother if there's only one node
    if (nodes.length > 1) {
      let checkAll = true;
      result = nodes.map((node, index) => {
        if (node.highlight) {
          checkAll = false;
        }
        return (
          <CheckBox id={"node-" + index} key={index}
            label={node.name} checked={node.highlight}
            onChange={this._onChangeNode.bind(this, node)} />
        );
      });
      if (result.length > 1) {
        result.unshift(
          <CheckBox id="node-all" key="all"
            label="All" checked={checkAll}
            onChange={this._onChangeNodeAll} />
        );
        result.unshift(<h4 key="header">Nodes</h4>);
      }
    }
    return result;
  }

  _renderDataPaths () {
    const { dataPaths } = this.props;
    let result = [];
    // don't bother if there's only one dataPath
    if (dataPaths.length > 1) {
      let checkAll = true;
      result = dataPaths.map((dataPath, index) => {
        if (dataPath.highlight) {
          checkAll = false;
        }
        return (
          <CheckBox id={"data-path-" + index} key={index}
            label={dataPath.name} checked={dataPath.highlight}
            onChange={this._onChangeDataPath.bind(this, dataPath)} />
        );
      });
      if (result.length > 1) {
        result.unshift(
          <CheckBox id="data-path-all" key="all"
            label="All" checked={checkAll}
            onChange={this._onChangeDataPathAll} />
        );
        result.unshift(<h4 key="header">Data Paths</h4>);
      }
    }
    return result;
  }

  render () {
    const nodes = this._renderNodes();
    const dataPaths = this._renderDataPaths();
    return (
      <Menu icon={<FilterIcon />}
        dropAlign={{right: 'right'}} pad="none"
        direction="column" closeOnClick={false}>
        <Anchor href="" onClick={this._onReset}>Reset</Anchor>
        <Box pad="medium" direction="column">
          {nodes}
          {dataPaths}
        </Box>
      </Menu>
    );
  }
}

Filter.propTypes = {
  dataPaths: PropTypes.array.isRequired,
  nodes: PropTypes.array.isRequired
};

let select = (state, props) => ({
  dataPaths: state.topologyData.dataPaths,
  nodes: state.topologyData.nodes
});

export default connect(select)(Filter);
