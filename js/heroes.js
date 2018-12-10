'use strict';

function subname(name) {
    name = name.toLowerCase().split(' ').join('_');
    if (name === 'windranger')
        return 'windrunner';
    else if (name === 'outworld_devourer')
        return 'obsidian_destroyer';
    else if (name === 'timbersaw')
        return 'shredder';
    else if (name === 'magnus')
        return 'magnataur';
    else if (name === 'wraith_king')
        return 'skeleton_king';
    else if (name === 'zeus')
        return 'zuus';
    else if (name === 'necrophos')
        return 'necrolyte';
    else if (name === 'doom')
        return 'doom_bringer';
    else if (name === 'queen_of_pain')
        return 'queenofpain';
    else if (name === 'io')
        return 'wisp';
    else if (name === 'underlord')
        return 'abyssal_underlord';
    else if (name === 'anti-mage')
        return 'antimage';
    else if (name === 'shadow_fiend')
        return 'nevermore';
    else if (name === 'vengeful_spirit')
        return 'vengefulspirit';
    else if (name === 'clockwerk')
        return 'rattletrap';
    else if (name === 'nature\'s_prophet')
        return 'furion';
    else if (name === 'treant_protector')
        return 'treant';
    else if (name === 'lifestealer')
        return 'life_stealer';
    else if (name === 'centaur_warrunner')
        return 'centaur';
    return name;
}

let svg;
let g;

function addGradient(svg, name) {
    let id = `gradient-${name}`;
    let defs = svg.append('defs');
    let lg = defs.append('linearGradient')
        .attr('id', id)
        .attr('x1', '0')
        .attr('x2', '0')
        .attr('y1', '0')
        .attr('y2', '1');
    lg.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', 'rgb(131, 58, 47)');
    lg.append('stop')
        .attr('offset', '5%')
        .attr('stop-color', 'rgb(146, 56, 42)');
    lg.append('stop')
        .attr('offset', '95%')
        .attr('stop-color', 'rgb(82, 26, 20)');
    lg.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', 'rgb(63, 20, 20)');
    return id;
}

d3.csv('data/hero_part.csv', data => {
    /****************************************
        winnable
     ***************************************/
    data.sort(function(a, b) {
       return parseFloat(a.win_rate) >= parseFloat(b.win_rate) ? -1 : 1;
    });

    svg = d3.select('#hero-winnable-list-d3').append('svg')
        .attr('width', `100%`)
        .attr('height', '100%')
        .style('overflow-y', 'scroll');
    let w = svg.node().getBoundingClientRect().width;
    let h = svg.node().getBoundingClientRect().height;
    let xAxis = d3.scaleBand()
        .domain([...Array(10).keys()])
        .range([0, w])
        .paddingInner(.1);

    let yAxis = d3.scaleLinear().domain([0, 0.8]).range([h-100, 0]);

    let gradId = addGradient(svg, 'hero-winnable-list');
    g = svg.selectAll('g').data(data.filter(d => (d.count > 20)).slice(0, 10)).enter()
        .append('g')
        .attr('transform', (d, i) => `translate(${xAxis(i)}, 0)`);
    g.append('image')
        .attr('xlink:href', d => `http://cdn.dota2.com/apps/dota2/images/heroes/${subname(d.hero)}_full.png`)
        .attr('x', 0)
        .attr('y', h-80)
        .attr('width', xAxis.bandwidth());
    g.append('rect')
        .attr('x', 0)
        .attr('y', d => Math.round(yAxis(d.win_rate)))
        .attr('width', xAxis.bandwidth())
        .attr('height', d => Math.round(h-100 - yAxis(d.win_rate)))
        .attr('fill', `url(#${gradId})`);
    g.append('text')
        .attr('x', xAxis.bandwidth()/3)
        .attr('y', d => Math.round(yAxis(d.win_rate))-10)
        .text((d) => `${(Math.round(d.win_rate*1000)/10).toFixed(1)}%`)
        .style('font-family', '\'Radiance\',\'arial\',sans-serif')
        .attr('fill', '#c0c1c1')
    /****************************************
        pick ban
     ***************************************/
    let dom = document.getElementById("hero-banpick-list-echart");
    let myChart = echarts.init(dom);
    let app = {};
    let heroes = [];
    let pick_rates = [];
    let ban_rates = [];
    let other_rates = [];
    let my_series;
    data.sort(function (b, a) {
        // (parseFloat(a.pick_rate) + parseFloat(a.ban_rate)) > (parseFloat(b.pick_rate) + parseFloat(b.ban_rate)) ? 1 : -1;
        // return parseInt(a.pick) < parseInt(b.pick) ? 1 : -1;
        return parseInt(a.other) > parseInt(b.other) ? 1 : -1;
    });

    data.slice(-10).forEach(function (d) {
        heroes.push(d.hero);
        let p = parseFloat(d.pick_rate).toFixed(2)
        pick_rates.push(p);
        let b = parseFloat(d.ban_rate).toFixed(2)
        ban_rates.push(b);
        let o = (1 - p - b).toFixed(2)
        other_rates.push(o);
    });
    app.title = '堆叠条形图';
    // let my_series = [];

    my_series = [
        {
            name: 'Pick',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: pick_rates
        },
        {
            name: 'Ban',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: ban_rates
        },
        {
            name: 'Neither pick nor ban',
            type: 'bar',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'insideRight'
                }
            },
            data: other_rates
        }
    ];
    let option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['p', 'b', 'o']
        },
        grid: {
            left: '5%',
            right: '10%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 18
            },
            name: 'Pick and Ban Rate',
            nameLocation:'center'
        },
        yAxis: {
            type: 'category',
            data: heroes,
            name: 'Heroes',
            axisLabel : {
                fontSize: 18,
            },
        },
        series: my_series,
        color: ['#598307', '#A83806', '#434137'],
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
});