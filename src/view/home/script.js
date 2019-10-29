import Pie from '@/util/charts/pie_chart'
import Container from '@/components/container'
import { get_user, get_image } from "@/util/db"

export default {
  name: 'Home',
  components: { Pie, Container },
  data() {
    return {
      user_name: "user_name",
      user_email: "user_email",
      session: "{idk: idk}",
      points: 0,
      image: undefined,
    }
  },
  beforeMount() {
    this.$session.set("key","value")
  },
  mounted() {
    this.$data.session = this.$session.getAll()
    const x = this.$session.get("user")
    this.$data.user_name = `${x.last_name} ${ x.first_name}`
    this.$data.user_email = x.email
    this.$data.points = x.points
    get_image(x.profilePicture).then(y => this.$data.image = y)
  }
}
