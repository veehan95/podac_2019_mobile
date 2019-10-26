import { Pie } from 'vue-chartjs'

const options = {
  responsive:true,
  cutoutPercentage: 80,
  legend: { display: false },
  tooltips: { enabled: false },
  hover: { mode: false },
}

export default {
  extends: Pie,
  name: 'Pie_Chart',
  props: ["rating"],
  mounted() {
    this.renderChart({
      legend: { display: false },
      datasets: [{
        backgroundColor: ['#DAE02A', '#6D6D6D'],
        data: [1000, this.$props.rating],
        borderWidth: 0
      }]
    }, options)
  },
}
