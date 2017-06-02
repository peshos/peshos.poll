'use strict';

angular.module('translationService', [])
    .service('TranslationService', function ($resource) {

        this.getStrings = function ($scope, localeId) {
            var languageFilePath = [PeshOS.Common.queryString('SPAppWebUrl'), '/scripts/resources/strings_', localeId, '.json.txt'].join('');

            //$resource(languageFilePath).get(function (data) {
            //    $scope.STRINGS = angular.fromJson(data);
            //});

            $scope.STRINGS = {
                "Alert_ConfigurationSaved": "he configuration has been saved successfully.",
                "Alert_Deleted": "Deleted",
                "Alert_Error": "Error!",
                "Alert_FileExported": "File exported",
                "Alert_FileExportedMessage": "Get the file from: ",
                "Alert_ItemsDeleted": " items have been deleted.",
                "Alert_NoData": "No data",
                "Alert_NoDataMessage": "There are no votes yet.",
                "Alert_PollRemoved": "The poll has been removed",
                "Alert_Reading": "Reading data",
                "Alert_ReadingConfigurations": "Cannot read the poll configuration list.",
                "Alert_Saved": "Saved",
                "Alert_UnexpectedError": "Refresh the page, try again and complain to a developer.",
                "Buttons_Apply": "apply",
                "Buttons_Cancel": "cancel",
                "Buttons_Close": "close",
                "Buttons_Configuration": "configuration",
                "Buttons_Configure": "configure",
                "Buttons_Delete": "delete",
                "Buttons_Design": "design",
                "Buttons_Edit": "edit",
                "Buttons_Export": "export data",
                "Buttons_Help": "help",
                "Buttons_PreviewSave": "preview and save",
                "Buttons_Reset": "reset data",
                "Buttons_Save": "save",
                "Chart_Colors": "colors",
                "Chart_Fill": "fill",
                "Chart_FormatString": "format string",
                "Chart_Funnel": "funnel",
                "Chart_HorizontalBar": "horizontal bar",
                "Chart_Legend": "legend",
                "Chart_MaxValue": "max value",
                "Chart_Pie": "pie",
                "Chart_ShowGridLines": "grid lines",
                "Chart_Type": "type",
                "Chart_VerticalBar": "vertical bar",
                "Config_AddQuestion": "add question",
                "Config_AnswerText": "answer text",
                "Config_ChartText": "chart text",
                "Config_Delete": "delete",
                "Config_DisableVoting": "disable voting",
                "Config_Height": "height (px)",
                "Config_PollDescription": "poll description",
                "Config_PollName": "poll name",
                "Config_PollQuestions": "poll questions",
                "Config_Questions": "questions",
                "Config_ResultsButton": "results button",
                "Config_VoteButton": "vote button",
                "Config_VoteOnce": "vote once",
                "Config_Width": "width (px)",
                "Export_AnswerCount": "Count",
                "Export_AnswerHeader": "Answer",
                "Export_ModalHeader": "Current votes",
                "Export_NoCurrentVotes": "No votes have been submitted yet.",
                "Export_Overwrite": "Existing files will be overwritten. Continue?",
                "Help_About": "About",
                "Help_AboutMessage": "Visit <a href='http://www.peshos.com' target='_blank' title='peshos'>http://www.peshos.com</a> for more information and contacts.",
                "Help_Configuration": "Configuring",
                "Help_ConfigurationMessage": "The chart width and height only define the size of the web part on the page. The API provides an option to update these on the client. Leave either field empty to ignore that option. If [vote once] is checked, the users will not be able to vote more than once and will only see the results. If voting is disabled users will only be able to see the results so far.",
                "Help_Design": "Designing",
                "Help_DesignMessage": "Changing the chart type will reset the chart definition. This is needed because of the chart structure - some properties are not shared between different types of charts.",
                "Help_Validation": "Validation",
                "Help_ValidationMessage": "There is no validation set on any of the controls. Reason behind this decision is very simple - the controls are simple enough and if one wants to just mess with it, no validation will help. Be smart and use the product as intented. Try avoiding strange characters in the questions as well, as these might end up in script errors. Feedback on this policy is more than welcome.",
                "Landing_DeletePollConfirm": "Are you sure you want to delete this poll?",

                "NewPoll": "new poll",
                "ViewExports": "view exported",
                "Name": "name",
                "ActiveFrom": "avtive from",
                "ActiveTo": "active to",

                "Landing_PollEnd": "active to",
                "Landing_PollName": "name",
                "Landing_Polls": "polls",
                "Landing_PollStart": "active from",
                "Message_DeleteData": "Delete all current votes?",
                "Overlay_Message": "Doing server calls...",
                "Preview_Chart": "chart",
                "Preview_Poll": "poll"
            };
        }
    });