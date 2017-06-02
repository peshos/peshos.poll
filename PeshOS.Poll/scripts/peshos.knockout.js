﻿ko.observable.fn.beginEdit = function (transaction) {

    var self = this;
    var commitSubscription,
        rollbackSubscription;

    // get the current value and store it for editing
    if (self.slice)
        self.editValue = ko.observableArray(self.slice());
    else
        self.editValue = ko.observable(self());

    self.dispose = function () {
        // kill this subscriptions
        commitSubscription.dispose();
        rollbackSubscription.dispose();
    };

    self.commit = function () {
        // update the actual value with the edit value
        self(self.editValue());

        // dispose the subscriptions
        self.dispose();
    };

    self.rollback = function () {
        // rollback the edit value
        self.editValue(self());

        // dispose the subscriptions
        self.dispose();
    };

    //  subscribe to the transation commit and reject calls
    commitSubscription = transaction.subscribe(self.commit, self, "commit");

    rollbackSubscription = transaction.subscribe(self.rollback, self, "rollback");

    return self;
}