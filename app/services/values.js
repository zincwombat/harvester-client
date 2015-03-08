angular.module('harvesterApp').value('appSettings',{
    title : 'Harvester Application',
    version : '0.1',
    urlbase : 'http://harvester.ironcache.net:8080',
    apiModule : 'controller_api',
    wsx_url : 'ws://harvester.ironcache.net:8080/wsx'
});