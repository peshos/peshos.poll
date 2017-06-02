"use strict";

var PeshOS = PeshOS || {};
PeshOS.Poll = PeshOS.Poll || {};

PeshOS.Poll.Configuration = (function () {
    var isConfigured = false,
        defaultPoll = {
            name: 'My poll',
            description: 'This is my first poll',
            width: 400,
            height: 400,
            votebutton: 'vote',
            resultsbutton: 'results',
            voteonce: true,
            disablevoting: false,
            questions: [{ answerText: 'Answer question 1', chartText: 'Chart 1' }, { answerText: 'Answer question 2', chartText: 'Chart 2'}]
        },
        ConfigurationModel = function () {
            if (!PeshOS.Poll.configObj.poll) {
                PeshOS.Poll.configObj.poll = $.extend(true, {}, defaultPoll);
            }

            var self = this;

            self.name = ko.observable(PeshOS.Poll.configObj.poll.name);
            self.name.subscribe(function (newName) {
                PeshOS.Poll.configObj.poll.name = newName;
                PeshOS.Poll.configObj.chartConfiguration.title = newName;
            });

            self.description = ko.observable(PeshOS.Poll.configObj.poll.description);
            self.description.subscribe(function (newDescription) {
                PeshOS.Poll.configObj.poll.description = newDescription;
            });

            self.width = ko.observable(PeshOS.Poll.configObj.poll.width);
            self.width.subscribe(function (newWidth) {
                PeshOS.Poll.configObj.poll.width = newWidth;
            });

            self.height = ko.observable(PeshOS.Poll.configObj.poll.height);
            self.height.subscribe(function (newHeight) {
                PeshOS.Poll.configObj.poll.height = newHeight;
            });

            self.votebutton = ko.observable(PeshOS.Poll.configObj.poll.votebutton);
            self.votebutton.subscribe(function (newVotebutton) {
                PeshOS.Poll.configObj.poll.votebutton = newVotebutton;
            });

            self.resultsbutton = ko.observable(PeshOS.Poll.configObj.poll.resultsbutton);
            self.resultsbutton.subscribe(function (newResultsbutton) {
                PeshOS.Poll.configObj.poll.resultsbutton = newResultsbutton;
            });

            self.voteonce = ko.observable(PeshOS.Poll.configObj.poll.voteonce);
            self.voteonce.subscribe(function (newVoteonce) {
                PeshOS.Poll.configObj.poll.voteonce = newVoteonce;
            });

            self.disablevoting = ko.observable(PeshOS.Poll.configObj.poll.disablevoting);
            self.disablevoting.subscribe(function (newDisablevoting) {
                PeshOS.Poll.configObj.poll.disablevoting = newDisablevoting;
            });

            self.questions = ko.observableArray(PeshOS.Poll.configObj.poll.questions);
            self.questions.subscribe(function (newQuestions) {
                PeshOS.Poll.configObj.poll.questions = newQuestions;
            });

            self.addQuestion = function () {
                self.questions.push({
                    answerText: "Answer question",
                    chartText: "Chart"
                });
            };

            self.removeQuestion = function (question) {
                self.questions.remove(question);
            };
        };

    function configure() {
        if (isConfigured) {
            return;
        }

        ko.cleanNode(document.getElementById('pollConfiguration'));       
        ko.applyBindings(new ConfigurationModel(), document.getElementById('pollConfiguration'));

        isConfigured = true;
    };

    return {
        configure: configure
    }
}());