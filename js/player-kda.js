'use strict';
{
    let dom = document.getElementById("player-kda-echart");
    let myChart = echarts.init(dom);
    let app = {};
    let kda = [];
    let temp = [];
    let name =[];
    let median_temp = [];
    let name_temp = [];
    let kda_temp = [];
    let option = null;

    d3.csv("data/players_kda.csv", function(data) {
        let temp_name = data[0].name;
        let j =1;
        for (let i = 0; i < data.length; i++) {
            if (temp_name !== data[i].name){
                kda_temp.push(temp);
                name_temp.push(temp_name);
                median_temp.push(d3.median(temp));
                temp_name = data[i].name;
                temp = [];
                temp.push(parseInt(data[i].kda));
                j=j+1;
            } else{
                temp.push(parseInt(data[i].kda));
                if (i === data.length-1){
                    kda_temp.push(temp);
                    name_temp.push(temp_name);
                    median_temp.push(d3.median(temp));
                }
            }
        }

        for (let i=0; i<median_temp.length; i++){
            for (j=1; j<median_temp.length-i; j++){
                if(median_temp[j-1] > median_temp[j]){
                    let temp_median = median_temp[j-1];
                    median_temp[j-1] = median_temp[j];
                    median_temp[j] = temp_median;

                    let temp_name = name_temp[j-1];
                    name_temp[j-1] = name_temp[j];
                    name_temp[j] = temp_name;

                    let temp_kda = kda_temp[j-1];
                    kda_temp[j-1] = kda_temp[j];
                    kda_temp[j] = temp_kda;
                }
            }
        }

        for (let i=kda_temp.length-1; i>kda_temp.length-11; i--){
            kda.push(kda_temp[i]);
            name.push(name_temp[i]);
        }

        kda = kda.reverse();
        name = name.reverse();

        let pdata = echarts.dataTool.prepareBoxplotData(kda, {
            layout: 'vertical'
        });

        option = {
            tooltip: {
                trigger: 'item',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '10%',
                right: '10%',
                bottom: '15%'
            },
            yAxis: {
                type: 'category',
                data: pdata.axisData,
                boundaryGap: true,
                nameGap: 30,
                splitArea: {
                    show: false
                },
                axisLabel: {
                    formatter: function(value){
                        return name[value]
                    },
                    fontSize: 18
                },
                splitLine: {
                    show: false
                }
            },
            xAxis: {
                type: 'value',
                name: 'KDA',
                axisLabel: {
                    fontSize: 18
                },
            },
            series: [
                {
                    name: 'boxplot',
                    type: 'boxplot',
                    data: pdata.boxData,
                    tooltip: {
                        formatter: function (param, index) {
                            return [
                                'upper: ' + param.data[5],
                                'Q3: ' + param.data[4],
                                'median: ' + param.data[3],
                                'Q1: ' + param.data[2],
                                'lower: ' + param.data[1]
                            ].join('<br/>')
                        }
                    }
                },
                {
                    name: 'outlier',
                    type: 'scatter',
                    data: pdata.outliers
                }
            ],
            textStyle: {
                color: '#c0c1c1',
                fontFamily: 'Radiance',
                fontSize: 18
            }
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);

        }
    });
}