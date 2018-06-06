const assert = require('assert');
const app = require('../../src/app');

describe('\'posts\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/posts');

    assert.ok(service, 'Registered the service');
  });
});
