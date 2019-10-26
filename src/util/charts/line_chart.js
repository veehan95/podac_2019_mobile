import { Line } from 'vue-chartjs'

var options = {
    responsive:true,
    maintainAspectRatio: false,
    legend: { display: false },
    tooltips: { enabled: false },
    scales: {
        xAxes: [{
          gridLines: { color: "#131c2b", display: false },
        }],
        yAxes: [{
          gridLines: { color: "#131c2b", display: true },
          ticks: { beginAtZero: true, max: 5, stepSize: 1, display: true },
        }],
    }
}

export default {
  extends: Line,
  name: 'Line_Chart',
  props: ["points"],
  watch: {
    points: function(newVal) {
      this.renderChart({
        labels: newVal.map(item => item.x),
        datasets: [{data: newVal}]
      }, options)
    }
  },
}
