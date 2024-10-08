// Function to build metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      var metadata = data.metadata;
      var result = metadata.filter(sampleObj => sampleObj.id == sample)[0];

      var panel = d3.select("#sample-metadata");
      panel.html(""); // Clear existing metadata

      // Append new metadata
      Object.entries(result).forEach(([key, value]) => {
          panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });
  });
}

// Function to build charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      var samples = data.samples;
      var result = samples.filter(sampleObj => sampleObj.id == sample)[0];

      var otu_ids = result.otu_ids;
      var otu_labels = result.otu_labels;
      var sample_values = result.sample_values;

      // Bar chart
      var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      var barData = [{
          x: sample_values.slice(0, 10).reverse(),
          y: yticks,
          text: otu_labels.slice(0, 10).reverse(),
          type: "bar",
          orientation: "h"
      }];
      var barLayout = {
          title: "Top 10 OTUs Found",
          margin: { t: 30, l: 150 }
      };
      Plotly.newPlot("bar", barData, barLayout);

      // Bubble chart
      var bubbleData = [{
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
              size: sample_values,
              color: otu_ids,
              colorscale: "Earth"
          }
      }];
      var bubbleLayout = {
          title: "OTU Distribution",
          xaxis: { title: "OTU ID" },
          hovermode: "closest"
      };
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Function to initialize dashboard
function init() {
  var selector = d3.select("#selDataset");

  // Load data and populate dropdown
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
      var sampleNames = data.names;

      sampleNames.forEach((sample) => {
          selector.append("option").text(sample).property("value", sample);
      });

      // Build initial plots with the first sample
      var firstSample = sampleNames[0];
      buildCharts(firstSample);
      buildMetadata(firstSample);
  });
}

// Function to handle sample change
function optionChanged(newSample) {
  // Rebuild charts and metadata for new sample
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize dashboard
init();