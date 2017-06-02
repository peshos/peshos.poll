'use strict';

angular.module('sharePointService', [])
    .service('SharePointService', function ($http, $q) {
        return {

            deleteListItems: function (listName, query) {
                if (!query) {
                    query = new SP.CamlQuery();
                }

                var deferred = $q.defer(),
                    ctx = SP.ClientContext.get_current(),
                    web = ctx.get_web(),
                    webLists = web.get_lists(),
                    desiredList = webLists.getByTitle(listName),
                    desiredListItems = desiredList.getItems(query);

                ctx.load(desiredListItems);

                var deleteItemsCallback = function (sender, args) {
                    var enumerator = desiredListItems.getEnumerator(),
                        i = 0,
                        items = [],
                        totalItems = 0;

                    while (enumerator.moveNext()) {
                        var listItem = enumerator.get_current();
                        items.push(listItem);
                    }

                    totalItems = items.length;
                    for (i; i < totalItems; i++) {
                        items[i].deleteObject();
                    }

                    ctx.executeQueryAsync(
                        Function.createDelegate(this,
                            function () {
                                deferred.resolve(totalItems);
                            }),
                        Function.createDelegate(this,
                            function (sender, args) {
                                deferred.reject(args.get_message());
                            }));
                };

                ctx.executeQueryAsync(deleteItemsCallback,
                    Function.createDelegate(this,
                        function (sender, args) {
                            deferred.reject(args.get_message());
                        }));

                return deferred.promise;
            },

            getListItems: function (listName, query) {
                if (!query) {
                    query = new SP.CamlQuery();
                }

                var deferred = $q.defer(),
                    ctx = SP.ClientContext.get_current(),
                    web = ctx.get_web(),
                    webLists = web.get_lists(),
                    desiredList = webLists.getByTitle(listName),
                    desiredListItems = desiredList.getItems(query);

                ctx.load(desiredListItems);

                var getItemsCallback = function (sender, args) {
                    var enumerator = desiredListItems.getEnumerator(),
                        items = [];

                    while (enumerator.moveNext()) {
                        items.push(enumerator.get_current());
                    }

                    ctx.executeQueryAsync(
                        Function.createDelegate(this,
                            function () {
                                deferred.resolve(items);
                            }),
                        Function.createDelegate(this,
                            function (sender, args) {
                                deferred.reject(args.get_message());
                            }));
                };

                ctx.executeQueryAsync(getItemsCallback,
                    Function.createDelegate(this,
                        function (sender, args) {
                            deferred.reject(args.get_message());
                        }));

                return deferred.promise;
            },

            getCurrentUser: function () {
                var deffered = $q.defer(function () {
                    var ctx = new SP.ClientContext.get_current(),
                        currentUser;

                    currentUser = ctx.get_web().get_currentUser();
                    ctx.load(currentUser);
                    ctx.executeQueryAsync(
                        function () {
                            deffered.resolve(currentUser);
                        },
                        function (sender, args) {
                            deffered.reject(args.get_message());
                        }
                    );
                });

                return deffered.promise;
            }
        };
    });