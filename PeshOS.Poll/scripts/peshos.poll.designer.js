"use strict";

var PeshOS = PeshOS || {};
PeshOS.Poll = PeshOS.Poll || {};

PeshOS.Poll.Designer = (function () {
    var isConfigured = false,
        defaultDesign = {
            chartType: 'pie',
            fill: true,
            gridLines: true,
            formatString: '%d',
            legend: 'e',
            maxValue: 100,
            colors: ['#4bb2c5', '#eaa228', '#c5b47f', '#579575', '#839557', '#958c12', '#953579', '#4b5de4', '#d8b83f', '#ff5800', '#0085cc', '#c747a3', '#cddf54', '#FBD178', '#26B4E3']
        },

		sampleData = [['Heavy Industry', 25], ['Retail', 9], ['Light Industry', 14], ['Out of home', 16], ['Commuting', 7], ['Orientation', 9]],
		sampleBarData = [25, 9, 14, 16, 7, 9],
		sampleBarTicks = ['Heavy Industry', 'Retail', 'Light Industry', 'Out of home', 'Commuting', 'Orientation'],

        defaultPieConfiguration = {
            seriesColors: defaultDesign.colors,
            seriesDefaults: {
                renderer: $.jqplot.PieRenderer,
                rendererOptions: {
                    showDataLabels: true,
                    dataLabels: 'value',
                    fill: true
                }
            },
            legend: { show: true, location: 'e' }
        },
		defaultFunnelConfiguration = {
		    seriesColors: defaultDesign.colors,
		    seriesDefaults: {
		        renderer: $.jqplot.FunnelRenderer,
		        rendererOptions: {
		            showDataLabels: true,
		            dataLabels: 'value',
		            fill: true
		        }
		    },
		    legend: { show: true, location: 'e' }
		},
		defaultHorizontalBarConfiguration = {
		    axesDefaults: {
		        min: 0,
		        max: null,
		        tickOptions: {
		            showGridline: true,
		            formatString: ''
		        }
		    },
		    seriesColors: defaultDesign.colors,
		    seriesDefaults: {
		        renderer: $.jqplot.BarRenderer,
		        rendererOptions: {
		            barDirection: 'horizontal',
		            varyBarColor: true
		        }
		    },
		    axes: {
		        yaxis: {
		            renderer: $.jqplot.CategoryAxisRenderer,
		            ticks: sampleBarTicks
		        }
		    }
		},
		defaultVerticalBarConfiguration = {
		    axesDefaults: {
		        min: 0,
		        max: null,
		        tickOptions: {
		            showGridline: true,
		            formatString: ''
		        }
		    },
		    seriesColors: defaultDesign.colors,
		    seriesDefaults: {
		        renderer: $.jqplot.BarRenderer,
		        rendererOptions: {
		            barDirection: 'vertical',
		            varyBarColor: true
		        }
		    },
		    axes: {
		        xaxis: {
		            renderer: $.jqplot.CategoryAxisRenderer,
		            ticks: sampleBarTicks
		        }
		    }
		},
        DesignerModel = function () {

            if (!PeshOS.Poll.configObj.design) {
                PeshOS.Poll.configObj.design = $.extend(true, {}, defaultDesign);
            }

            var self = this;

            self.chartType = ko.observable(PeshOS.Poll.configObj.design.chartType);
            self.chartType.subscribe(function (newChartType) {
                updateChartType(newChartType);
                resetColors();
                redraw();
            });

            self.fill = ko.observable(PeshOS.Poll.configObj.design.fill);
            self.fill.subscribe(function (newFill) {
                PeshOS.Poll.configObj.design.fill = newFill;
                PeshOS.Poll.configObj.chartConfiguration.seriesDefaults.rendererOptions.fill = newFill;
                redraw();
            });

            self.gridLines = ko.observable(PeshOS.Poll.configObj.design.gridLines);
            self.gridLines.subscribe(function (newGridLines) {
                PeshOS.Poll.configObj.design.gridLines = newGridLines;
                PeshOS.Poll.configObj.chartConfiguration.axesDefaults.tickOptions.showGridline = newGridLines;
                redraw();
            });

            self.formatString = ko.observable(PeshOS.Poll.configObj.design.formatString);
            self.formatString.subscribe(function (newFormatString) {
                PeshOS.Poll.configObj.design.formatString = newFormatString;
                PeshOS.Poll.configObj.chartConfiguration.axesDefaults.tickOptions.formatString = newFormatString;
                redraw();
            });

            self.maxValue = ko.observable(PeshOS.Poll.configObj.design.maxValue);
            self.maxValue.subscribe(function (newMaxValue) {
                PeshOS.Poll.configObj.design.maxValue = newMaxValue;

                if (!newMaxValue) {
                    PeshOS.Poll.configObj.chartConfiguration.axesDefaults.max = null;
                    redraw();
                } else if ($.isNumeric(newMaxValue) && Math.floor(newMaxValue) == newMaxValue && newMaxValue >= 10) {
                    PeshOS.Poll.configObj.chartConfiguration.axesDefaults.max = newMaxValue;
                    redraw();
                } else {
                    alert(resources.Error_Integer);
                    PeshOS.Poll.configObj.chartConfiguration.axesDefaults.max = null;
                    PeshOS.Poll.configObj.design.maxValue = null;
                    self.maxValue('');
                }
            });

            self.legend = ko.observable(PeshOS.Poll.configObj.design.legend);
            self.legend.subscribe(function (newLegend) {

                if (!PeshOS.Poll.configObj.chartConfiguration || !PeshOS.Poll.configObj.chartConfiguration.legend) {
                    return;
                }

                PeshOS.Poll.configObj.design.legend = newLegend;

                if (newLegend == '--') {
                    PeshOS.Poll.configObj.chartConfiguration.legend.show = false;
                    PeshOS.Poll.configObj.chartConfiguration.legend.location = 'e';
                }
                else {
                    PeshOS.Poll.configObj.chartConfiguration.legend.show = true;
                    PeshOS.Poll.configObj.chartConfiguration.legend.location = newLegend;
                }

                redraw();
            });

            self.isPie = function () {
                return self.chartType() == 'pie' || self.chartType() == 'funnel';
            };
            self.isBar = function () {
                return self.chartType() == 'barHorizontal' || self.chartType() == 'barVertical';
            };
        };

    function redraw() {
        $('#pollChart').empty();

        switch (PeshOS.Poll.configObj.design.chartType) {
            case "pie":
            case "funnel":
                $.jqplot('pollChart', [sampleData], PeshOS.Poll.configObj.chartConfiguration);
                break;
            case "barHorizontal":
            case "barVertical":
                $.jqplot('pollChart', [sampleBarData], PeshOS.Poll.configObj.chartConfiguration);
                break;
        };
    }

    function updateChartType(newType) {
        PeshOS.Poll.configObj.design.chartType = newType;

        switch (newType) {
            case 'pie':
                PeshOS.Poll.configObj.chartConfiguration = $.extend(true, {}, defaultPieConfiguration);
                break;
            case 'funnel':
                PeshOS.Poll.configObj.chartConfiguration = $.extend(true, {}, defaultFunnelConfiguration);
                break;
            case 'barHorizontal':
                PeshOS.Poll.configObj.chartConfiguration = $.extend(true, {}, defaultHorizontalBarConfiguration);
                break;
            case 'barVertical':
                PeshOS.Poll.configObj.chartConfiguration = $.extend(true, {}, defaultVerticalBarConfiguration);
                break;
        };
    }

    function addColorEvents() {
        $('.colorButton').colpick({
            layout: 'hex',
            onBeforeShow: function (el) {
                $(this).colpickSetColor($(this).css('background-color'), true);
            },
            onSubmit: function (hsb, hex, rgb, el) {
                var newColor = '#' + hex,
                    arrayIndex = $(el).attr('id').substring(4) - 1;

                PeshOS.Poll.configObj.design.colors[arrayIndex] = newColor;
                PeshOS.Poll.configObj.chartConfiguration.seriesColors[arrayIndex] = newColor;

                $(el).css('background-color', newColor);
                $(el).colpickHide();

                redraw();
            }
        });
    };

    function resetColors() {
        var i = 0,
			maxI = defaultDesign.colors.length;

        for (i; i < maxI; ++i) {
            PeshOS.Poll.configObj.design.colors[i] = defaultDesign.colors[i];
            PeshOS.Poll.configObj.chartConfiguration.seriesColors[i] = defaultDesign.colors[i];
            $('#pcb_' + (i + 1)).css('background-color', defaultDesign.colors[i]);
        }
    };

    function setCurrentColors() {
        var i = 0,
           maxI = PeshOS.Poll.configObj.design.colors.length;

        for (i; i < maxI; ++i) {
            $('#pcb_' + (i + 1)).css('background-color', PeshOS.Poll.configObj.design.colors[i]);
        }
    };

    function configure() {
        if (isConfigured) {
            return;
        }

        ko.cleanNode(document.getElementById('pollDesign'));
        ko.applyBindings(new DesignerModel(), document.getElementById('pollDesign'));

        setCurrentColors();
        addColorEvents();
        
        redraw();

        isConfigured = true;
    };

    return {
        configure: configure
    };
}());