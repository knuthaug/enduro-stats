/* global Highcharts */

const feather = require("feather-icons");
const charts = require("./charts.js");

document.addEventListener("DOMContentLoaded", function (event) {
  feather.replace();

  const graphs = document.querySelectorAll(".race-prog-graph");
  graphs.forEach((element) => {
    setupRaceGraph(element);
  });

  const selectors = document.querySelectorAll(".graph-selector");
  selectors.forEach((element) => {
    element.addEventListener("change", (event) => {
      const target = event.currentTarget;
      const els = target.parentNode.childNodes;

      for (let i = 0; i < els.length; i++) {
        if (els[i].nodeName === "DIV") {
          setupRaceGraph(els[i], target.options[target.selectedIndex].value);
          break;
        }
      }
    });
  });

  setupShowHideRace();
});

function setupShowHideRace() {
  [...document.querySelectorAll(".race-shower")].forEach((element) => {
    element.addEventListener("click", (e) => {
      const cur = e.currentTarget;
      cur.classList.toggle("plus-rotate");
      let el = cur.parentNode.parentNode.nextSibling;
      let i = 0;
      while (el) {
        if (el.nodeName === "TR") {
          el.classList.toggle("hide");
          const graphEl = el.querySelectorAll(".race-detail-graph");
          setupRaceDetailGraph(graphEl[0]);
          break;
        }
        el = el.nextSibling;
        i++;
      }
    });
  });
}

function placeFormatter() {
  return `<span>${this.series.name}<br/>${this.point.x} etappe: ${this.point.y}. plass</span>`;
}

function timeFormatter() {
  const value = Math.abs(this.point.y).toFixed(1);
  return `<span>${this.series.name}<br/>${
    this.point.x
  } etappe: ${value} ${secondLabel(value)} bak</span>`;
}

function secondLabel(value) {
  return value === "1.0" ? "sekund" : "sekunder";
}

function setupRaceDetailGraph(element) {
  const data = JSON.parse(element.getAttribute("data-object"));

  Highcharts.chart(element.getAttribute("id"), {
    chart: charts.chartOptions(),
    title: {
      text: "Nærmeste konkurrenter",
      style: charts.smallChartTitleStyle(),
    },
    tooltip: {
      formatter: function () {
        const value = Math.abs(this.point.y).toFixed(1);
        if (this.point.y < 0) {
          return `<span>${this.series.name}<br/>${
            this.point.x
          } etappe: ${value} ${secondLabel(value)} foran</span>`;
        }
        return `<span>${this.series.name}<br/>${
          this.point.x
        } etappe: ${value} ${secondLabel(value)} bak</span>`;
      },
    },
    yAxis: {
      title: {
        text: "Sekunder før/etter",
      },
    },
    xAxis: {
      title: {
        text: "Etappe",
      },
      tickInterval: 1,
    },

    plotOptions: {
      series: {
        label: {
          connectorAllowed: false,
        },
      },
    },
    series: data,
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            legend: charts.legendOptions(),
          },
        },
      ],
    },
  });
}

function title(type) {
  if (type === "places") {
    return "Etappeplasseringer";
  }

  if (type === "times") {
    return "Tid bak";
  }

  return "Total tid bak";
}

function setupRaceGraph(element, graph) {
  const index = element.getAttribute("data-highcharts-chart");

  if (index) {
    // existing graph
    const chart = Highcharts.charts[index];
    const data = JSON.parse(element.getAttribute(`data-object-${graph}`));

    chart.update({
      tooltip: {
        formatter: graph === "places" ? placeFormatter : timeFormatter,
      },
      yAxis: {
        title: {
          text: graph === "places" ? "Plass" : "Sekunder",
        },
        type: "linear",
      },
      title: {
        text: title(graph),
      },
      series: data,
    });
  } else {
    const data = JSON.parse(element.getAttribute("data-object-places"));

    Highcharts.chart(element.getAttribute("id"), {
      chart: charts.chartOptions(),
      tooltip: {
        formatter: placeFormatter,
      },

      title: {
        text: "Rittforløp",
      },

      yAxis: {
        title: {
          text: "Plass",
        },
        type: "linear",
      },
      xAxis: {
        title: {
          text: "Etappe",
        },
        tickInterval: 1,
      },

      plotOptions: {
        series: {
          label: {
            connectorAllowed: false,
          },
        },
      },
      series: data,
      responsive: charts.responsiveOptions(),
    });
  }
}
