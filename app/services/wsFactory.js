(function () {

    var wsFactory = function ($websocket, appSettings) {
        var dataStream = $websocket('wss://website.com/data');
        var collection = [];

        dataStream.onMessage(function(message) {
            collection.push(JSON.parse(message.data));
        });

        var methods = {
            collection: collection,
            get: function() {
                dataStream.send(JSON.stringify({ action: 'get' }));
            }
        };

        return methods;
    };

    wsFactory.$inject = ['$websocket', 'appSettings'];
    angular.module('harvesterApp').factory('wsFactory', wsFactory);
})();