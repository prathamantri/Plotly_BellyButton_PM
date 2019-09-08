function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
    var url = `/metadata/${sample}`;
    // Use `d3.json` to fetch the metadata for a sample
    d3.json(url).then(function(data){
      // Use d3 to select the panel with id of `#sample-metadata`
      var sample_metadata = d3.select ("#sample-metadata");

     // Use `.html("") to clear any existing metadata
      sample_metadata.html("")
      // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(data).forEach(function([key, value]){
        var row = sample_metadata.append("p")
        row.text(`${key}: ${value}`);

        });
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
    });
      // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {

    // @TODO: Use `d3.json` to fetch the sample data for the plots
      var url = `/samples/${sample}`
    // @TODO: Build a Bubble Chart using the sample data
      d3.json(url).then(function(data){
        var xvalues = data.otu_ids;
        var yvalues = data.sample_values;
        var text = data.otu_labels;
        var size = data.sample_values;
        var color = data.otu_ids;
        
        var trace1 = {
            x: xvalues,
            y: yvalues,
            text: text,
            mode: `markers`,
            marker: {
              color: color,
              size: size
            }
          };
        var data = [trace1];
        var layout = {
          xaxis: {title: "OTU ID"}
        };

        Plotly.newPlot('bubble', data, layout);

        // @TODO: Build a Pie Chart
        d3.json(url).then(function(data){
            var pvalue = data.sample_values.slice(0,10);
            var plabel = data.otu_ids.slice(0,10);
            var phover = data.otu_labels.slice(0,10);

            var data = [{
              values : pvalue,
              labels: plabel,
              hovertext: phover,
              type:'pie'
            }];

            Plotly.newPlot('pie', data);
        });
        // HINT: You will need to use slice() to grab the top 10 sample_values,
        // otu_ids, and labels (10 each).

      });
    
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
