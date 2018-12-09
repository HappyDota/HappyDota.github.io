'use strict';
{
    let dom = document.getElementById("map-echart");
    let myChart = echarts.init(dom);
    let i = 0;
    let option;
    let origin_1;
    let origin_2;
    let data1 = [];
    let data2 = [];
    d3.csv("data/time_dire_win.csv",function(data){
        origin_1 = data;
        d3.csv("data/time_radiant_win.csv",function(data){
            origin_2 = data;
            data2 = [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,];
            document.getElementById('panel-map').addEventListener('reach', function (e) {
                setInterval(function () {
                    if (i >= origin_1.length)
                        return;
                    data1.push(parseFloat(origin_1[i]['dire_win']));
                    i = i+1;
                    myChart.setOption({
                        series: [{
                            data: data1
                        },
                            {
                                data: data2
                            }]
                    });
                }, 500);
            });

        });
    });

    option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        legend: {
            data: ['dire_win','base_line'],
            selectedMode: false,
            textStyle: {
                color: '#c0c1c1',
                fontFamily: 'Radiance',
                fontSize: 18
            }
        },
        xAxis: {
            name: 'time/min',
            type: 'category',
            data: [10,15,20,25,30,35,40,45,50,55,60,65,70,75,80],
            axisLabel: {
                fontSize: 18
            },
        },
        yAxis: {
            name: 'win rate',
            type: 'value',
            boundaryGap: [0, '100%'],
            splitLine: {
                show: false
            },
            axisLabel: {
                fontSize: 18
            },
            min:0,
            max:1,
        },
        series: [{
            name: 'dire_win',
            type: 'line',
            showSymbol: false,
            hoverAnimation: false,
            data: data1
        },
            {
                name: 'base_line',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: data2
            }
        ],
        color: ['#A83806','#434137'],
        textStyle: {
            color: '#c0c1c1',
            fontFamily: 'Radiance',
            fontSize: 18
        },
        backgroundColor: 'rgba(0,0,0,0)',
    };
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}