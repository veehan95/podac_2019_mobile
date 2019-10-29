import Container from '@/components/container'
import { get_available_rewards, get_user, claim_reward, get_image } from "@/util/db"

export default {
  name: 'Rewards',
  components: { Container },
  data() {
    return {
      loading: true,
      accumulated_points: "0",
      rewards: [],
      show: false,
      showVal: {
        title: "show_title",
        detail: "show_detail",
        points: 0,
        key: "",
      }
    }
  },
  mounted() {
    get_available_rewards()
      .then(result => {
        this.$data.loading = false
        this.$data.rewards = result
        result.forEach((x, i) => {
          get_image(x.image).then(url => this.$data.rewards[i].image = url)
        })
      })

    this.update_pointes()
  },
  methods: {
    async claim(index) {
      this.$data.show = true
      this.$data.showVal = {
        title: this.$data.rewards[index].name,
        detail: this.$data.rewards[index].details,
        points: this.$data.rewards[index].points,
        key: this.$data.rewards[index].id,
      }
    },
    async goto_claim() {
      claim_reward(this.$session.get("user").id, this.$data.showVal.key)
        .then(valid => {
          if (valid) {
            this.update_pointes()
            this.$router.push(`/reward_detail/${valid}`)
          }
        })
    },
    close() {
      this.$data.show = false
      this.$data.showVal = {
        title: "show_title",
        detail: "show_detail",
        points: 0,
        key: undefined,
      }
    },
    async update_pointes() {
      this.$data.accumulated_points = (await get_user(this.$session.get("user").id)).points
    }
  }
}
