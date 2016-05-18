bunyan-logsene
====================

A Bunyan stream for saving logs into Logsene.

## Install

The project is not yet in the npm repository.
For now you will need to do:

```
npm install 6riversystems/bunyan-logsene
```

## Example

```
var bunyan = require('bunyan');
var Logsene = require('bunyan-logsene');

var logseneStream = new Logsene({
	token: 'da607594-3883-4f5c-9b3a-97b9703a5db2'
});

var logger = bunyan.createLogger({
  name: "My Application",
  streams: [
    { stream: process.stdout },
    { stream: logseneStream,
      type: 'raw'
    }
  ]
});

logger.info('Starting application on port %d', app.get('port'));
```

__NOTE__: You _must_ use the `raw` stream type.

## Based On

The following projects were used to get this working:

  - https://github.com/Trozz/bunyan-elasticsearch (Original Fork)
  - https://github.com/sematext/winston-logsene (How To)
  - https://github.com/sematext/logsene-js (Core Dependency)
