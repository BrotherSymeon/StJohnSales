const fnArgs = require('parse-fn-args');

module.exports = function() {
  const dependencies = {};
  const factories = {};
  const diContainer = {};

  diContainer.factory = function (name, factory) {
    factories[ name ] = factory;
  };

  diContainer.register = function (name, dep) {
    dependencies[ name ] = dep;
  };

  diContainer.get = function (name) {
    if( !dependencies[ name ] ) {
      const factory = factories[ name ];
      dependencies[ name ] = factory && diContainer.inject( factory );
      if( !dependencies[ name ]) {
        throw new Error(`Cannot find module: ${name}`);
      }
    }
    return dependencies[ name ];
  };

  diContainer.inject = function (factory) {
    const args = fnArgs( factory ).map((dep) => {
      return diContainer.get(dep);
    });
    return factory.apply(null, args);
  };

  return diContainer;
};