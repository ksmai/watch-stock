'use strict';

exports.config = {
  allScriptsTimeout: 11000,
  specs: ['e2e-test/*.js'],
  capabilities: { browserName: 'chrome' },
  framework: 'jasmine',
  baseUrl: 'http://localhost:3000/',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
