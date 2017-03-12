'use strict';
const paths = require('./gulp.config.json');

module.exports = function(config) {
  config.set({
    files: paths.karmaFiles,
    frameworks: ['jasmine'],
    browsers: ['Chrome', 'Firefox']
  });
};
