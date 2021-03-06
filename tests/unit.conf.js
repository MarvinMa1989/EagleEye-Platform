'use strict';

let process = require('process');

// environment settings
process.env.NODE_ENV = 'testing';
process.env.EAGLEEYE_PLATFORM_PORT = 3000;
process.env.DB_CONNECTION_URI =
  'mongodb://localhost:27017/testEagleEyeDatabase';

// modules
require('./modules/charts.spec');
require('./modules/chart-sets.spec');
require('./modules/excel.spec');

// helpers
require('./helpers/column-types.spec');
require('./helpers/utils.spec');
require('./helpers/error-handlers.spec');

// routes
require('./routes/charts.spec');
require('./routes/chart-sets.spec');
require('./routes/root-endpoint.spec');

// main
require('./app.spec');
