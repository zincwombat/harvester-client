(function () {

    var wsFactory = function ($websocket, $rootScope, appSettings, queueFactory) {

        var wsx_url = appSettings.wsx_url;
        var dataStream = $websocket(wsx_url);
        var wsx_cnt=0;

        //var collection = [];

        var queuesize=appSettings.wsx_queue;
        var collection = queueFactory.init(queuesize);

        dataStream.onMessage(function(message) {
            collection.push(JSON.parse(message.data));
            //collection.push(message.data);
            wsx_cnt++;
        });

        var methods = {
            collection: collection,
            cnt: function() {
                return wsx_cnt;
            },
            get: function() {
                dataStream.send(JSON.stringify({ action: 'get' }));
            }
        };

        return methods;
    };

    wsFactory.$inject = ['$websocket', '$rootScope', 'appSettings', 'queueFactory'];
    angular.module('harvesterApp').factory('wsFactory', wsFactory);
})();