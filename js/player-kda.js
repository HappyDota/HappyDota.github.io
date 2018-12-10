'use strict';
{
    let dom = document.getElementById("player-kda-echart");
    let myChart = echarts.init(dom);
    let app = {};
    let kda = [];
    let temp = [];
    let name =[];
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
                temp_name = data[i].name;
                temp = [];
                temp.push(parseInt(data[i].kda));
                j=j+1;
            } else{
                temp.push(parseInt(data[i].kda));
                if (i === data.length-1){
                    kda_temp.push(temp);
                    name_temp.push(temp_name);
                }
            }
        }

        let tmp = [];
        for(let i=0; i<kda_temp.length; i++) {
            tmp.push({name: name_temp[i], kda: kda_temp[i]});
        }
        tmp.sort((a, b) => {
            if(d3.median(a.kda) === d3.median(b.kda)) {
                return d3.quantile(a.kda, 0.75) >= d3.quantile(b.kda, 0.75) ? -1 : 1;
            }
            return d3.median(a.kda) >= d3.median(b.kda) ? -1 : 1;
        });

        for (let i=0; i<10; i++){
            console.log(tmp[i]);
            kda.push(tmp[i].kda);
            name.push(tmp[i].name);
        }

        kda = kda.reverse();
        name = name.reverse();

        let pdata = echarts.dataTool.prepareBoxplotData(kda, {
            layout: 'vertical'
        });
        pdata.boxData = pdata.boxData.map(value => {
            return {
                value,
                itemStyle: {
                    color: '#A83806',
                    borderColor: '#c0c1c1'
                }
            }
        })
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
                splitLine: {
                    lineStyle: {
                        color: '#434137'
                    }
                }
            },
            series: [
                {
                    name: 'boxplot',
                    type: 'boxplot',
                    data: pdata.boxData,
                    tooltip: {
                        formatter: function (param, index) {
                            return [
                                'upper: ' + param.data.value[5],
                                'Q3: ' + param.data.value[4],
                                'median: ' + param.data.value[3],
                                'Q1: ' + param.data.value[2],
                                'lower: ' + param.data.value[1]
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
            },
        };
        if (option && typeof option === "object") {
            myChart.setOption(option, true);

        }
    });
}