'use strict';

angular.module('pollListController', ['translationService', 'constantService', 'sharePointService'])
    .controller('PollListController', function ($scope, TranslationService, ConstantService, SharePointService) {

        //SP.SOD.executeOrDelayUntilScriptLoaded(executeCode, "SP.js");

        function executeCode() {

            TranslationService.getStrings($scope, 1033); // TODO
            ConstantService.getConstant($scope);

            $scope.polls = [];

            

            $scope.disableAdd = false;

            $scope.viewExported = function ($event) {
                $event.preventDefault();
                document.location.href = [PeshOS.Common.queryString('SPAppWebUrl'), '/lists/', $scope.CONSTANT.ExportList].join('');
            };

            $scope.addPoll = function ($event) {

            };

            $scope.configure = function ($event) {
                $event.preventDefault();
                document.location.href = [document.location.href.replace('poll.html', 'poll-details.html'), '&pollId=', $event.currentTarget.attributes.data.value].join('');
            };

            $scope.refresh = function ($event) {
                SharePointService.getListItems($scope.CONSTANT.ConfigurationList).then(
							function (items) {
							    var i = 0,
                                    maxI = items.length;

							    for (i; i < maxI; ++i) {
							        $scope.polls.push(
                                        {
                                            Id: items[i].get_id(),
                                            Name: items[i].get_item('PeshOSName'),
                                            ActiveFrom: items[i].get_item('PeshOSStart') == null ? '' : items[i].get_item('PeshOSStart').format('dd MMM yyyy'),
                                            ActiveTo: items[i].get_item('PeshOSEnd') == null ? '' : items[i].get_item('PeshOSEnd').format('dd MMM yyyy')
                                        }
							        );
							    }
							},
							function (sender, args) {
							    $('#alertReadingConfigurations').show();
							});
            };

            $scope.refresh();
        };

        executeCode();
    });