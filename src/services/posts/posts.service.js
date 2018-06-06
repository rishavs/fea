// Initializes the `posts` service on path `/api/posts`
const createService = require('feathers-knex');
const createModel = require('../../models/posts.model');
const hooks = require('./posts.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'posts',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/api/posts', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('api/posts');

  service.hooks(hooks);
};
  