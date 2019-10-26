import Pie from '@/util/charts/pie_chart'
import Container from '@/components/container'

export default {
  name: 'Home',
  components: { Pie, Container },
  data() {
    return {
      user_name: "veehan",
      user_email: "veehan95@gmail.com",
      session: "{idk: idk}",
    }
  },
  beforeMount() {
    this.$session.set("key","value")
  },
  mounted() {
    this.$data.session = this.$session.getAll()
  }
}
