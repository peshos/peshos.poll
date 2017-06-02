"use strict";

var PeshOS = PeshOS || {};
PeshOS.Poll = PeshOS.Poll || {};

PeshOS.Poll.Edit = (function () {
    var resources = PeshOS.Poll.Resources.getLocaleStrings(),
        PreviewButtonsModel = function () {
            var self = this;

            self.save = function () {
                PeshOS.Poll.SP.saveConfiguration(PeshOS.Common.queryString('pollId')).then(
                    function () { $('#alertSaved').show(); },
                    function () { $('#alertError').show(); });
            };

            self.close = function () {
                document.location.href = PeshOS.Common.removeURLParameter(
                    document.location.href.replace('peshos.poll.edit', 'peshos.poll.landing'), 
                    'pollId');
            };

            self.reset = function () {
                if (confirm(resources.Message_DeleteData)) {
                    PeshOS.Poll.SP.deleteListItems([PeshOS.Poll.constants.VotesList, '_', PeshOS.Common.queryString('pollId')].join('')).then(
                        function (totalItems) { $('#alertTotalItems').text(totalItems); $('#alertItemsDeleted').show(); },
                        function () { $('#alertError').show(); });
                }
            };
        },
        
        EditModel = function () {
            var self = this;

            self.helpInfo = function () {
                $('#pollDesign').hide();
                $('#pollPreviewSave').hide();                
                $('#pollConfiguration').hide();
                $('#pollHelp').show();
            };

            self.configuration = function () {
                $('#pollDesign').hide();
                $('#pollPreviewSave').hide();
                $('#pollHelp').hide();
                $('#pollConfiguration').show();
                PeshOS.Poll.Configuration.configure();
            };

            self.design = function () {
                $('#pollConfiguration').hide();
                $('#pollPreviewSave').hide();
                $('#pollHelp').hide();
                $('#pollDesign').show();
                PeshOS.Poll.Designer.configure();
            };

            self.previewSave = function () {
                $('#pollConfiguration').hide();
                $('#pollDesign').hide();
                $('#pollHelp').hide();
                $('#pollPreviewSave').show();
                
                ko.cleanNode(document.getElementById('pollPreviewButtons'));
                ko.applyBindings(new PreviewButtonsModel(), document.getElementById('pollPreviewButtons'));

                ko.cleanNode(document.getElementById('pollPollPreview'));
                ko.applyBindings(PeshOS.Poll.configObj.poll, document.getElementById('pollPollPreview'));

                $('#pollChartPreview').empty();
                $.jqplot('pollChartPreview', [self.getChartData()], PeshOS.Poll.configObj.chartConfiguration);
            };

            self.getChartData = function () {
                var data = [['Heavy Industry', 25], ['Retail', 9], ['Light Industry', 14], ['Out of home', 16], ['Commuting', 7], ['Orientation', 9]],
                    i = 0, maxI = PeshOS.Poll.configObj.poll.questions.length;

                switch (PeshOS.Poll.configObj.design.chartType) {
                    case "pie":
                    case "funnel":
                        data = [];
                        for (i; i < maxI; ++i) {                            
                            data.push([PeshOS.Poll.configObj.poll.questions[i].chartText, Math.floor(Math.random() * 100)]);
                        }
                        break;
                    case "barHorizontal":
                        data = [];
                        PeshOS.Poll.configObj.chartConfiguration.axes.yaxis.ticks = [];
                        for (i; i < maxI; ++i) {
                            PeshOS.Poll.configObj.chartConfiguration.axes.yaxis.ticks.push(PeshOS.Poll.configObj.poll.questions[i].chartText);
                            data.push(Math.floor(Math.random() * 100));
                        }
                        break;
                    case "barVertical":
                        data = [];
                        PeshOS.Poll.configObj.chartConfiguration.axes.xaxis.ticks = [];
                        for (i; i < maxI; ++i) {
                            PeshOS.Poll.configObj.chartConfiguration.axes.xaxis.ticks.push(PeshOS.Poll.configObj.poll.questions[i].chartText);
                            data.push(Math.floor(Math.random() * 100));
                        }
                        break;
                    default:
                        break;
                }
                return data;
            };            
        }

    function configure() {
        ko.cleanNode(document.getElementById('pollTopMenu'));
        ko.applyBindings(new EditModel(), document.getElementById('pollTopMenu'));
    };

    return {
        configure: configure
    };
}());