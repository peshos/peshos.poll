"use strict";

var PeshOS = PeshOS || {};
PeshOS.Poll = PeshOS.Poll || {};

PeshOS.Poll.Runtime = (function () {  

    var PollModel = function (votingEnabled, voteResults) {
        var self = this;
        
        self.showQuestions = ko.observable(votingEnabled);
        self.showChart = ko.observable(!votingEnabled);
        self.canVote = ko.observable(votingEnabled);
        self.disableVote = ko.observable(false);        
        self.canSeeResults = ko.observable(true);

        self.name = PeshOS.Poll.configObj.poll.name;
        self.description = PeshOS.Poll.configObj.poll.description;
        self.questions = PeshOS.Poll.configObj.poll.questions;
        self.votebutton = PeshOS.Poll.configObj.poll.votebutton;
        self.resultsbutton = PeshOS.Poll.configObj.poll.resultsbutton;

        self.vote = function () {
            var selectedVote = $('input[type="radio"][name="pollQuestions"]:checked'),
                aText = selectedVote.attr('answerText'),
                cText = selectedVote.val();
            PeshOS.Poll.SP.vote(aText, cText, PeshOS.Poll.configObj.id).then(
                function () {                    
                    voteResults[cText] += 1;
                    if (PeshOS.Poll.configObj.poll.voteonce) {
                        self.canVote(false);
                    }
                    self.results();
                },
                function () {
                    PeshOS.Poll.Runtime.handleError();
                });            
        };

        self.results = function () {
            self.showQuestions(false);
            self.showChart(true);
            self.updateChart();
        };

        self.updateChart = function () {
            var data = [],
                totalVotes = 0;
            switch (PeshOS.Poll.configObj.design.chartType) {
                case "pie":
                case "funnel":
                    for (var answer in voteResults) {
                        data.push([answer, voteResults[answer]]);
                        totalVotes += voteResults[answer];
                    }
                    break;
                case "barHorizontal":
                    PeshOS.Poll.configObj.chartConfiguration.axes.yaxis.ticks = [];
                    for (var answer in voteResults) {
                        PeshOS.Poll.configObj.chartConfiguration.axes.yaxis.ticks.push(answer);
                        data.push(voteResults[answer]);
                        totalVotes += voteResults[answer];
                    }
                    break;
                case "barVertical":
                    PeshOS.Poll.configObj.chartConfiguration.axes.xaxis.ticks = [];
                    for (var answer in voteResults) {
                        PeshOS.Poll.configObj.chartConfiguration.axes.xaxis.ticks.push(answer);
                        data.push(voteResults[answer]);
                        totalVotes += voteResults[answer];
                    }
                    break;
            }
            
            if (totalVotes == 0) {
                $('#alertNoData').show();
            } else {
                $('#alertNoData').hide();
                $('#peshosChart').empty();
                PeshOS.Poll.configObj.chartConfiguration.title = PeshOS.Poll.configObj.poll.name;
                $.jqplot('peshosChart', [data], PeshOS.Poll.configObj.chartConfiguration);
            }            
        };

        self.backToVote = function () {
            self.showChart(false);
            self.showQuestions(true);
        };

        if (!votingEnabled) {
            self.updateChart();
        }
    };

    function configure() {
        if (PeshOS.Poll.configObj.poll.width && PeshOS.Poll.configObj.poll.height) {
            PeshOS.Common.resizeApp(PeshOS.Poll.configObj.poll.width, PeshOS.Poll.configObj.poll.height);
        }

        var votingEnabled = true,
            voteResults = {},
            q = 0,
            maxQ = PeshOS.Poll.configObj.poll.questions.length;

        for (q; q < maxQ; ++q) {
            voteResults[PeshOS.Poll.configObj.poll.questions[q].chartText] = 0;
        }

        PeshOS.Poll.SP.getAnswers(PeshOS.Poll.configObj.id).then(
							function (results) {
							    PeshOS.Poll.SP.getCurrentUser().then(
									function (user) {                                        
									    if (PeshOS.Poll.SP.hasVoted(results, user.get_id()) && PeshOS.Poll.configObj.poll.voteonce) {
									        votingEnabled = false;
									    }

									    if (PeshOS.Poll.configObj.poll.disablevoting) {
									        votingEnabled = false;
									    }

									    var i = 0,
                                            maxI = results.length;

									    for (i; i < maxI; ++i) {
									        if (typeof(voteResults[results[i].chartText]) == "undefined") {
									            continue;
									        } else {
									            voteResults[results[i].chartText] += 1;
									        }
									    }

									    ko.cleanNode(document.getElementById('peshosPoll'));
									    ko.applyBindings(new PollModel(votingEnabled, voteResults), document.getElementById('peshosPoll'));

									},
									function (sender, args) {
									    PeshOS.Poll.Runtime.handleError();
									});
							},
							function (sender, args) {
							    PeshOS.Poll.Runtime.handleError();
							});

    };

    function handleError(err) {
        $('#alertError').show();
        $('#peshosPollBody').hide();
    };

    return {
        configure: configure,
        handleError: handleError
    };
}());