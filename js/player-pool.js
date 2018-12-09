'use strict';
{
    let dom = document.getElementById("player-pool-echart");
    let myChart = echarts.init(dom);
    let app = {};
    let num = [];
    let xAxisData = [];
    let option = null;

    d3.csv('data/player_hero_num.csv', function (data) {
        for (let i = 0; i<data.length; i++){
            xAxisData.push(data[i].name);
            num.push(parseInt(data[i].hero_num))
        }
        myChart.showLoading();
        myChart.hideLoading();

        option = {
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true
                    }
                }
            },
            calculable : true,

            grid: {
                top: '12%',
                left: '1%',
                right: '10%',
                containLabel: true
            },
            xAxis: [
                {
                    type : 'category',
                    data : xAxisData,
                    axisLabel: {
                        fontSize: 18
                    }
                },
            ],
            yAxis: [
                {
                    type : 'value',
                    name : 'Hero Number',
                    axisLabel: {
                        formatter: function (a) {
                            a = +a;
                            return isFinite(a)
                                ? echarts.format.addCommas(+a)
                                : '';
                        },
                        fontSize: 18
                    }
                }
            ],
            dataZoom: [
                {
                    show: true,
                    start: 0,
                    end: 4
                },
                {
                    type: 'inside',
                    start: 94,
                    end: 100
                }
            ],
            series : [
                {
                    name: 'Hero Number',
                    type: 'bar',
                    data: num
                }
            ],
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

        myChart.setOption(option);
    });
    if (option && typeof option === "object") {
        myChart.setOption(option, true);
    }
}