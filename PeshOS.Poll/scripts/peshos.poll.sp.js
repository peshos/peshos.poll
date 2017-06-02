"use strict";

var PeshOS = PeshOS || {};
PeshOS.Poll = PeshOS.Poll || {};

PeshOS.Poll.SP = (function () {
    var resources = PeshOS.Poll.Resources.getLocaleStrings();

    function readConfiguration(itemId) {
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

    function saveConfiguration(itemId) {
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

    function getActivePollId() {
        var deffered = $.Deferred(function () {
            var ctx = new SP.ClientContext.get_current(),
                web = ctx.get_web(),
                list = web.get_lists().getByTitle(PeshOS.Poll.constants.ConfigurationList),
                collListItem, camlQueryText, camlQuery;

            camlQueryText = new CamlBuilder()
                    .View(["ID"]).RowLimit(1, false)
                    .Query()
                    .Where()
                    .DateField("PeshOSStart").GreaterThanOrEqualTo(CamlBuilder.CamlValues.Today)
                    .And()
                    .DateField("PeshOSEnd").LessThanOrEqualTo(CamlBuilder.CamlValues.Today)
                    .ToString();

            camlQuery = new SP.CamlQuery();
            camlQuery.set_viewXml(camlQueryText);

            collListItem = list.getItems(camlQuery);
            ctx.load(collListItem);
            ctx.executeQueryAsync(
               function () {
                   var listItemEnumerator = collListItem.getEnumerator(),
                       resultId = 0;

                   while (listItemEnumerator.moveNext()) {
                       var oListItem = listItemEnumerator.get_current();
                       if (oListItem) {
                           resultId = oListItem.get_id();
                       }
                   }

                   deffered.resolve(resultId);
               },
               function (sender, args) {
                   deffered.reject(args.get_message());
               }
            );
        });

        return deffered.promise();
    }

    function createPoll(pollname, start, end) {
        var deffered = $.Deferred(function () {
            var ctx = new SP.ClientContext.get_current(),
                oList = ctx.get_web().get_lists().getByTitle(PeshOS.Poll.constants.ConfigurationList),
                oListItem;           

            var itemCreateInfo = new SP.ListItemCreationInformation();
            oListItem = oList.addItem(itemCreateInfo);
            oListItem.set_item('PeshOSName', pollname);
            if (start) {
                oListItem.set_item('PeshOSStart', start);
            }
            if (end) {
                oListItem.set_item('PeshOSEnd', end);
            }            
            oListItem.set_item('PeshOSConfiguration', '{"design":{"chartType":"pie","fill":true,"gridLines":true,"formatString":"%d","legend":"e","maxValue":100,"colors":["#4bb2c5","#eaa228","#c5b47f","#579575","#839557","#958c12","#953579","#4b5de4","#d8b83f","#ff5800","#0085cc","#c747a3","#cddf54","#FBD178","#26B4E3"]},"chartConfiguration":{"title": "My poll", "seriesColors":["#4bb2c5","#eaa228","#c5b47f","#579575","#839557","#958c12","#953579","#4b5de4","#d8b83f","#ff5800","#0085cc","#c747a3","#cddf54","#FBD178","#26B4E3"],"seriesDefaults":{"rendererOptions":{"showDataLabels":true,"dataLabels":"value","fill":true},"pointLabels":{"show":false}},"legend":{"show":true,"location":"e","preDraw":true},"axesDefaults":{},"grid":{}},"poll":{"name":"My poll","description":"This is my first poll","width":400,"height":400,"votebutton":"vote","voteonce":false,"resultsbutton":"results","disablevoting":false,"questions":[{"answerText":"Answer question 1","chartText":"Chart 1"},{"answerText":"Answer question 2","chartText":"Chart 2"}]}}')
            oListItem.update();

            ctx.load(oListItem);
            ctx.executeQueryAsync(
               function () {
                   deffered.resolve(oListItem);
               },
               function (sender, args) {
                   deffered.reject(args.get_message());
               }
            );
        });

        return deffered.promise();
    };

    function createPollVotesList(itemId) {
        var deffered = $.Deferred(function () {
            var ctx = new SP.ClientContext.get_current(),
                web = ctx.get_web(),
                newList;

            var listCreationInfo = new SP.ListCreationInformation();

            listCreationInfo.set_title([PeshOS.Poll.constants.VotesList, '_', itemId].join(''));
            listCreationInfo.set_templateFeatureId(PeshOS.Poll.constants.VotesListTemplateFeatureId);
            listCreationInfo.set_templateType(PeshOS.Poll.constants.VotesListTemplate);

            newList = web.get_lists().add(listCreationInfo);

            ctx.load(newList);
            ctx.executeQueryAsync(
               function () {
                   deffered.resolve(newList);
               },
               function (sender, args) {
                   deffered.reject(args.get_message());
               }
            );
        });

        return deffered.promise();
    };

    function savePoll(itemId, pollname, start, end) {
        var deferred = $.Deferred(),
            ctx = SP.ClientContext.get_current(),
            web = ctx.get_web(),
            list = web.get_lists().getByTitle(PeshOS.Poll.constants.ConfigurationList);

        this.listItem = list.getItemById(itemId);
        this.listItem.set_item('PeshOSName', pollname);
        if (start) {
            this.listItem.set_item('PeshOSStart', start);
        }
        if (end) {
            this.listItem.set_item('PeshOSEnd', end);
        }
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
    }

    function deleteListItems(listName, query) {
        if (!query) {
            query = new SP.CamlQuery();
        }

        var deferred = $.Deferred(),
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

        return deferred;
    }

    function getListItems(listName, query) {
        if (!query) {
            query = new SP.CamlQuery();
        }

        var deferred = $.Deferred(),
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

        return deferred;
    };

    function deletePoll(itemId) {
        var deferred = $.Deferred(),
            ctx = SP.ClientContext.get_current(),
            web = ctx.get_web(),
            list = web.get_lists().getByTitle(PeshOS.Poll.constants.ConfigurationList);

        this.pollList = web.get_lists().getByTitle([PeshOS.Poll.constants.VotesList, '_', itemId].join(''));
        this.pollList.deleteObject();
        this.listItem = list.getItemById(itemId);
        this.listItem.deleteObject();

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

    function getCurrentUser() {
        var deffered = $.Deferred(function () {
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

        return deffered.promise();
    };

    function hasVoted(resultsCollection, userId) {
        var i = 0,
    		max = resultsCollection.length;

        for (i; i < max; ++i) {
            if (resultsCollection[i].authorId == userId) {
                return true;
            }
        }

        return false;
    };

    function getAnswers(pollId) {
        var deffered = $.Deferred(function () {
            var ctx = new SP.ClientContext.get_current(),
                oList = ctx.get_web().get_lists().getByTitle([PeshOS.Poll.constants.VotesList, '_', pollId].join('')),
                collListItem;

            collListItem = oList.getItems(new SP.CamlQuery());
            ctx.load(collListItem);
            ctx.executeQueryAsync(
               function () {
                   var listItemEnumerator = collListItem.getEnumerator(),
                       resultCollection = [];

                   while (listItemEnumerator.moveNext()) {                       
                       var oListItem = listItemEnumerator.get_current();
                       if (oListItem) {
                           resultCollection.push({
                               id: oListItem.get_id(),
                               chartText: oListItem.get_item('PeshOSChart'),
                               authorName: oListItem.get_item('Author').get_lookupValue(),
                               authorId: oListItem.get_item('Author').get_lookupId()
                           });
                       }
                   }
                   
                   deffered.resolve(resultCollection);
               },
               function (sender, args) {
                   deffered.reject(args.get_message());
               }
            );
        });

        return deffered.promise();
    };

    function vote(answerText, chartText, pollId) {
        var deffered = $.Deferred(function () {
            var ctx = new SP.ClientContext.get_current(),
                oList = ctx.get_web().get_lists().getByTitle([PeshOS.Poll.constants.VotesList, '_', pollId].join('')),
                oListItem;

            var itemCreateInfo = new SP.ListItemCreationInformation();
            oListItem = oList.addItem(itemCreateInfo);
            oListItem.set_item('PeshOSAnswer', answerText);
            oListItem.set_item('PeshOSChart', chartText);
            oListItem.update();

            ctx.load(oListItem);
            ctx.executeQueryAsync(
               function () {
                   deffered.resolve(oListItem);
               },
               function (sender, args) {
                   deffered.reject(args.get_message());
               }
            );
        });

        return deffered.promise();
    };

    function exportVotes(pollId, fileName, listItems) {
        var exportData = [[resources.Export_AnswerHeader, resources.Export_AnswerCount]],
                exportCSV = [],
                exportString = null,
                i = 0,
                maxI = listItems.length,
                tempObject = {},
                deffered;

        for (i; i < maxI; ++i) {
            if (!tempObject[listItems[i].get_item('PeshOSAnswer')]) {
                tempObject[listItems[i].get_item('PeshOSAnswer')] = 1;
            } else {
                tempObject[listItems[i].get_item('PeshOSAnswer')] += 1;
            }
        }

        for (var answer in tempObject) {
            exportData.push([answer, tempObject[answer]]);
        }

        i = 0;
        maxI = exportData.length;
        for (i; i < maxI; ++i) {
            exportCSV.push(exportData[i].join(','));
        }

        exportString = exportCSV.join('\n');

        var deffered = $.Deferred(function () {
            var ctx = new SP.ClientContext.get_current(),
                list = ctx.get_web().get_lists().getByTitle(PeshOS.Poll.constants.ExportList),
                fileCreation = new SP.FileCreationInformation(),
                c = 0, newFile;

            fileCreation.set_overwrite(true);
            fileCreation.set_url(fileName + '.csv');
            fileCreation.set_content(new SP.Base64EncodedByteArray());

            for (c; c < exportString.length; ++c) {
                fileCreation.get_content().append(exportString.charCodeAt(c));
            }

            newFile = list.get_rootFolder().get_files().add(fileCreation);
            ctx.load(newFile);
            ctx.executeQueryAsync(
               function () {
                   deffered.resolve(fileCreation.get_url());
               },
               function (sender, args) {
                   deffered.reject(args.get_message());
               }
            );
        });

        return deffered.promise();
    };

    function addChromeControl() {
        var options = {},
            nav;

        options.appTitle = "peshos poll";
        nav = new SP.UI.Controls.Navigation("chromeControl", options);
        nav.setVisible(true);
        nav.setBottomHeaderVisible(false);
    };

    return {
        readConfiguration: readConfiguration,
        saveConfiguration: saveConfiguration,
        getActivePollId: getActivePollId,
        deleteListItems: deleteListItems,
        deletePoll: deletePoll,
        getListItems: getListItems,
        vote: vote,
        getCurrentUser: getCurrentUser,
        hasVoted: hasVoted,
        getAnswers: getAnswers,
        addChromeControl: addChromeControl,
        createPoll: createPoll,
        savePoll: savePoll,
        createPollVotesList: createPollVotesList,
        exportVotes: exportVotes
    };
}());