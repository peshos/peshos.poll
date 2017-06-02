'use strict';

angular.module('constantService', [])
    .service('ConstantService', function () {

        this.getConstant = function ($scope) {

            $scope.CONSTANT = {
                ConfigurationList: 'PollConfiguration',
                VotesList: 'PollVotes',
                ExportList: 'PollExports',
                VotesListTemplate: 10001,
                VotesListTemplateFeatureId: '89836f36-72ea-4af4-9b3f-8550a00d5875'
            };
        }
    });