// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { configure } from '../actions';
import Article from 'grommet/components/Article';
import Header from 'grommet/components/Header';
import Title from 'grommet/components/Title';
import Footer from 'grommet/components/Footer';
import Form from 'grommet/components/Form';
import FormFields from 'grommet/components/FormFields';
import FormField from 'grommet/components/FormField';
import Menu from 'grommet/components/Menu';
import Button from 'grommet/components/Button';

class Configuration extends Component {

  constructor () {
    super();
    this._onConfigure = this._onConfigure.bind(this);
  }

  _onConfigure (event) {
    event.preventDefault();
    let configuration = {
      model: this.refs.model.value,
      numNodes: parseInt(this.refs.nodes.value),
      numDrives: parseInt(this.refs.drives.value)
    };
    this.props.dispatch(configure(configuration));
  }

  render () {
    const { title, options, configuration } = this.props;
    const models = options.models.map(function (model) {
      return <option key={model}>{model}</option>;
    });

    return (
      <Article>
        <Header fixed={true} pad={{horizontal: 'medium'}}>
          <Title>{title}</Title>
        </Header>
        <Form pad="medium">
          <FormFields>
            <fieldset>
              <FormField label="Model" htmlFor={"model"}>
                <select ref="model" id={"model"} name="model">
                  {models}
                </select>
              </FormField>
              <FormField label="Nodes" htmlFor={"nodes"}>
                <input ref="nodes" id={"nodes"} name="nodes" type="number"
                  min="1" max={options.maxNodes} step="1"
                  defaultValue={configuration.numNodes} />
              </FormField>
              <FormField label="Drives" htmlFor={"drives"}>
                <input ref="drives" id={"drives"} name="drives" type="number"
                  min="1" max={options.maxDrives} step="1"
                  defaultValue={configuration.numDrives} />
              </FormField>
            </fieldset>
          </FormFields>
          <Footer pad={{vertical: 'medium'}}>
            <Menu>
              <Button label="Generate" primary={true} strong={true}
                onClick={this._onConfigure} />
            </Menu>
          </Footer>
        </Form>
      </Article>
    );
  }
}

Configuration.propTypes = {
  configuration: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

let select = (state, props) => ({
  configuration: state.configuration,
  options: state.configurationOptions,
  title: state.title
});

export default connect(select)(Configuration);
