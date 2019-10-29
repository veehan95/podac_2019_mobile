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
    this.print()
  },
  methods: {
    print() {
      this.renderChart({
        legend: { display: false },
        datasets: [{
          backgroundColor: ['#DAE02A', 'rgba(0,0,0,0)'],
          data: [this.$props.rating, 1000 - this.$props.rating],
          borderWidth: 0
        }]
      }, options)
    },
  },
  watch: {
    rating: function(newVal) {
      this.print()
    }
  },
}
