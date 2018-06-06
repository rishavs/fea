const assert = require('assert');
const app = require('../../src/app');

describe('\'messages\' service', () => {
  it('registered the service', () => {
    const service = app.service('api/messages');

    assert.ok(service, 'Registered the service');
  });
});
