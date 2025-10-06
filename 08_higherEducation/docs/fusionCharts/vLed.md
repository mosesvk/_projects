Chart captions
Using these attributes, you can set the various headings and titles of chart like caption, sub-caption.

chart : {
caption : String [+]
subCaption : String [+]
}
Chart Caption Cosmetics
These attributes let you configure the cosmetics of chart caption and sub-caption.

chart : {
captionAlignment : String [+]
captionOnTop : Boolean [+]
captionFontSize : Number [+]
subCaptionFontSize : Number [+]
captionFont : String [+]
subCaptionFont : String [+]
captionFontColor : Color [+]
subCaptionFontColor : Color [+]
captionFontBold : Boolean [+]
subCaptionFontBold : Boolean [+]
alignCaptionWithCanvas : Boolean [+]
captionHorizontalPadding : Number [+]
}
Functional Attributes
These attributes let you control a variety of functional elements on the chart. For example, you can opt to show/hide data labels, data values. You can also set chart limits and extended properties.

chart : {
animation : Boolean [+]
animationDuration : Number [+]
clickURL : URL in FusionCharts format [+]
palette : Number [+]
paletteThemeColor : Color [+]
autoScale : Boolean [+]
manageResize : Boolean [+] 3.2
origW : Number [+]
origH : Number [+]
showValue : Boolean [+]
showShadow : Boolean [+]
showPrintMenuItem : Boolean [+]
refreshInstantly : Boolean [+] 3.2
useEllipsesWhenOverflow : Boolean [+] 3.2
hasRTLText : Number [+] 3.7.0
theme : String [+]
}
Chart Message-related Attributes
These attributes let you set and configure custom chart messages, using text as well as images. These attributes are supported in FusionCharts constructor (FusionCharts({ })).

FusionCharts : {
baseChartMessageFont : String [+] 3.5.0
baseChartMessageFontSize : Number [+] 3.5.0
baseChartMessageColor : Color [+] 3.5.0
baseChartMessageImageHAlign : String [+] 3.7.0
baseChartMessageImageVAlign : String [+] 3.7.0
baseChartMessageImageAlpha : Number [+] 3.7.0
baseChartMessageImageScale : Number [+] 3.7.0
loadMessage : String [+] 3.7.0
loadMessageFont : String [+] 3.5.0
loadMessageFontSize : Number [+] 3.5.0
loadMessageColor : Color [+] 3.5.0
loadMessageImageHAlign : String [+] 3.7.0
loadMessageImageVAlign : String [+] 3.7.0
loadMessageImageAlpha : Number [+] 3.7.0
loadMessageImageScale : Number [+] 3.7.0
typeNotSupportedMessage : String [+] 3.7.0
typeNotSupportedMessageFont : String [+] 3.5.0
typeNotSupportedMessageFontSize : Number [+] 3.5.0
typeNotSupportedMessageColor : Color [+] 3.5.0
typeNotSupportedMessageImageHAlign : String [+] 3.7.0
typeNotSupportedMessageImageVAlign : String [+] 3.7.0
typeNotSupportedMessageImageAlpha : Number [+] 3.7.0
typeNotSupportedMessageImageScale : Number [+] 3.7.0
renderErrorMessage : String [+] 3.7.0
renderErrorMessageFont : String [+] 3.5.0
renderErrorMessageFontSize : Number [+] 3.5.0
renderErrorMessageColor : Color [+] 3.5.0
renderErrorMessageImageHAlign : String [+] 3.7.0
renderErrorMessageImageVAlign : String [+] 3.7.0
renderErrorMessageImageAlpha : Number [+] 3.7.0
renderErrorMessageImageScale : Number [+] 3.7.0
dataLoadStartMessage : String [+] 3.7.0
dataLoadStartMessageFont : String [+] 3.5.0
dataLoadStartMessageFontSize : String [+] 3.5.0
dataLoadStartMessageColor : Color [+] 3.5.0
dataLoadStartMessageImageHAlign : String [+] 3.7.0
dataLoadStartMessageImageVAlign : String [+] 3.7.0
dataLoadStartMessageImageAlpha : Number [+] 3.7.0
dataLoadStartMessageImageScale : Number [+] 3.7.0
dataEmptyMessage : String [+] 3.7.0
dataEmptyMessageFont : String [+] 3.5.0
dataEmptyMessageFontSize : Number [+] 3.5.0
dataEmptyMessageColor : Color [+] 3.5.0
dataEmptyMessageImageHAlign : String [+] 3.7.0
dataEmptyMessageImageVAlign : String [+] 3.7.0
dataEmptyMessageImageAlpha : Number [+] 3.7.0
dataEmptyMessageImageScale : Number [+] 3.7.0
dataLoadErrorMessage : String [+] 3.7.0
dataLoadErrorMessageFont : String [+] 3.5.0
dataLoadErrorMessageFontSize : Number [+] 3.5.0
dataLoadErrorMessageColor : Color [+] 3.5.0
dataLoadErrorMessageImageHAlign : String [+] 3.7.0
dataLoadErrorMessageImageVAlign : String [+] 3.7.0
dataLoadErrorMessageImageAlpha : Number [+] 3.7.0
dataLoadErrorMessageImageScale : Number [+] 3.7.0
dataInvalidMessage : String [+] 3.7.0
dataInvalidMessageFont : String [+] 3.5.0
dataInvalidMessageFontSize : Number [+] 3.5.0
dataInvalidMessageColor : Color [+] 3.5.0
dataInvalidMessageImageHAlign : String [+] 3.7.0
dataInvalidMessageImageVAlign : String [+] 3.7.0
dataInvalidMessageImageAlpha : Number [+] 3.7.0
dataInvalidMessageImageScale : Number [+] 3.7.0
}
Axis & Tick mark properties
The following attributes configures the Axis and the tick marks on the chart.

chart : {
setAdaptiveMin : Boolean [+]
upperLimit : Number [+]
lowerLimit : Number [+]
lowerLimitDisplay : String [+]
upperLimitDisplay : String [+]
showTickMarks : Boolean [+]
showTickValues : Boolean [+]
showLimits : Boolean [+]
adjustTM : Boolean [+]
ticksOnRight : Boolean [+]
majorTMNumber : Number [+]
majorTMColor : Color [+]
majorTMAlpha : Number [+]
majorTMHeight : Number [+]
majorTMThickness : Number [+]
minorTMNumber : Number [+]
minorTMColor : Color [+]
minorTMAlpha : Number [+]
minorTMHeight : Number [+]
minorTMThickness : Number [+]
tickMarkDistance : Number [+]
tickValueDistance : Number [+]
tickValueStep : Number [+]
tickValueDecimals : Number [+]
forceTickValueDecimals : Boolean [+]
}
Real-time properties
Using these attributes, you can configure the real-time feature.

chart : {
dataStreamURL : URL [+]
refreshInterval : Number [+]
dataStamp : String [+]
showRTMenuItem : Boolean [+]
}
Gauge Scale (Color Range) Properties
Using the following attributes you can configure the functional and cosmetic properties of the gauge scale.

chart : {
gaugeFillColor : Color [+]
showGaugeBorder : Boolean [+]
gaugeBorderColor : Color [+]
gaugeBorderThickness : Number [+]
gaugeBorderAlpha : Number [+]
}
LED Properties
The following attributes let you configure the LED properties:

chart : {
ledSize : Number [-]
This sets the size of each LED bar.

Range: In pixels

ledGap : Number [-]
This sets the distance or the gap between two LED bars.

Range: In pixels

useSameFillColor : Boolean [+]
useSameFillBgColor : Boolean [+]
}
Message Logger
FusionWidgets XT uses the concept of streaming and showing real-time messages in the chart using Message Logger. The Message logger can be effectively used to show necessary real-time information or live error logs.

chart : {
useMessageLog : Boolean [+]
messageLogWPercent : Number [+]
messageLogHPercent : Number [+]
messageLogShowTitle : Boolean [+]
messageLogTitle : String [+]
messageLogColor : Color [+]
messageGoesToLog : Boolean [+]
messageGoesToJS : Boolean [+]
messageJSHandler : String [+]
messagePassAllToJS : Boolean [+]
}
Number Formatting Properties
Using the attributes below, you can control a myriad of options like: Formatting of commas and decimals Number prefixes and suffixes Decimal places to which the numbers will round to Scaling of numbers based on a user defined scale Custom number input formats

chart : {
formatNumber : Boolean [+]
numberPrefix : String [+]
numberSuffix : String [+]
decimals : Number [+]
forceDecimals : Boolean [+]
formatNumberScale : Boolean [+]
defaultNumberScale : String [+]
numberScaleUnit : String [+]
numberScaleValue : String [+]
forceNumberScale : Boolean [+] 3.9.0
scaleRecursively : Boolean [+]
maxScaleRecursion : Number [+]
scaleSeparator : String [+]
decimalSeparator : String [+]
thousandSeparator : String [+]
thousandSeparatorPosition : Number [+] 3.2 - SR1
inDecimalSeparator : String [+]
inThousandSeparator : String [+]
}
Chart Cosmetics
The following attributes let you configure chart cosmetics like background color, background alpha, canvas color & alpha etc.

chart : {
bgColor : Color [+]
bgAlpha : Number [+]
bgRatio : Numbers separated by comma [+]
bgAngle : Number [+]
showBorder : Boolean [+]
borderColor : Color [+]
borderThickness : Number [+]
borderAlpha : Number [+]
bgImage : String [+]
bgImageAlpha : Number [+]
bgImageDisplayMode : String [+] 3.2
bgImageVAlign : String [+] 3.2
bgImageHAlign : String [+] 3.2
bgImageScale : Number [+] 3.2
logoURL : String [+]
logoLeftMargin : Number [+]
logoTopMargin : Number [+]
logoPosition : String [+]
logoAlpha : Number [+]
logoScale : Number [+]
logoLink : String [+]
}
Data Value Cosmetics
These attributes let you configure font, background and border cosmetics, of value text-field that appear for each data plot.

chart : {
valueFont : String [+]
valueFontColor : Color [+]
valueFontSize : Number [+]
valueFontBold : Boolean [+]
valueFontItalic : Boolean [+]
valueBgColor : Color [+]
valueBorderColor : Color [+]
valueAlpha : Number [+]
valueFontAlpha : Number [+]
valueBgAlpha : Number [+]
valueBorderAlpha : Number [+]
valueBorderThickness : Number [+]
valueBorderPadding : Number [+]
valueBorderRadius : Number [+]
valueBorderDashed : Boolean [+]
valueBorderDashLen : Number [+]
valueBorderDashGap : Number [+]
textOutline : Boolean [+] 3.14.0
}
Font Properties
Using the attributes below, you can define the generic font properties for all the text on the chart. These attributes allow you a high level control over font properties. If you intend to specify font properties for individual chart elements (like Caption, sub-caption etc.), you'll need to use the Styles feature. Using Styles, you can also specify advanced font properties like Bold, Italics, HTML Mode etc. Using Styles you can also configure real-time values.

chart : {
baseFont : String [+]
baseFontSize : Number [+]
baseFontColor : Color [+]
}
Tooltip Attributes
These attributes let you control the tooltip. You can set the background color, border color, separator character and few other details.

chart : {
showToolTip : Boolean [+]
toolTipBgColor : Color [+]
toolTipColor : Color [+]
toolTipBorderColor : Color [+]
tooltipBorderAlpha : Number [+]
showToolTipShadow : Boolean [+]
plottooltext : String [+]
tooltipPosition : String [+]
}
Toolbar Attributes
Using this set of attributes, you can customize the toolbar on the chart. The advantage of having a toolbar is that it manages all the UI action elements (context menus, checkboxes, buttons) centrally. This provides a clean, uniform look and a better, more meaningful and logical grouping.

chart : {
toolbarPosition : String [+] 3.11.3
toolbarX : Number [+] 3.11.3
toolbarY : Number [+] 3.11.3
toolbarHAlign : String [+] 3.11.3
toolbarVAlign : String [+] 3.11.3
toolbarButtonColor : Color [+]
showToolBarButtonTooltext : Boolean [+]
toolbarButtonScale : Number [+]
}
Attributes for Exporting Charts
These attributes allow you to control the saving of chart as image, SVG or XLSX.

chart : {
exportEnabled : Boolean [+]
exportAction : String [+]
exportHandler : String [+]
exportFormats : String [+]
exportMode : String [+] 3.12.1
exportShowMenuItem : Boolean [+]
exportTargetWindow : String [+]
exportFileName : String [+]
}
Data Plot Hover Effects
If you wish to show an effect on the data plot (column, line anchor, pie etc.) when the user hovers his mouse over the data plot, these attributes let you configure the cosmetics of the hover for all data plots in the chart.

chart : {
showHoverEffect : Boolean [+]
plotHoverEffect : Boolean [+]
plotFillHoverColor : Color [+]
plotFillHoverAlpha : Number [+]
}
Chart Paddings & Margins
The following attributes help you control chart margins and paddings. FusionCharts Suite XT allows you manually customize the padding of various elements on the chart to allow advanced manipulation and control over chart visualization. Padding in FusionCharts Suite XT is always defined in pixels, unless the attribute itself suggests some other scale (like plotSpacePercent, which configures the spacing using percentage values). You can also define the chart margins. Chart Margins refer to the empty space left on the top, bottom, left and right of the chart. It's not necessary for you to specify any padding/margin values. FusionCharts Suite XT automatically assumes the best values for the same, if you do not specify the same.

chart : {
chartLeftMargin : Number [+]
chartRightMargin : Number [+]
chartTopMargin : Number [+]
chartBottomMargin : Number [+]
valuePadding : Number [+]
}
The color Object and The colorRange Object
Attributes of the color object (child of the colorRange object) are used to define ranges for dividing the gauge scale. Although the color object has to be defined within the colorRange object, ranges cannot be collectively customized using the colorRange object because it does not have any attributes of its own.

color : {
alpha : Number [+]
borderAlpha : Number [+]
borderColor : Color [+]
code : Color [+]
maxValue : Number [+]
minValue : Number [+]
}

FusionCharts.ready(function() {
  var chart = new FusionCharts({
      type: 'vled',
      renderAt: 'chart-container',
      width: '150',
      height: '400',
      dataFormat: 'json',
      dataSource: {
        "chart": {
          "theme": "fusion",
          "caption": "Fuel Level Indicator",
          "lowerLimit": "0",
          "upperLimit": "100",
          "lowerLimitDisplay": "Empty",
          "upperLimitDisplay": "Full",
          "numberSuffix": "%",
          "showValue": "1",
          "valueFontSize": "12",
          "showhovereffect": "1",
          "chartBottomMargin": "20",
          "theme": "fusion"
        },
        "colorRange": {
          "color": [{
              "minValue": "0",
              "maxValue": "45",
              "code": "#e44a00"
            },
            {
              "minValue": "45",
              "maxValue": "75",
              "code": "#f8bd19"
            },
            {
              "minValue": "75",
              "maxValue": "100",
              "code": "#6baa01"
            }
          ]
        },
        "value": "92"
      }

    })
    .render();
});
