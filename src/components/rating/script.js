import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import $ from 'jquery'

export default {
  name: 'Rating',
  methods: {
    ui_update(star_id) {
      this.$emit("rating_value", star_id)
      for (let i = 1; i <= 5; i++){
        if(i <= star_id ) {
          $(`#star_i_${i}`).addClass("rate-active fas")
        } else {
          const remaining = $(`#star_i_${i}`)
            .attr("class")
            .replace("rate-active", "")
            .replace("fas", "")
          $(`#star_i_${i}`).attr("class",remaining)
        }
      }
    }
  }
}
