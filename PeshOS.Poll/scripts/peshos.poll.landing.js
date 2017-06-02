"use strict";

var PeshOS = PeshOS || {};
PeshOS.Poll = PeshOS.Poll || {};

PeshOS.Poll.Landing = (function () {
   
    var resources = PeshOS.Poll.Resources.getLocaleStrings(),
        LandingModel = function () {
            var self = this;

            self.polls = ko.observableArray([]);           

            self.editingItem = ko.observable();
            self.editTransaction = new ko.subscribable();

            self.canAddPoll = ko.observable(true);

            self.isItemEditing = function (poll) {
                return poll == self.editingItem();
            };

            self.isItemSaved = function (poll) {
                return poll != null && poll.id() != 0;
            };

            self.addPoll = function () {
                var poll = new PeshOS.Poll.Landing.Poll(0, 'New poll', '', '');

                self.polls.push(poll);
                self.editPoll(poll);

                self.canAddPoll(false);
            };

            self.viewExported = function () {
                document.location.href = [PeshOS.Common.queryString('SPAppWebUrl'), '/lists/', PeshOS.Poll.constants.ExportList].join('');
            };

            self.removePoll = function (poll) {
                if (self.editingItem() == null) {
                    if (confirm(resources.Landing_DeletePollConfirm)) {
                        if (poll.id() == 0) {
                            self.canAddPoll(true);
                            self.polls.remove(poll);
                        } else {
                            $('#overlay').show();
                            PeshOS.Poll.SP.deletePoll(poll.id()).then(
                                function () {
                                    $('#overlay').hide();
                                    self.polls.remove(poll);
                                },
                                function (message) {
                                    $('#overlay').hide();
                                    $('#spError').text(message);
                                    $('#alertSPError').show();
                                });                            
                        }                                                
                    }
                }
            };

            self.editPoll = function (poll) {
                if (self.editingItem() == null) {
                    poll.beginEdit(self.editTransaction);
                    self.editingItem(poll);
                    
                    $('#startDate_' + poll.id()).DatePicker({
                        onStart: function () {
                            //this.set(poll.start.editValue())
                            var date = new Date();
                            this.set('select', [date.getFullYear(), date.getMonth() + 1, date.getDate()]);
                        }
                    });
                    //$('#startDate_' + poll.id()).DatePicker({
                    //    defaultDate: poll.start.editValue(),
                    //    pickTime: false
                    //});
                    //$('#endDate_' + poll.id()).datetimepicker({
                    //    defaultDate: poll.end.editValue(),
                    //    pickTime: false
                    //});   
                }
            };

            self.applyPoll = function (poll) {
                $('#alertSPError').hide();
                self.editTransaction.notifySubscribers(null, "commit");

                if (poll.id() == 0) {
                    $('#overlay').show();
                    PeshOS.Poll.SP.createPoll(poll.pollname(), poll.start(), poll.end()).then(
                        function (newItem) {
                            var newId = newItem.get_id();
                            poll.id(newId);
                            poll.startId('startDate_' + newId);
                            poll.endId('endDate_' + newId);

                            PeshOS.Poll.SP.createPollVotesList(newId).then(
                                function (newList) {
                                    $('#overlay').hide();
                                    self.editingItem(null);
                                    self.canAddPoll(true);
                                },
                                function (message) {
                                    $('#overlay').hide();
                                    self.editingItem(null);
                                    $('#spError').text(message);
                                    $('#alertSPError').show();
                                });                            
                        },
                        function (message) {
                            $('#overlay').hide();
                            self.editingItem(null);
                            $('#spError').text(message);
                            $('#alertSPError').show();
                        });
                }
                else {
                    $('#overlay').show();
                    PeshOS.Poll.SP.savePoll(poll.id(), poll.pollname(), poll.start(), poll.end()).then(
                        function (newItem) {
                            $('#overlay').hide();
                            self.editingItem(null);
                        },
                        function (message) {
                            $('#overlay').hide();
                            self.editingItem(null);
                            $('#spError').text(message);
                            $('#alertSPError').show();
                        });
                }
            };

            self.cancelEdit = function (poll) {
                self.editTransaction.notifySubscribers(null, "rollback");
                self.editingItem(null);
            };

            self.exportPollData = function (poll) {
                if (confirm(resources.Export_Overwrite)) {
                    $('#overlay').show();
                    PeshOS.Poll.SP.getListItems([PeshOS.Poll.constants.VotesList, '_', poll.id()].join('')).then(
                        function (listItems) {
                            PeshOS.Poll.SP.exportVotes(poll.id(), poll.pollname(), listItems).then(
                                function (fileUrl) {
                                    var newFileUrl = [PeshOS.Common.queryString('SPAppWebUrl'), '/lists/', PeshOS.Poll.constants.ExportList, '/', fileUrl].join('');
                                    $('#exportedFile').attr('href', newFileUrl).text(fileUrl);
                                    $('#overlay').hide();
                                    $('#alertExportedFile').show();
                                },
                                function (sendcer, args) {
                                    $('#overlay').hide();
                                    $('#spError').text(message);
                                    $('#alertSPError').show();
                                });;
                        },
                        function (sender, args) {
                            $('#overlay').hide();
                            $('#spError').text(message);
                            $('#alertSPError').show();
                        });
                }
            };

            self.configurePoll = function (poll) {
                document.location.href = [document.location.href.replace('peshos.poll.landing', 'peshos.poll.edit'), '&pollId=', poll.id()].join('');
            };
        };

    function configure() {
        PeshOS.Poll.SP.getListItems(PeshOS.Poll.constants.ConfigurationList).then(
							function (items) {
							    var i = 0,
                                    maxI = items.length,
							        polls = [];

							    for (i; i < maxI; ++i) {
							        polls.push(new PeshOS.Poll.Landing.Poll(
							            items[i].get_id(),
							            items[i].get_item('PeshOSName'),
							            items[i].get_item('PeshOSStart') == null ? '' : items[i].get_item('PeshOSStart').format('dd MMM yyyy'),
							            items[i].get_item('PeshOSEnd') == null ? '' : items[i].get_item('PeshOSEnd').format('dd MMM yyyy')
							        ));
							    }

							    $('#pollLanding').show();

							    var model = new LandingModel();
							    model.polls(polls);

							    ko.cleanNode(document.getElementById('pollLanding'));
							    ko.applyBindings(model, document.getElementById('pollLanding'));
							},
							function (sender, args) {
							    $('#alertReadingConfigurations').show();
							});

    };

    return {
        configure: configure
    };
}());


PeshOS.Poll.Landing.Poll = function(id, pollname, start, end) {
    var self = this;
    self.id = ko.observable(id);
    self.pollname = ko.observable(pollname);
    self.start = ko.observable(start);
    self.startId = ko.observable('startDate_' + id)
    self.end = ko.observable(end);
    self.endId = ko.observable('endDate_' + id)
};

PeshOS.Poll.Landing.Poll.prototype.beginEdit = function (transaction) {
    this.pollname.beginEdit(transaction);
    this.start.beginEdit(transaction);
    this.end.beginEdit(transaction);
}