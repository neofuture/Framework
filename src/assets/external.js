let app = {
  callAngular: function (...value) {
    window.angular.zone.run(() => {
      window.angular.callAngular(value);
    });
    return null;
  },
  openWindow: function (x, y) {
    window.angular.zone.run(() => {
      window.angular.openWindow(x, y);
    });
    return null;
  },

  demo: function (value, value2, value3) {
    console.log("app.demo", value, value2, value3);

  },
  deeper: {
    test: function(value, value2, value3) {
      console.log("app.deeper.test", value, value2, value3);
    }
  }
};

function standardFunction(value, value2, value3) {
  console.log("Function", value, value2, value3);
}

function dispatchFunction(functionName) {
  var args = Array.prototype.slice.call(arguments, 1);
  var namespaces = functionName.split(".");
  var func = namespaces.pop();
  contextName = namespaces.shift() || window;
  var context = eval(contextName);
  for (var i = 0; i < namespaces.length; i++) {
    context = context[namespaces[i]];
  }
  return context[func].apply(context, args);
}
