"use strict";

var PeshOS = PeshOS || {};

PeshOS.Poll = PeshOS.Poll || {};

PeshOS.Poll.Resources = (function () {

    var UIStrings = {};

    UIStrings.EN = {
        Message_DeleteData: 'Delete all current votes?',

        Overlay_Message: 'Doing server calls...',

        Export_ModalHeader: 'Current votes',
        Export_AnswerHeader: 'Answer',
        Export_AnswerCount: 'Count',
        Export_NoCurrentVotes: 'No votes have been submitted yet.',
        Export_Overwrite: 'Existing files will be overwritten. Continue?',

        Help_Validation: 'Validation',
        Help_ValidationMessage: 'There is no validation set on any of the controls. Reason behind this decision is very simple - the controls are simple enough and if one wants to just mess with it, no validation will help. Be smart and use the product as intented. Try avoiding strange characters in the questions as well, as these might end up in script errors. Feedback on this policy is more than welcome.',
        Help_Design: 'Designing',
        Help_DesignMessage: 'Changing the chart type will reset the chart definition. This is needed because of the chart structure - some properties are not shared between different types of charts.',
        Help_Configuration: 'Configuring',
        Help_ConfigurationMessage: 'The chart width and height only define the size of the web part on the page. The API provides an option to update these on the client. Leave either field empty to ignore that option. If "vote once" is checked, the users will not be able to vote more than once and will only see the results. If voting is disabled users will only be able to see the results so far.',
        Help_About: 'About',
        Help_AboutMessage: 'Visit <a href="http://peshos.com" target="_blank" title="peshos">http://peshos.com</a> for more information and contacts.',

        Alert_Saved: 'Saved',
        Alert_ConfigurationSaved: 'The configuration has been saved successfully.',
        Alert_Deleted: 'Deleted',
        Alert_ItemsDeleted: ' items have been deleted.',
        Alert_Error: 'Error!',
        Alert_UnexpectedError: 'Refresh the page, try again and complain to a developer.',
        Alert_NoData: 'No data',
        Alert_NoDataMessage: 'There are no votes yet.',
        Alert_Reading: 'Reading data',
        Alert_ReadingConfigurations: 'Cannot read the poll configuration list.',
        Alert_PollRemoved: 'The poll has been removed',
        Alert_FileExported: 'File exported',
        Alert_FileExportedMessage: 'Get the file from: ',

        Buttons_Close: 'close',
        Buttons_Design: 'design',
        Buttons_Save: 'save',
        Buttons_Export: 'export data',
        Buttons_Reset: 'reset data',
        Buttons_Help: 'help',
        Buttons_PreviewSave: 'preview and save',
        Buttons_Configuration: 'configuration',
        Buttons_Edit: 'edit',
        Buttons_Delete: 'delete',
        Buttons_Apply: 'apply',
        Buttons_Cancel: 'cancel',
        Buttons_Configure: 'configure',

        Landing_Polls: 'polls',
        Landing_NewPoll: 'new poll',
        Landing_NewPoll_Description: 'create a new poll',
        Landing_ViewExports: 'view exported',
        Landing_ViewExports_Description: 'view exported files',
        Landing_PollName: 'name',
        Landing_PollStart: 'active from',
        Landing_PollEnd: 'active to',
        Landing_DeletePollConfirm: 'Are you sure you want to delete this poll?',

        Config_PollName: 'poll name',
        Config_PollDescription: 'poll description',
        Config_PollQuestions: 'poll questions',
        Config_Questions: 'questions',
        Config_AnswerText: 'answer text',
        Config_ChartText: 'chart text',
        Config_AddQuestion: 'add question',
        Config_Delete: 'delete',
        Config_Width: 'width (px)',
        Config_Height: 'height (px)',
        Config_VoteButton: 'vote button',
        Config_VoteOnce: 'vote once',
        Config_ResultsButton: 'results button',
        Config_DisableVoting: 'disable voting',

        Chart_Type: 'type',
        Chart_Colors: 'colors',
        Chart_Pie: 'pie',
        Chart_Funnel: 'funnel',
        Chart_HorizontalBar: 'horizontal bar',
        Chart_VerticalBar: 'vertical bar',
        Chart_Fill: 'fill',
        Chart_ShowGridLines: 'grid lines',
        Chart_FormatString: 'format string',
        Chart_MaxValue: 'max value',
        Chart_Legend: 'legend',

        Preview_Poll: 'poll',
        Preview_Chart: 'chart'
    };

    function getLocaleStrings() {
        return UIStrings.EN;
    };

    function translatePage() {
        var lang = getLocaleStrings();

        $('[localeid]').each(function () {
            if ($(this).attr("localehtml")) {
                $(this).html(lang[$(this).attr('localeid')]);
            } else {
                $(this).text(lang[$(this).attr('localeid')]);
            }
        });
    };

    return {
        getLocaleStrings: getLocaleStrings,
        translatePage: translatePage
    };
})();