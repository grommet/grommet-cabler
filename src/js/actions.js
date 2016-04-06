// (C) Copyright 2014-2016 Hewlett Packard Enterprise Development LP

export const CONFIGURE_FROM_LOCATION = 'CONFIGURE_FROM_LOCATION';
export const CONFIGURE = 'CONFIGURE';
export const SET = 'SET';
export const CLEAR_CONFIGURATION = 'CLEAR_CONFIGURATION';
export const TOGGLE_NODE_HIGHLIGHT = 'TOGGLE_NODE_HIGHLIGHT';
export const CLEAR_ALL_NODE_HIGHLIGHTS = 'CLEAR_ALL_NODE_HIGHLIGHTS';
export const TOGGLE_DATA_PATH_HIGHLIGHT = 'TOGGLE_DATA_PATH_HIGHLIGHT';
export const CLEAR_ALL_DATA_PATH_HIGHLIGHTS = 'CLEAR_ALL_DATA_PATH_HIGHLIGHTS';
export const TOGGLE_NODE_DATA_PATH_HIGHLIGHT = 'TOGGLE_NODE_DATA_PATH_HIGHLIGHT';
export const TOGGLE_CABLE_HIGHLIGHT = 'TOGGLE_CABLE_HIGHLIGHT';
export const CLEAR_ALL_HIGHLIGHTS = 'CLEAR_ALL_HIGHLIGHTS';

export function configureFromLocation (path, search) {
  return { type: CONFIGURE_FROM_LOCATION, path: path, search: search };
}

export function configure (configuration) {
  return { type: CONFIGURE, configuration: configuration };
}

export function set (state) {
  return { type: SET, state: state };
}

export function clearConfiguration () {
  return { type: CLEAR_CONFIGURATION };
}

export function toggleNodeHighlight (nodeName) {
  return { type: TOGGLE_NODE_HIGHLIGHT, nodeName: nodeName };
}

export function clearAllNodeHighlights () {
  return { type: CLEAR_ALL_NODE_HIGHLIGHTS };
}

export function toggleDataPathHighlight (dataPathName) {
  return { type: TOGGLE_DATA_PATH_HIGHLIGHT, dataPathName: dataPathName };
}

export function clearAllDataPathHighlights () {
  return { type: CLEAR_ALL_DATA_PATH_HIGHLIGHTS };
}

export function toggleNodeDataPathHighlight (nodeName, dataPathName) {
  return { type: TOGGLE_NODE_DATA_PATH_HIGHLIGHT, nodeName: nodeName,
    dataPathName: dataPathName };
}

export function toggleCableHighlight (cableIndex) {
  return { type: TOGGLE_CABLE_HIGHLIGHT, cableIndex: cableIndex };
}

export function clearAllHighlights () {
  return { type: CLEAR_ALL_HIGHLIGHTS };
}
