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

module.exports = {
  chartOptions,
  smallChartTitleStyle
}
