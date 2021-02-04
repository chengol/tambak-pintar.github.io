import React from 'react'
import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';
import {Box} from '@chakra-ui/react'
import format from 'date-fns/format'


export default function ChartData(chart) {
    const chartData = chart;
    // console.log('chart', chartData);
    const dataDummy = [
        {
            name: 'Page A',
            uv: 4000,
            pv: 2400,
            amt: 2400
        }, {
            name: 'Page B',
            uv: 3000,
            pv: 1398,
            amt: 2210
        }, {
            name: 'Page C',
            uv: 2000,
            pv: 9800,
            amt: 2290
        }, {
            name: 'Page D',
            uv: 2780,
            pv: 3908,
            amt: 2000
        }, {
            name: 'Page E',
            uv: 1890,
            pv: 4800,
            amt: 2181
        }, {
            name: 'Page F',
            uv: 2390,
            pv: 3800,
            amt: 2500
        }, {
            name: 'Page G',
            uv: 3490,
            pv: 4300,
            amt: 2100
        }
    ];

    // console.log('dummy data', dataDummy);

    let data = [{}];
    if (chartData) {
        data = chartData.chart.map((data = [{}]) => {
                return {
                    name: `${format(new Date(data.last_logged_at), 'MMM yy')}`,
                    AHPND: data.total_disease_id_1_positive,
                    EHP: data.total_disease_id_6_positive,
                    Myo: data.total_disease_id_8_positive,
                    'Berak Putih': data.total_disease_id_11_positive
                }
            });
    }

    // console.log('chart data', data);

    
      

    return (
        <div>
            {chartData && <Box>
                {/* <Box
                    pb={5}
                    className="chart-box-desktop" display={{base: "none",
                    sm: "none",
                    md: "none",
                    lg: "block" ,
                    xl: "block"}}>
                    <BarChart
                        data={data.reverse()}
                        width={340}
                        height={250}
                        margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5
                    }}
                        barSize={20}
                        barGap={2}>

                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis
                            label={{
                            value: 'Jumlah Positif',
                            angle: -90,
                            position: 'LeftBottom'
                        }}
                            allowDecimals={false}/>

                        <Bar dataKey="AHPND" stackId="a" fill="#4CB244"/>
                        <Bar dataKey="EHP" stackId="a" fill="#E22B3A"/>
                        <Bar dataKey="Myo" stackId="a" fill="#3F5EFB"/>
                        <Bar dataKey="Berak Putih" stackId="a" fill="#FF9D0B"/>
                        <Tooltip/>
                        <Legend width={340} verticalAlign="top" height={40} iconType='circle'/>
                    </BarChart>
                    <LineChart
                        data={data}
                        width={340}
                        height={250}
                        margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5
                    }}
                        barSize={20}
                        barGap={2}>

                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis
                            label={{
                            value: 'Jumlah Positif',
                            angle: -90,
                            position: 'insideLeftBottom'
                        }}
                            allowDecimals={false}/>

                        <Line dataKey="AHPND" type="linear" stroke="#4CB244" strokeWidth={3}/>
                        <Line dataKey="EHP" type="linear" stroke="#E22B3A" strokeWidth={3}/>
                        <Line dataKey="Myo" type="linear" stroke="#3F5EFB" strokeWidth={3}/>
                        <Line dataKey="Berak Putih" type="linear" stroke="#FF9D0B" strokeWidth={3}/>
                        <Tooltip/>
                        <Legend width={340} verticalAlign="top" height={40} iconType='circle'/>
                    </LineChart>
                </Box> */}
                {/* <Box
                    pb={5}
                    className="chart-box-mobile" display={{base: "block",
                    sm: "block",
                    md: "block",
                    lg: "none" ,
                    xl: "none"}}>
                    <BarChart
                        data={data}
                        width={350}
                        height={250}
                        margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5
                    }}
                        barSize={20}
                        barGap={2}>

                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis
                            label={{
                            value: 'Jumlah Positif',
                            angle: -90,
                            position: 'LeftBottom'
                        }}
                            allowDecimals={false}/>

                        <Bar dataKey="AHPND" stackId="a" fill="#4CB244"/>
                        <Bar dataKey="EHP" stackId="a" fill="#E22B3A"/>
                        <Bar dataKey="Myo" stackId="a" fill="#3F5EFB"/>
                        <Bar dataKey="Berak Putih" stackId="a" fill="#FF9D0B"/>
                        <Tooltip/>
                        <Legend width={340} verticalAlign="top" height={40} iconType='circle'/>
                    </BarChart>
                    <LineChart
                        data={data}
                        width={350}
                        height={250}
                        margin={{
                        top: 5,
                        right: 0,
                        left: 0,
                        bottom: 5
                    }}
                        barSize={20}
                        barGap={2}>

                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="name"/>
                        <YAxis
                            label={{
                            value: 'Jumlah Positif',
                            angle: -90,
                            position: 'insideLeftBottom'
                        }}
                            allowDecimals={false}/>

                        <Line dataKey="AHPND" type="linear" stroke="#4CB244" strokeWidth={3} />
                        <Line dataKey="EHP" type="linear" stroke="#E22B3A" strokeWidth={3}/>
                        <Line dataKey="Myo" type="linear" stroke="#3F5EFB" strokeWidth={3}/>
                        <Line dataKey="Berak Putih" type="linear" stroke="#FF9D0B" strokeWidth={3}/>
                        <Tooltip/>
                        <Legend width={340} verticalAlign="top" height={40} iconType='circle'/>
                    </LineChart>
                </Box> */}
            </Box>
                
}


        </div>
    )
}

const CustomTooltip = ({active, payload, label}) => {
    if (active) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${label}`}</p>
                <p className="AHPND">{`AHPND : ${payload[0].AHPND}`}</p>
                <p className="EHP">{`EHP : ${payload[0].EHP}`}</p>
                <p className="Myo">{`Myo : ${payload[0].Myo}`}</p>
            </div>
        );
    }

    return null;
};
