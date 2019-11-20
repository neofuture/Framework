let app = {
  test1: function (value) {
    window.angular.zone.run(() => {
      window.angular.test1(value, 'test', {object: 'test', test: 'demo'});
    });
    return null;
  }
};
