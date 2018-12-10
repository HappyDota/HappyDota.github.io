{
    let dom = document.getElementById("money-echart");
    let myChart = echarts.init(dom);
    let i =0;
    let origin = null;
    let origin_dire = null;
    let data_dire = [];
    let data1 = [];
    let data2 = [];
    let x_data = [];
    d3.csv("data/win_money.csv",function(data){
        origin = data;
        d3.csv("data/dire_win_money.csv",function(data){
            origin_dire = data;
            origin.sort(function (a,b){
                return parseFloat(a.advance)>parseFloat(b.advance)?1:-1;
            });
            origin_dire.sort(function (a,b){
                return parseFloat(a.advance)>parseFloat(b.advance)?1:-1;
            });
            for (let i = 0; i < origin.length;i++) {
                data2.push(0.5);
                x_data.push(origin[i].advance);
                data1.push(parseFloat(origin[i]['win_rate']));
                data_dire.push(parseFloat(origin_dire[i]['dire_win_rate']));
            }
            x_data[0] ='< 0.7';
            x_data[origin.length-2] ='> 1.4';
            option.xAxis.data = x_data;
            if (option && typeof option === "object") {
                myChart.setOption(option, true);
            }
            myChart.setOption({
                series: [{
                    data: data1,
                },
                    {
                        data: data2,
                    },
                    {
                        data:data_dire,
                    }]
            });
        });
    });

    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        xAxis: {
            name: 'money ratio',
            type: 'category',
            data: [],
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
            min:0,
            max:1,
            axisLabel: {
                fontSize: 18
            },
        },
        series: [{
            name: 'radiant_win',
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
            },
            {
                name: 'dire_win',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: data_dire
            }
        ],
        color: ['#598307','#434137','#A83806'],
        textStyle: {
            color: '#c0c1c1',
            fontFamily: 'Radiance',
            fontSize: 18
        },
        backgroundColor: 'rgba(0,0,0,0)',
    };
}