function chartOptions() {
  return {
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 2,
    style: {
      fontFamily: "'Helvetica Neue', Arial, sans-serif"
    }
  }
}

function smallChartTitleStyle() {
  return {
    color: '#FFFFFF',
    'font-size': '90%',
    fontWeight: 'normal'
  }

}

function responsiveOptions() {
  return {
    rules: [{
      condition: {
        maxWidth: 700
      },
      chartOptions: {
        legend: legendOptions()
      }
    }]
  }
}

function legendOptions() {
  return {
    layout: 'horizontal',
    align: 'center',
    verticalAlign: 'bottom'
  }
}

module.exports = {
  chartOptions,
  smallChartTitleStyle,
  responsiveOptions,
  legendOptions
}
