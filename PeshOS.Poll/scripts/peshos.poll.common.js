"use strict";

var PeshOS = PeshOS || {};
PeshOS.Poll = PeshOS.Poll || {};

PeshOS.Poll.Common = (function () {
    function updateChartRenderers() {
        switch (PeshOS.Poll.configObj.design.chartType) {
            case "pie":
                PeshOS.Poll.configObj.chartConfiguration.seriesDefaults.renderer = $.jqplot.PieRenderer;
                break;
            case "funnel":
                PeshOS.Poll.configObj.chartConfiguration.seriesDefaults.renderer = $.jqplot.FunnelRenderer;
                break;
            case "barHorizontal":
                PeshOS.Poll.configObj.chartConfiguration.seriesDefaults.renderer = $.jqplot.BarRenderer;
                PeshOS.Poll.configObj.chartConfiguration.axes.yaxis.renderer = $.jqplot.CategoryAxisRenderer;
                break;
            case "barVertical":
                PeshOS.Poll.configObj.chartConfiguration.seriesDefaults.renderer = $.jqplot.BarRenderer;
                PeshOS.Poll.configObj.chartConfiguration.axes.xaxis.renderer = $.jqplot.CategoryAxisRenderer;
                break;
        };
    };

    return {
        updateChartRenderers: updateChartRenderers
    }
}());