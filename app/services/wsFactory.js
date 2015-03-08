(function () {

    var wsFactory = function ($websocket, $rootScope, appSettings, queueFactory) {

        var wsx_url = appSettings.wsx_url;
        var dataStream = $websocket(wsx_url);
        //var collection = [];

        var queuesize=appSettings.wsx_queuesize;
        var collection = queueFactory.init(queuesize);

        dataStream.onMessage(function(message) {
            //collection.push(JSON.parse(message.data));
            collection.push(message.data);
        });

        var methods = {
            collection: collection,
            get: function() {
                dataStream.send(JSON.stringify({ action: 'get' }));
            }
        };

        return methods;
    };

    wsFactory.$inject = ['$websocket', '$rootScope', 'appSettings', 'queueFactory'];
    angular.module('harvesterApp').factory('wsFactory', wsFactory);
})();