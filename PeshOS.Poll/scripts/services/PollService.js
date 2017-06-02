'use strict';

angular.module('pollService', [])
    .service('PollService', function ($q, $http, $scope) {

        this.readConfiguration = function (itemId) {
            var deferred = $.Deferred(),
                ctx = SP.ClientContext.get_current(),
                web = ctx.get_web(),
                list = web.get_lists().getByTitle(PeshOS.Poll.constants.ConfigurationList);

            this.listItem = list.getItemById(itemId);
            ctx.load(this.listItem);
            ctx.executeQueryAsync(
                Function.createDelegate(this,
                    function () {
                        PeshOS.Poll.configObj = JSON.parse(this.listItem.get_item('PeshOSConfiguration').replace(/(\r\n|\n|\r)/gm, ''));
                        PeshOS.Poll.configObj.id = itemId;
                        deferred.resolve();
                    }),
                Function.createDelegate(this,
                    function (sender, args) {
                        deferred.reject(args.get_message());
                    }));

            return deferred;
        };

        this.saveConfiguration = function (itemId) {
            var itemId = itemId || 1,
                deferred = $.Deferred(),
                ctx = SP.ClientContext.get_current(),
                web = ctx.get_web(),
                list = web.get_lists().getByTitle(PeshOS.Poll.constants.ConfigurationList);

            this.listItem = list.getItemById(itemId);
            this.listItem.set_item('PeshOSConfiguration', JSON.stringify(PeshOS.Poll.configObj));
            this.listItem.update();
            ctx.load(this.listItem);
            ctx.executeQueryAsync(
                Function.createDelegate(this,
                    function () {
                        deferred.resolve();
                    }),
                Function.createDelegate(this,
                    function (sender, args) {
                        deferred.reject(args.get_message());
                    }));

            return deferred;
        };
    });