import React from 'react';
import {Line} from '@reactchartjs/react-chart.js'
import format from 'date-fns/format'
import _ from 'lodash'
import {HStack, Box, Text, Heading} from '@chakra-ui/react'

export default function ChartLine(chart) {

    const chartData = chart;

    const stateData = {
        labels: chartData
            .chart
            .reverse()
            .map((data = []) => {
                // return (format(new Date(data.last_logged_at), 'MMM yy'))
                return (data.last_logged_at)
            }),
        datasets: [
            {
                fill: false,
                label: 'AHPND',
                lineTension: 0,
                backgroundColor: '#4CB244',
                borderColor: '#4CB244',
                data: chartData
                    .chart
                    .map((data = []) => {
                        return (data.total_disease_id_1_positive)
                    })

            }, {
                fill: false,
                label: 'EHP',
                lineTension: 0,
                backgroundColor: '#E22B3A',
                borderColor: '#E22B3A',
                data: chartData
                    .chart
                    .map((data = []) => {
                        return (data.total_disease_id_6_positive)
                    })

            }, {
                fill: false,
                label: 'Myo',
                lineTension: 0,
                backgroundColor: '#3F5EFB',
                borderColor: '#3F5EFB',
                data: chartData
                    .chart
                    .map((data = []) => {
                        return (data.total_disease_id_8_positive)
                    })

            }, {
                fill: false,
                label: 'Berak Putih',
                lineTension: 0,
                backgroundColor: '#FF9D0B',
                borderColor: '#FF9D0B',
                data: chartData
                    .chart
                    .map((data = []) => {
                        return (data.total_disease_id_11_positive)
                    })

            }
        ]
    }

    console.log('state', stateData);
    console.log('chart', chartData);

    return (
        <div>
            {/* <Line
                data={stateData}
                options={{
                responsive: true,
                tooltips: {
                    mode: 'x',
                    intersect: false,
                  enabled: false,
                  callbacks: {
                    title: function(ts, d){
                        let title = `{<Box w="100%" p={4} fontSize="md">`;
                        // console.log('ts', ts, 'd', d);
                        if (ts[0].datasetIndex === 1)
                        title += '<div>'+ format(new Date(ts[0].label), 'MMM yy')+'</div>';
                        title += '</Box>'
                        const judul = format(new Date(ts[0].label), 'MMM yy');
                        return judul;
                        // return (
                        //   <Box w="100%" p={4} fontSize="md">
                        //     <Heading as="h4" size="sm" fontWeight={500} mb={2}>{judul}</Heading>
                        //   </Box>
                        // )
                    }.bind(this),
                    label: function (t, d) {
                      // console.log('t', t, 'd', d);
                        var body = '<div class="clearfix" style="font-size: 14px, height:30px">';
                        body+= '<p style="margin-bottom:0px; font-weight: 600">'+d.datasets[t.datasetIndex].label+'</p><span style="right: 0; margin-top:0px; font-weight: 600; color: #004492;">'+t.value+'</span>';
                        body+= '</div>'
                        return body;
                    }.bind(this)
                },
                  custom: function (tooltipModel) {
                    let tooltipWidth = 200;
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');
                  
                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<div id="inner-tooltip" class="ibox-content no-padding" style="box-shadow: 1px 1px 3px 3px #65686B80; border:0; margin: 0; min-width: '+tooltipWidth+'px; border-radius: 5px; z-index: 10; font-family: Open Sans;"></div>';
                        document.body.appendChild(tooltipEl);
                    }
                  
                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }
                  
                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }
                  
                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }
                  
                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);
                        var bodyPartHeight = 40;
                  
                        var innerHtml = '';
                  
                        titleLines.forEach(function(title, i) {
                            // innerHtml += '<div class="clearfix"><div style="display: inline-block; border-top-left-radius: 5px; padding-left: 5px; background-color: #FFFFFF; width: 95%">' + title + '</div><div class="pull-right" style="display: inline-block; border-top-right-radius: 5px; width:3%; background-color: #FFFFFF;">&nbsp</div></div>';
                            innerHtml += '<Box class="clearfix"><Heading as="h4" size="sm" fontWeight={500} mb={2}>' + title + '</Heading><Box class="pull-right" style="display: inline-block; border-top-right-radius: 5px; width:3%; background-color: #FFFFFF;">&nbsp</Box></Box>';

                        });
                  
                        var bodyLineFiltered = bodyLines.map((body,i)=>{
                            return{
                                text: body,
                                colors:tooltipModel.labelColors[i],
                            }
                        }).filter(function(body){
                            return body.text.length;
                        });
                        bodyLineFiltered.forEach(function(body, i) {
                            var colors = body.colors;
                            var style = 'background:' + colors.borderColor+';';
                            style += 'border: 1px solid' + colors.borderColor+';';
                            var leftStyle = '';
                            if (i == (bodyLineFiltered.length -1)){
                                style += 'border-bottom-right-radius: 5px;';
                                leftStyle += 'border-bottom-left-radius: 5px;';
                            }
                            innerHtml += '<div class="clearfix"><div style="display: inline-block; background-color: #FFFFFF; width: 95%; padding-left: 5px; height: '+bodyPartHeight+'px; '+leftStyle+'">' + body.text + '</div><div class="pull-right" style="'+style+'display: inline-block; width:3%; height: 40px">&nbsp</div></div>';
                        });
                        var tableRoot = tooltipEl.querySelector('#inner-tooltip');
                        tableRoot.innerHTML = innerHtml;
                    }
                  
                    // `this` will be the overall tooltip
                    var position = this._chart.canvas.getBoundingClientRect();
                  
                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    let tooltipYPosition = tooltipModel.caretY+ (bodyLineFiltered.length*bodyPartHeight)
                    let tooltipXPosition =position.left + window.pageXOffset + tooltipModel.caretX+tooltipWidth;
                    if (tooltipXPosition > position.right){
                        tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - tooltipWidth + 'px';
                    }
                    let windowInnerHeight = window.innerHeight;
                    if (position.bottom > windowInnerHeight){
                        tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - ((bodyLineFiltered.length*bodyPartHeight) + 10) + 'px';
                    }else{
                        if ((position.top + tooltipYPosition) > (windowInnerHeight)){
                            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY - ((bodyLineFiltered.length*bodyPartHeight) + 10) + 'px';
                        }else{
                            tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                        }
                    }
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.animationDuration = '400';
                    tooltipEl.style.pointerEvents = 'none';
                  }
                },
                elements: {
                    point: {
                        redius: 1,
                        pointStyle: 'circle'
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 10
                    }
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 5,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [
                        {
                            type: 'time',
                            position: 'bottom',
                            time: {
                                unit: 'quarter',
                                displayFormats: {
                                    quarter: 'MMM YY'
                                }
                            }
                        }
                    ],
                    yAxes: [
                        {
                            type: 'linear',
                            ticks: {
                                min: 0,
                                max: 5,
                                stepSize: 1
                            },
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: "Jumlah Positif"
                            }
                        }
                    ]
                }
            }}/> */}
            <Line
                data={stateData}
                options={{
                responsive: true,
                animation: {
                  duration : 1000,
                  easing : 'easeInOutQuad'
              },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                  enabled: false,
                  callbacks: {
                    title: function (t, d){
                      
                    },
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
    
                        if (label) {
                            label += ': ';
                        }
                        label += Math.round(tooltipItem.yLabel * 100) / 100;
                        return label;
                    }
                },
                  custom: function(tooltipModel) {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');
    
                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<table></table>';
                        document.body.appendChild(tooltipEl);
                    }
    
                    // Hide if no tooltip
                    if (tooltipModel.opacity === 0) {
                        tooltipEl.style.opacity = 0;
                        return;
                    }
    
                    // Set caret Position
                    tooltipEl.classList.remove('above', 'below', 'no-transform');
                    if (tooltipModel.yAlign) {
                        tooltipEl.classList.add(tooltipModel.yAlign);
                    } else {
                        tooltipEl.classList.add('no-transform');
                    }
    
                    function getBody(bodyItem) {
                        return bodyItem.lines;
                    }
    
                    // Set Text
                    if (tooltipModel.body) {
                        var titleLines = tooltipModel.title || [];
                        var bodyLines = tooltipModel.body.map(getBody);
    
                        var innerHtml = '<thead>';
    
                        titleLines.forEach(function(title) {
                            innerHtml += '<tr><th>' + title + '</th></tr>';
                        });
                        innerHtml += '</thead><tbody>';
    
                        bodyLines.forEach(function(body, i) {
                            var colors = tooltipModel.labelColors[i];
                            var style = 'background:' + colors.backgroundColor;
                            style += '; border-color:' + colors.borderColor;
                            style += '; border-width: 2px';
                            var span = '<span style="' + style + '"></span>';
                            innerHtml += '<tr><td>' + span + body + '</td></tr>';
                        });
                        innerHtml += '</tbody>';
    
                        var tableRoot = tooltipEl.querySelector('table');
                        tableRoot.innerHTML = innerHtml;
                    }
    
                    // `this` will be the overall tooltip
                    var position = this._chart.canvas.getBoundingClientRect();
    
                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.position = 'absolute';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';
                }
                },
                elements: {
                    point: {
                        redius: 1,
                        pointStyle: 'circle'
                    }
                },
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 10
                    }
                },
                layout: {
                    padding: {
                        left: 0,
                        right: 0,
                        top: 5,
                        bottom: 0
                    }
                },
                scales: {
                    xAxes: [
                        {
                            type: 'time',
                            position: 'bottom',
                            time: {
                                unit: 'quarter',
                                displayFormats: {
                                    quarter: 'MMM YY'
                                }
                            }
                        }
                    ],
                    yAxes: [
                        {
                            type: 'linear',
                            ticks: {
                                min: 0,
                                max: 5,
                                stepSize: 1
                            },
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: "Jumlah Positif"
                            }
                        }
                    ]
                }
            }}/>
        </div>
    )
}


