annotations: {
  yaxis: [{
      y: 0,
      y2: null,
      strokeDashArray: 1,
      borderColor: '#c2c2c2',
      fillColor: '#c2c2c2',
      opacity: 0.3,
      offsetX: 0,
      offsetY: -3,
      width: '100%',
      yAxisIndex: 0,
      label: {
          borderColor: '#c2c2c2',
          borderWidth: 1,
          borderRadius: 2,
          text: undefined,
          textAnchor: 'end',
          position: 'right',
          offsetX: 0,
          offsetY: 0,
          mouseEnter: undefined,
          mouseLeave: undefined,
          click: undefined,
          style: {
              background: '#fff',
              color: '#777',
              fontSize: '12px',
              fontWeight: 400,
              fontFamily: undefined,
              cssClass: 'apexcharts-yaxis-annotation-label',
              padding: {
                left: 5,
                right: 5,
                top: 0,
                bottom: 2,
              }
          },
      },
  }],
  xaxis: [{
    x: 0,
    x2: null,
    strokeDashArray: 1,
    borderColor: '#c2c2c2',
    fillColor: '#c2c2c2',
    opacity: 0.3,
    offsetX: 0,
    offsetY: 0,
    label: {
        borderColor: '#c2c2c2',
        borderWidth: 1,
        borderRadius: 2,
        text: undefined,
        textAnchor: 'middle',
        position: 'top',
        orientation: 'vertical',
        offsetX: 0,
        offsetY: 0,
        mouseEnter: undefined,
        mouseLeave: undefined,
        click: undefined,
        style: {
            background: '#fff',
            color: '#777',
            fontSize: '12px',
            fontWeight: 400,
            fontFamily: undefined,
            cssClass: 'apexcharts-xaxis-annotation-label',
        },
    },
  }],
  points: [{
    x: 0,
    y: null,
    yAxisIndex: 0,
    seriesIndex: 0,
    mouseEnter: undefined,
    mouseLeave: undefined,
    click: undefined,
    marker: {
      size: 0,
      fillColor: "#fff",
      strokeColor: "#333",
      strokeWidth: 3,
      shape: "circle",
      radius: 2,
      OffsetX: 0,
      OffsetY: 0,
      cssClass: '',
    },
    label: {
        borderColor: '#c2c2c2',
        borderWidth: 1,
        borderRadius: 2,
        text: undefined,
        textAnchor: 'middle',
        offsetX: 0,
        offsetY: -15,
        mouseEnter: undefined,
        mouseLeave: undefined,
        click: undefined,
        style: {
            background: '#fff',
            color: '#777',
            fontSize: '12px',
            fontWeight: 400,
            fontFamily: undefined,
            cssClass: 'apexcharts-point-annotation-label',
            padding: {
              left: 5,
              right: 5,
              top: 0,
              bottom: 2,
            }
        },
    },
    image: {
      path: undefined,
      width: 20,
      height: 20,
      offsetX: 0,
      offsetY: 0,
    }
  }],
  
  texts: [{
    x: 0,
    y: 0,
    text: '',
    textAnchor: 'start',
    foreColor: undefined,
    fontSize: '13px',
    fontFamily: undefined,
    fontWeight: 400,
    appendTo: '.apexcharts-annotations',
    backgroundColor: 'transparent',
    borderColor: '#c2c2c2',
    borderRadius: 0,
    borderWidth: 0,
    paddingLeft: 4,
    paddingRight: 4,
    paddingTop: 2,
    paddingBottom: 2,
  }],

 
  images: [{
    path: '',
    x: 0,
    y: 0,
    width: 20,
    height: 20,
    appendTo: '.apexcharts-annotations'
  }],
}


annotations
yaxis: Array
y: Number
Value on which the annotation will be drawn

y2: Number
If you provide this additional y2 value, a region will be drawn from y to y2.

strokeDashArray: Number
Creates dashes in borders of the SVG path. A higher number creates more space between dashes in the border.

borderColor: Color
Color of the annotation line

fillColor: Color
Fill Color of the region.
Only applicable if y2 is provided.

opacity: Number
Opacity of the filled region.

offsetX: Number
Sets the left offset for annotation line

offsetY: Number
Sets the top offset for annotation line

width: String | Number
Sets the width for annotation line

yAxisIndex: Number
When there are multiple y-axis, setting this options will put the annotation for that particular y-axis

label:
borderColor: Color
Border Color of the label

borderWidth: Number
Border width of the label

borderRadius: Number
Border-radius of the label

text: String
Text for tha annotation label

textAnchor: String
The alignment of text relative to label’s drawing position
Accepted values

start
middle
end
position: String
Available Options

left
right
offsetX: Number
Sets the left offset for annotation label

offsetY: Number
Sets the top offset for annotation label

mouseEnter: Function
Fires when user’s mouse enter the label of the annotation.

mouseLeave: Function
Fires when user’s mouse leave the label of the annotation.

click: Function
Fires when user clicks on the label of the annotation.

style
background: Color
Background Color for the annotation label

color: Color
ForeColor for the annotation label

fontSize: String
FontSize for the annotation label

fontWeight: String | Number
Font-weight for the annotation label

fontFamily: String
Font-family for the annotation label

cssClass: String
A custom Css Class to give to the annotation label elements

padding
left: Number
Left padding for the label

right: Number
Right padding for the label

top: Number
Top padding for the label

bottom: Number
Bottom padding for the label

xaxis: Array
x: Number
Value on which the annotation will be drawn

x2: Number
If you provide this additional x2 value, a region will be drawn from x to x2.

strokeDashArray: Number
Creates dashes in borders of SVG path. A higher number creates more space between dashes in the border.

borderColor: Color
Color of the annotation line

fillColor: Color
Fill Color of the region.
Only applicable if x2 is provided.

opacity: Number
Opacity of the filled region.

offsetX: Number
Sets the left offset for annotation line

offsetY: Number
Sets the top offset for annotation line

label:
borderColor: Color
Border color of the label

borderWidth: Number
Border width of the label

borderRadius: Number
Border-radius of the label

text: String
Text for tha annotation label

textAnchor: String
The alignment of text relative to label’s drawing position
Accepted values

start
middle
end
position: String
Available Options

top
bottom
orientation: String
Available Options

vertical
horizontal
offsetX: Number
Sets the left offset for annotation label

offsetX: Number
Sets the left offset for annotation label

offsetY: Number
Sets the top offset for annotation label

mouseEnter: Function
Fires when user’s mouse enter the label of the annotation.

mouseLeave: Function
Fires when user’s mouse leave the label of the annotation.

click: Function
Fires when user clicks on the label of the annotation.

style
color: Color
ForeColor for the annotation label

fontSize: String
FontSize for the annotation label

fontWeight: String | Number
Font-weight for the annotation label

fontFamily: String
Font-family for the annotation label

cssClass: String
A custom Css Class to give to the annotation label elements

points: Array
x: Number || String
X Value on which the annotation will be drawn (can be either timestamp for datetime x-axis or string category for category x-axis)

y: Number
Y Value on which the annotation will be drawn

yAxisIndex: Number
When there are multiple y-axis, setting this options will put the point annotation for that particular y-axis’ y value

seriesIndex: Number
In a multiple series, you will have to specify which series the annotation’s y value belongs to. Not required for single series

mouseEnter: Function
Fires when user’s mouse enter the marker of point annotation.

mouseLeave: Function
Fires when user’s mouse leave the marker of point annotation.

click: Function
Fires when user clicks on the marker of point annotation.

marker
size: Number
Size of the marker.

fillColor: String
Fill Color of the marker point.

strokeColor: String
Stroke Color of the marker point.

strokeWidth: Number
Stroke Size of the marker point.

shape: String
Shape of the marker.
Available Options for shape

circle
square
radius: Number
Radius of the marker (applies to square shape)

offsetX: Number
Sets the left offset of the marker

offsetY: Number
Sets the top offset of the marker

cssClass: String
Additional CSS classes to append to the marker

label:
borderColor: Color
Border Color of the label

borderWidth: Number
Border width of the label

borderRadius: Number
Border-radius of the label

text: String
Text for tha annotation label

textAnchor: String
The alignment of text relative to label’s drawing position
Accepted values

start
middle
end
offsetX: Number
Sets the left offset for annotation label

offsetY: Number
Sets the top offset for annotation label

mouseEnter: Function
Fires when user’s mouse enter the label of the point annotation.

mouseLeave: Function
Fires when user’s mouse leave the label of the point annotation.

click: Function
Fires when user clicks on the label of the point annotation.

style
background: Color
Background Color for the annotation label

color: Color
ForeColor for the annotation label

fontSize: String
FontSize for the annotation label

fontWeight: String | Number
Font-weight for the annotation label

fontFamily: String
Font-family for the annotation label

cssClass: String
A custom Css Class to give to the annotation label elements

padding
left: Number
Left padding for the label

right: Number
Right padding for the label

top: Number
Top padding for the label

bottom: Number
Bottom padding for the label

image:
path: String
Provide a full path of the image to display in place of annotation.

width: Number
Width of image annotation.

height: Number
Height of image annotation.

offsetX: Number
Left offset of the image.

offsetY: Number
Top offset of the image.

texts: Array
x: Number
X (left) position for the text relative to the element specified in appendTo property

y: Number
Y (top) position for the text relative to the element specified in appendTo property

text: String
The main text to be displayed

textAnchor: String
The alignment of text relative to label’s drawing position
Accepted values

start
middle
end
color: Color
ForeColor for the annotation label

fontSize: String
FontSize for the annotation label

fontWeight: String | Number
Font-weight for the annotation label

fontFamily: String
Font-family for the annotation label

appendTo: String
A query selector to which the text element will be appended.

borderColor: Color
Border Color for the label

borderRadius: Number
Border Radius for the label

borderWidth: Number
Border width for the label

paddingLeft: Number
Left padding for the label

paddingRight: Number
Right padding for the label

paddingTop: Number
Top padding for the label

paddingBottom: Number
Bottom padding for the label

images: Array
path: String
An absolute path to the image

x: Number
Left position for the image relative to the element specified in appendTo property

y: Number
Top position for the image relative to the element specified in appendTo property

width: Number
The width of the image

height: Number
The height of the image

appendTo: String
A query selector to which the image element will be appended.