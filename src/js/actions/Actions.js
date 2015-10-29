// (C) Copyright 2014-2015 Hewlett Packard Enterprise Development LP

var Reflux = require('reflux');

var Actions = Reflux.createActions({
  'configureFromLocation': {},
  'configure': {},
  'set': {},
  'clearConfiguration': {},
  'toggleNodeHighlight': {},
  'clearAllNodeHighlights': {},
  'toggleDataPathHighlight': {},
  'clearAllDataPathHighlights': {},
  'toggleNodeDataPathHighlight': {},
  'toggleCableHighlight': {},
  'clearAllHighlights': {}
});

module.exports = Actions;
