import React, {useState} from 'react';
import {Line} from '@reactchartjs/react-chart.js'
import format from 'date-fns/format'
// import _ from 'lodash'
import {Box} from '@chakra-ui/react'
import '../styles/chart.css'
import 'chartjs-plugin-annotation'



export default function ChartLine(chart) {

    

    const chartData = chart;

    const [xPos, setXPos] = useState(null);



    const stateData = {
        labels: chartData
            .chart
            // .reverse()
            .map((data = []) => {
                // return (format(new Date(data.last_logged_at), 'MMM yy'))
                return (data.last_logged_at)
            }),
        datasets: [
            {
                fill: false,
                label: 'AHPND',
                lineTension: 0.1,
                backgroundColor: '#4CB244',
                borderColor: '#4CB244',
                // pointHoverRadius: 6,
                // pointBorderColor: '#4CB244',
                // pointHoverBackgroundColor: `#FFFFFF`,
                data: chartData
                    .chart
                    .map((data = []) => {
                        return (data.total_disease_id_1_positive)
                    })

            }, {
                fill: false,
                label: 'EHP',
                lineTension: 0.1,
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
                lineTension: 0.1,
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
                lineTension: 0.1,
                backgroundColor: '#FF9D0B',
                borderColor: '#FF9D0B',
                pointHoverRadius: 6,
                pointBorderColor: '#FF9D0B',
                pointHoverBackgroundColor: `#FFFFFF`,
                data: chartData
                    .chart
                    .map((data = []) => {
                        return (data.total_disease_id_11_positive)
                    })

            }
        ]
    }

    // console.log('state', stateData);
    // console.log('chart', chartData);
    

    return (
        <div>
            <Box w="100%" pr={2} pb={2} >
            <Line height="220px"
                data={stateData}
                options={{
                    maintainAspectRatio: true,
                responsive: true,
                tooltips: {
                    position: 'average',
                    mode: 'index',
                    intersect: false,
                  enabled: false,
                  callbacks: {
                    title: function (t, d){
                        // console.log('t',t,'d',d);
                        // console.log(`posisi x:`, xPos);
                      var judul = `<div class="tooltip-title">`+format(new Date(t[0].xLabel), 'MMM yy')+`</div>`;
                      setXPos(t[0].xLabel);
                      return judul;
                    },
                    label: function(ts, data) {
                        // console.log('t',ts,'d',data);
                        var label = `<div class="tooltip-label"><div class="tooltip-label-penyakit">`+data.datasets[ts.datasetIndex].label+`</div>` || '';
                        label += `<div class="tooltip-label-jumlah-penyakit">`+Math.round(ts.yLabel * 100) / 100+`</div></div>`;
                        return label;
                    }
                },
                  custom: function(tooltipModel) {
                    // Tooltip Element
                    var tooltipEl = document.getElementById('chartjs-tooltip');
                    let tooltipWidth = 120;
                    var bodyPartHeight = 130;

                    var innerHtml = '';
    
                    // Create element on first render
                    if (!tooltipEl) {
                        tooltipEl = document.createElement('div');
                        tooltipEl.id = 'chartjs-tooltip';
                        tooltipEl.innerHTML = '<div id="inner-tooltip" class="ibox-content" style="box-shadow: 1px 1px 3px 3px #65686B80; border:0; margin: 0; max-width: '+tooltipWidth+'px; border-radius: 5px; z-index: 10;"></div>';
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
    
                        // var innerHtml = '';
    
                        titleLines.forEach(function(title) {
                            innerHtml += '<div style="display: block; padding-left: 8px; padding-top: 8px; padding-bottom: 5px;">' + title + '</div>';
                        });
    
                        bodyLines.forEach(function(body, i) {
                            var colors = tooltipModel.labelColors[i];
                            var style = 'background:' + colors.backgroundColor;
                            style += '; border-color:' + colors.borderColor;
                            style += '; border-width: 3px';
                            style += ';'
                            if (i === (bodyLines.length -1)){
                                style += ' border-bottom-right-radius: 5px;';
                                // leftStyle += 'border-bottom-left-radius: 5px;';
                            }
                            // var span = '<span style="' + style + '"></span>';
                            innerHtml += '<div style="max-width: '+tooltipWidth+'px;"><div style="display: inline-block; width: 95%; padding-right:8px; ">' + body + '</div><div style="'+style+'display: inline-block; width:3%; padding-right:0;">&nbsp</div></div>';
                        });
    
                        var tableRoot = tooltipEl.querySelector('#inner-tooltip');
                        tableRoot.innerHTML = innerHtml;
                    }
    
                    // `this` will be the overall tooltip
                    var position = this._chart.canvas.getBoundingClientRect();

                    // console.log('device width', window.screen.width);
                    // console.log('device height', window.screen.height);
                    // console.log('top', position.top , 'right', position.right, 'bottom', position.bottom, 'left',position.left);
                    // console.log('x offset', window.pageXOffset, 'y offset', window.pageYOffset);
                    // console.log('caret x', tooltipModel.caretX, 'caret y', tooltipModel.caretY);

    
                    // Display, position, and set styles for font
                    tooltipEl.style.opacity = 1;
                    tooltipEl.style.position = 'relative';
                    // tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
                    tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 5 + 'px';
                    tooltipEl.style.bottom = 230 + 'px';
                    // let tooltipTop

                    let tooltipXPosition =position.left + window.pageXOffset + tooltipModel.caretX+ tooltipWidth;

                    // console.log('tooltipXposition', tooltipXPosition)

                    if (tooltipXPosition > position.right){
                            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX - tooltipWidth - 15 + 'px';
                        }


                    tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
                    tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
                    tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
                    tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
                    tooltipEl.style.pointerEvents = 'none';

                    // console.log('tool top', tooltipEl.style.top , 'tool right', tooltipEl.style.right, 'tool bottom', tooltipEl.style.bottom, 'tool left', tooltipEl.style.left);
                }
                },
                elements: {
                    point: {
                        radius: 2,
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
                            id: 'xAxis',
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
                            id: 'yAxis',
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
                },
                onHover :
                    function (e){
                        // console.log('e', e);
                        if(e.type === 'mouseout'){
                            this.options.annotation.annotations = [];
                            let tooltipEl = document.body.querySelector('#chartjs-tooltip');
                            if(tooltipEl){
                            tooltipEl.style.opacity = 0;
                            }
                            // 
                            this.update();
                        }else{
                            this.options.annotation.annotations = [{
                                drawTime: 'afterDraw', // overrides annotation.drawTime if set
                            display: true,
                            type: 'line',
                            scaleID: 'xAxis',
                            value: xPos,
                            borderColor: '#000000',
                            borderWidth: 2,
                            }]
                            this.update();
                        }
                    }
                ,
                    annotation: {
                        drawTime: 'afterDatasetsDraw', // (default)
                        annotations: []
                    }
            }}/>
            </Box>
        </div>
    )
}
