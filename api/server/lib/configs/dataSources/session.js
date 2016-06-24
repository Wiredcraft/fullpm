'use strict';

// Only for convenience; the connector will be used directly in the session store.
var dataSource = {
  name: 'session',
  connector: 'ioredis'
};

if (process.env.SENTINEL_HOSTS) {
  dataSource.sentinels = process.env.SENTINEL_HOSTS.split(',').map(function(host) {
    var res = host.trim().split(':');

    // TODO: throw.
    // if (res.length !== 2) {}

    return {
      host: res[0],
      port: res[1]
    };
  });

  dataSource.sentinelMasterName = process.env.SENTINEL_MASTER_NAME;
}

module.exports = dataSource;
