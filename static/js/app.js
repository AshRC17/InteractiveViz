var sampleTotal = [];
// var count = {};
var sampleNames = {};
var sampleMeta = {};
var samples = {};
var metaDisplay = 0;


// Bonus segment function
function getGauge(val){
    var dataGauge = [
        {
            type: "indicator",
            value: val,
            title: "Belly Button Washing Frequency",
            mode: "gauge+number",
            gauge: {
                axis: {
                    range: [0, 9]
                }
            }
        }
    ];

    var layoutGauge = {
        width: 400,
        height: 300,
        margin: {
            t: 0,
            b: 0
        },
    };
    Plotly.newPlot('gauge', dataGauge, layoutGauge)
}

d3.json("samples.json").then(function (json) {
    // console.log(json);
    var sampleNames = json.names;
    var sampleMeta = json.metadata;
    var samples = json.samples;
    // metaDisplay = sampleMeta[0].id;
    // d3.select("#sample-metadata").text(sampleMeta[0].id).append();
    Object.entries(sampleMeta[0]).forEach(([key, value]) => {
        d3.select(".panel-body").append("h6").text(key+": "+value);
});

getGauge(sampleMeta[0].wfreq);
    
function otuCount() {
    count = {};
    for ( i = 0; i < sampleTotal.length; i++) {
        for ( j = 0; j < sampleTotal[i].length; j++) {
            var item = sampleTotal[i][j];
            count[item] = (count[item]+1) || 1;
        }
    }
    return count;
}

// Create an array with arrays of all sample otu_ids
samples.forEach(element => sampleTotal.push(element.otu_ids));

// Call function to count otu ids
var sampleCount =  otuCount(sampleTotal);
// console.log(sampleCount);

var sortedCount = Object.keys(sampleCount).map(function(key) {
    return [key, sampleCount[key]];
});

sortedCount.sort(function(first, second) {
    return second[1] - first[1];
});

// var sortedCount = sampleCount.sort((a,b) => b[1] - a[1]);

sortedTop10 = sortedCount.slice(0,10);
var sortedValues = [];
var sortedKeys = [];
var top10Keys = [];
var top10Values = [];

sortedCount.forEach(item => {
    sortedKeys.push("OTU "+item[0]);
    sortedValues.push(item[1]);
});

sortedTop10.forEach(item => {
    top10Keys.push("OTU "+item[0]);
    top10Values.push(item[1]);
});

// console.log(sortedTop10);
// console.log(top10Keys.reverse());
// console.log(top10Values.reverse());

top10Keys = top10Keys.reverse();
top10Values = top10Values.reverse();

var trace1 = {
    x: top10Values,
    y: top10Keys,
    text: top10Keys,
    text: top10Values,
    type: "bar",
    orientation: "h"
};

var data = [trace1];

var layout = {
    // title: "Top 10 OTU's",
    margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
    } 
};

Plotly.newPlot("bar", data, layout);

var  trace2 = {
    x: Object.keys(sampleCount),
    y: Object.values(sampleCount),
    text: Object.keys(sampleCount),
    // text: Object.values(sampleCount),
    mode: "markers",
    marker: {
        size: Object.values(sampleCount),
        color: Object.keys(sampleCount)
    }
};

var data2 = [trace2];

var layout2 = {
    showlegend: false,
    height: 600,
    width: 600
};

Plotly.newPlot("bubble", data2, layout2)






// d3.selectAll("#selDataset").on("change", optionChanged);
// var dropdownMenu = document.getElementById("selDataset");
var dropdownMenu = d3.select("#selDataset");


// Add items to the dropdown menu
sampleMeta.forEach(sampleItem => dropdownMenu.append("option").text(sampleItem.id));

});

function getMeta(meta) {
    // console.log(meta.id === parseInt(d3.select("#selDataset").property('value')));
    return meta.id === parseInt(d3.select("#selDataset").property('value'));
}

function optionChanged(metaSearch){
    d3.select(".panel-body").selectAll("h6").remove();
    d3.json("samples.json").then(function (json) {
        // console.log(json);
        var sampleMeta = json.metadata;
        // var metaSearch = d3.select("#selDataset").property('value');
        metaDisplay = sampleMeta.filter(getMeta);

        // Print values to panel body
        Object.entries(metaDisplay[0]).forEach(([key, value]) => {
            d3.select(".panel-body").append("h6").text(key+": "+value);
        });
        getGauge(metaDisplay[0].wfreq);
    });
}