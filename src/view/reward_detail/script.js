import Container from '@/components/container'
import { get_user_reward, get_reward, get_image } from "@/util/db"

export default {
  name: 'RewardDetail',
  components: { Container },
  data() {
    return {
      reward_info: {},
      setTimeout: false,
      reward_details: "",
      image: "",
      showQR: false,
    }
  },
  mounted() {
    get_user_reward(this.$session.get("user").id, this.$route.params.id)
      .then(x => {
        this.$data.reward_info = x
        return x
      })
      .then(x => {
        get_reward(x.id).then(y => {
          this.$data.reward_details = y
          get_image(y.image).then(url => this.$data.image = url)
        })
      })
    setTimeout(() => { this.$data.showQR = true }, 5000)
  },
}
