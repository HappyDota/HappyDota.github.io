'use strict';
{
    document.getElementById('panel-team-list').addEventListener('reach', function() {
        console.log('reach');
        let dom = document.getElementById("team-echart");
        let myChart = echarts.init(dom);
        let app = {};
        let option = null;
        let xAxisData = [];
        let win_rate = [];

        d3.csv("data/win_rate.csv", function(data) {
            for (let i = 0; i < 10; i++) {
                xAxisData.push(data[i].team_tag);
                win_rate.push(parseFloat(data[i].win_rate));
            }

            option = {
                xAxis: {
                    data: xAxisData,
                    silent: false,
                    splitLine: {
                        show: false
                    },
                    axisLabel: {
                        fontSize: 18
                    }
                },
                tooltip: {
                    formatter: function (params) {
                        const {data, name} = params;
                        return `${name}
                            <br>
                            <span style="display:inline-block;
                                         margin-right:5px;
                                         border-radius:10px;
                                         width:10px;
                                         height:10px;
                                         background-color:rgb(131, 58, 47);"></span>
                            win rate: ${Math.round(data*1000)/10}%`;
                    }
                },
                yAxis: {
                    axisLabel: {
                        fontSize: 18
                    }
                },
                series: [{
                    name: 'Win Rate',
                    type: 'bar',
                    data: win_rate,
                    animationDelay: function (idx) {
                        return 500;
                    }
                }],
                animationEasing: 'elasticOut',
                animationDelayUpdate: function (idx) {
                    return idx * 5;
                },
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0, color: 'rgb(131, 58, 47)'
                }, {
                    offset: 0.05, color: 'rgb(146, 56, 42)'
                }, {
                    offset: 0.95, color: 'rgb(82, 26, 20)'
                }, {
                    offset: 1, color: 'rgb(63, 20, 20)' // 100% 处的颜色
                }], false),
                textStyle: {
                    color: '#c0c1c1',
                    fontFamily: 'Radiance',
                    fontSize: 18
                },
            };

            if (option && typeof option === "object") {
                myChart.setOption(option, true);
            }
        })
    })
}