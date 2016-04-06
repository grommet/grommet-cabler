// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

import { createStore } from 'redux';
import { CONFIGURE_FROM_LOCATION, CONFIGURE, SET, CLEAR_CONFIGURATION,
  TOGGLE_NODE_HIGHLIGHT, CLEAR_ALL_NODE_HIGHLIGHTS, TOGGLE_DATA_PATH_HIGHLIGHT,
  CLEAR_ALL_DATA_PATH_HIGHLIGHTS, TOGGLE_NODE_DATA_PATH_HIGHLIGHT,
  TOGGLE_CABLE_HIGHLIGHT, CLEAR_ALL_HIGHLIGHTS } from './actions';

const APP_TITLE = 'Cabling guidance';
const MAX_DEVICES_PER_RACK = 12;

// Initial state

const initialState = {
  title: APP_TITLE,
  // configuration options
  configurationOptions: {
    models: ['7200', '7400'],
    maxNodes: 4,
    maxDrives: 20
  },
  // active configuration
  configuration: {
    model: '7200',
    numNodes: 2,
    numDrives: 12
  },
  // browser location for push state
  location: {
    label: APP_TITLE,
    path: '/'
  }
};

// Build configuration

function _cableRun (options) {
  let index = 0;
  let priorEnclosure = null;

  while (index < options.enclosures.length) {

    const enclosure = options.enclosures[index];
    let ids = [];
    if (! priorEnclosure) {
      ids.push(options.nodePortId);
    } else {
      ids.push(priorEnclosure.slots[options.enclosureSlot].ports[options.outPort].id);
    }
    ids.push(enclosure.slots[options.enclosureSlot].ports[options.inPort].id);

    options.cables.push({
      nodeName: options.node.name,
      index: options.cableIndex,
      dataPathName: options.dataPath.name,
      colorIndex: options.dataPath.colorIndex,
      ids: ids
    });

    priorEnclosure = enclosure;
    index += 1;
    options.cableIndex += 1;
  }
}

function _buildDataPaths (configuration, topologyData) {
  topologyData.dataPaths = [
    {
      name: 'DP-1',
      colorIndex: "graph-1",
      highlight: false
    },
    {
      name: 'DP-2',
      colorIndex: "graph-2",
      highlight: false
    }
  ];
}

function _buildRacks (configuration, topologyData) {
  topologyData.racks = [];
  const numRacks = Math.ceil((configuration.numDrives + configuration.numNodes) /
    MAX_DEVICES_PER_RACK);
  for (let i = 0; i < numRacks; i += 1) {
    topologyData.racks.push({name: 'R' + i, contents: []});
  }
}

function _buildNodes (configuration, topologyData) {
  topologyData.nodes = [];
  for (let i = 0; i < configuration.numNodes; i += 1) {
    const name = 'N' + i;
    const idPrefix = topologyData.racks[0].name + ':' + name;

    const node = {
      type: 'node',
      name: name,
      highlight: false,
      slots: [
        {
          type: 'slot',
          name: 'S0',
          dataPath: topologyData.dataPaths[0],
          ports: [
            {type: 'port', name: 'P1', id: idPrefix + ':S0:P1'},
            {type: 'port', name: 'P2', id: idPrefix + ':S0:P2'}
          ]
        },
        {
          type: 'slot',
          name: 'S1',
          dataPath: topologyData.dataPaths[1],
          ports: [
            {type: 'port', name: 'P1', id: idPrefix + ':S1:P1'},
            {type: 'port', name: 'P2', id: idPrefix + ':S1:P2'}
          ]
        }
      ]
    };

    topologyData.racks[0].contents.unshift(node);
    topologyData.nodes.push(node);
  }
}

function _buildEnclosures (configuration, topologyData) {
  topologyData.enclosures = [];
  let rackIndex = 0;
  for (let i = 0; i < configuration.numDrives; i += 1) {
    const rack = topologyData.racks[rackIndex];
    const name = 'E' + i;
    const idPrefix = rack.name + ':' + name;

    let device = {
      type: 'enclosure',
      name: name,
      slots: [
        {
          type: 'slot',
          name: 'S0',
          ports: [
            {type: 'port', name: 'P1', id: idPrefix + ':S0:DP1'},
            {type: 'port', name: 'P2', id: idPrefix + ':S0:DP2'}
          ]
        },
        {
          type: 'slot',
          name: 'S1',
          ports: [
            {type: 'porty', name: 'P1', id: idPrefix + ':S1:DP1'},
            {type: 'port', name: 'P2', id: idPrefix + ':S1:DP2'}
          ]
        }
      ]
    };

    rack.contents.unshift(device);
    if (rack.contents.length >= MAX_DEVICES_PER_RACK) {
      rackIndex += 1;
    }
    topologyData.enclosures.push(device);
  }
}

function _buildCables (configuration, topologyData) {
  topologyData.cables = [];
  const enclosuresPerNode =
    Math.ceil(topologyData.enclosures.length / topologyData.nodes.length);
  let cableIndex = 1;
  topologyData.nodes.forEach((node, nodeIndex)  => {

    const nodeEnclosures = topologyData.enclosures.
      slice(enclosuresPerNode * nodeIndex,
        enclosuresPerNode * (nodeIndex + 1));

    let runEnclosures = [[], []];
    for (let i = 0; i < nodeEnclosures.length; i = i + 2) {
      runEnclosures[0].push(nodeEnclosures[i]);
      runEnclosures[1].push(nodeEnclosures[i+1]);
    }

    topologyData.dataPaths.forEach((dataPath, index)  => {
      // up
      _cableRun({
        cables: topologyData.cables,
        node: node,
        dataPath: dataPath,
        nodePortId: node.slots[index].ports[0].id,
        enclosures: runEnclosures[index],
        enclosureSlot: 1,
        inPort: 0,
        outPort: 1,
        cableIndex: cableIndex
      });
      cableIndex += runEnclosures[index].length;
      // down
      runEnclosures[index].reverse();
      _cableRun({
        cables: topologyData.cables,
        node: node,
        dataPath: dataPath,
        nodePortId: node.slots[index].ports[1].id,
        enclosures: runEnclosures[index],
        enclosureSlot: 0,
        inPort: 1,
        outPort: 0,
        cableIndex: cableIndex
      });
      cableIndex += runEnclosures[index].length;
    });
  });
}

function _cacheCables (topologyData) {
  // link cables to nodes and dataPaths
  const { nodes, dataPaths } = topologyData;
  topologyData.cables.forEach(cable => {
    cable.node = nodes.filter(node => node.name === cable.nodeName)[0];
    cable.dataPath = dataPaths.filter(dataPath =>
      dataPath.name === cable.dataPathName)[0];
  });
}

function _buildLinks (topologyData) {
  _cacheCables(topologyData);
  let links = topologyData.cables;
  if (topologyData.nodes.filter(node => node.highlight).length > 0) {
    // filter out unhighlighted node cables
    links = links.filter(cable => cable.node.highlight);
  }
  if (topologyData.dataPaths.filter(dataPath => dataPath.highlight).length > 0) {
    // filter out unhighlighted node cables
    links = links.filter(cable => cable.dataPath.highlight);
  }
  if (topologyData.cables.filter(cable => cable.highlight).length > 0) {
    // filter out unhighlighted cables
    links = links.filter(cable => cable.highlight);
  }
  topologyData.links = links;
}

function _configure (configuration) {
  // simulate for now
  let topologyData = {};
  _buildDataPaths(configuration, topologyData);
  _buildRacks(configuration, topologyData);
  _buildNodes(configuration, topologyData);
  _buildEnclosures(configuration, topologyData);
  _buildCables(configuration, topologyData);
  _buildLinks(topologyData);
  return topologyData;
}

function _location (configuration) {
  // HTML5 push state data
  return {
    path: '/' + encodeURIComponent(configuration.model) + '?' +
      'numNodes=' + encodeURIComponent(configuration.numNodes) +
      '&numDrives=' + encodeURIComponent(configuration.numDrives),
    label: configuration.model
  };
}

// State changes

const handlers = {

  [CONFIGURE_FROM_LOCATION]: (state, action) => {
    const { path, search } = action;
    let result = {};
    let configuration = {};
    configuration.model = path.split('/')[1] || '7200';
    if (search) {
      search.split('?')[1].split('&').forEach(function (param) {
        var parts = param.split('=');
        configuration[parts[0]] = parseInt(decodeURIComponent(parts[1]));
      });
      const topologyData = _configure(configuration);
      result = {
        configuration: configuration,
        location: _location(configuration),
        topologyData: topologyData
      };
    }
    return result;
  },

  [CONFIGURE]: (state, action) => {
    const { configuration } = action;
    const topologyData = _configure(configuration);

    return {
      configuration: configuration,
      location: _location(configuration),
      topologyData: topologyData
    };
  },

  [SET]: (state, action) => {
    let { state: nextState } = action;
    _buildLinks(nextState.topologyData);
    return nextState;
  },

  [CLEAR_CONFIGURATION]: (state, action) => {
    return {
      location: { label: APP_TITLE, path: '/' },
      topologyData: undefined
    };
  },

  [TOGGLE_NODE_HIGHLIGHT]: (state, action) => {
    const { nodeName } = action;
    const { topologyData } = state;
    const { nodes } = topologyData;
    let nextTopologyData = { ...topologyData,
      nodes: nodes.map(node => ({ ...node,
        highlight: (node.name === nodeName ? ! node.highlight : node.highlight)
      }))
    };
    _buildLinks(nextTopologyData);
    return { topologyData: nextTopologyData };
  },

  [CLEAR_ALL_NODE_HIGHLIGHTS]: (state, action) => {
    const { topologyData } = state;
    const { nodes } = topologyData;
    let nextTopologyData = { ...topologyData,
      nodes: nodes.map(node => ({ ...node,
        highlight: false
      }))
    };
    _buildLinks(nextTopologyData);
    return { topologyData: nextTopologyData };
  },

  [TOGGLE_DATA_PATH_HIGHLIGHT]: (state, action) => {
    const { dataPathName } = action;
    const { topologyData } = state;
    const { dataPaths } = topologyData;
    let nextTopologyData = { ...topologyData,
      dataPaths: dataPaths.map(dataPath => ({ ...dataPath,
        highlight: (dataPath.name === dataPathName ?
          ! dataPath.highlight : dataPath.highlight)
      }))
    };
    _buildLinks(nextTopologyData);
    return { topologyData: nextTopologyData };
  },

  [CLEAR_ALL_DATA_PATH_HIGHLIGHTS]: (state, action) => {
    const { topologyData } = state;
    const { dataPaths } = topologyData;
    let nextTopologyData = { ...topologyData,
      dataPaths: dataPaths.map(dataPath => ({ ...dataPath,
        highlight: false
      }))
    };
    _buildLinks(nextTopologyData);
    return { topologyData: nextTopologyData };
  },

  [TOGGLE_NODE_DATA_PATH_HIGHLIGHT]: (state, action) => {
    const { nodeName, dataPathName } = action;
    const { topologyData } = state;
    const { nodes, dataPaths, cables } = topologyData;
    const node = nodes.filter(node => node.name === nodeName)[0];
    const dataPath = dataPaths.filter(dataPath => dataPath.name === dataPathName)[0];
    const highlight = (! node.highlight || ! dataPath.highlight);
    let nextTopologyData = { ...topologyData,
      nodes: nodes.map(node => ({ ...node,
        highlight: (node.name === nodeName ? highlight : node.highlight)
      })),
      dataPaths: dataPaths.map(dataPath => ({ ...dataPath,
        highlight: (dataPath.name === dataPathName ? highlight : dataPath.highlight)
      })),
      cables: cables.map(cable => ({ ...cable,
        highlight: false
      }))
    };
    _buildLinks(nextTopologyData);
    return { topologyData: nextTopologyData };
  },

  [TOGGLE_CABLE_HIGHLIGHT]: (state, action) => {
    const { cableIndex } = action;
    const { topologyData } = state;
    const { cables, nodes, dataPaths } = topologyData;
    let nextTopologyData = { ...topologyData,
      nodes: nodes.map(node => ({ ...node,
        highlight: false
      })),
      dataPaths: dataPaths.map(dataPath => ({ ...dataPath,
        highlight: false
      })),
      cables: cables.map(cable => ({ ...cable,
        highlight: (cable.index === cableIndex ?
          ! cable.highlight : cable.highlight)
      }))
    };
    _buildLinks(nextTopologyData);
    return { topologyData: nextTopologyData };
  },

  [CLEAR_ALL_HIGHLIGHTS]: (state, action) => {
    const { topologyData } = state;
    const { nodes, dataPaths, cables } = topologyData;
    let nextTopologyData = { ...topologyData,
      nodes: nodes.map(node => ({ ...node,
        highlight: false
      })),
      dataPaths: dataPaths.map(dataPath => ({ ...dataPath,
        highlight: false
      })),
      cables: cables.map(cable => ({ ...cable,
        highlight: false
      }))
    };
    _buildLinks(nextTopologyData);
    return { topologyData: nextTopologyData };
  }

};

function reducer (state = initialState, action) {
  let handler = handlers[action.type];
  if (!handler) return state;
  return { ...state, ...handler(state, action) };
}

export default createStore(reducer);
