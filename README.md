njet-configuration [![Build Status](https://travis-ci.org/dariuszp/njet-configuration.png?branch=master)](https://travis-ci.org/dariuszp/njet-configuration)
==================

Configuration handler for projects.  Njet configuration is responsible for loading yaml configuration files.

## Installation

```JavaScript
npm install njet-configuration
```

## Usage

First load njet configuration

```JavaScript
var njetConfiguration = require('njet-configuration');
```

and create first configuration:

```JavaScript
var config = njetConfiguration.create();
```

## Getting data

To get Your configuration use:

```JavaScript
config.get('x'); // to get specific value
config.getConfiguration(); // to get all values as json object
```

## Set values from json objects

There are three ways to set configuration values.

```JavaScript
config.set('x', 5);
```

will set "x" to 5. Now when You get Your configuration You will receive:

```JavaScript
{ "x": 5 }
```

You can also replace whole configuration using load:

```JavaScript
config.load({
    y: 6
});
```

This will replace Your configuration and You will receive:

```JavaScript
{ "y": 6 }
```

Or You can merge two objects together:

```JavaScript
config.merge({
    z: 1
});
```

To get:

```JavaScript
{ "y": 6, "z": 1 }
```

## Merging

Merge will always do deep copy of the objects. For example:

```JavaScript
config.load({
    x: 1,
    y: ["a"]
});

config.merge({
    y: ["b"],
    z: 3
});
```

Will result:

```JavaScript
{ "x": 1, "y": ["a", "b"], "z": 3 }
```

## Validating

There are two ways to validate objects. You can add validators:

```JavaScript
config.addValidator(function (config) {
    if (config.key === undefined) {
        return false;
    }
    return true;
});
```

Or schema:

```JavaScript
config.schema({
    x: config.expect.number()
});
```

To validate configuration, simply use:

```JavaScript
config.validate();
config.isValid();
```

For more information about schema validation visit https://github.com/cruks/cruks-lib-config

## Yaml configuration files

You can load yaml files and directories containing yaml files like this:

```JavaScript
config.load('/path/to/directory');
config.load('/path/to/file.yml');
config.merge('/path/to/another_file.yml');
config.merge('/path/to/another/directory');
```

## Configuration

You cann pass options to njet configuration constructor. Like this:

```JavaScript
var config = njetConfiguration.create({
    varbosity: 1,
    expect: expect,
    loader: loader
});
```

* Verbosity above 0 (default 0) allow njet configuration to print error messages on standard output if configuration validation fails.
* expect is a module to validate configuration. It should have .schema() method that return object with .asset() method. Assert should take configuration json object as first parameter.
* loader is a module for loading data. As first argument, loader take either data object or path to file. By default loader only load .yml files.