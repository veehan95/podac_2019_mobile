import { get_available_rewards, get_user, claim_reward } from "@/util/db"

export default {
  name: 'Rewards',
  data() {
    return {
      loading: true,
      accumulated_points: "0",
      rewards: [],
    }
  },
  async mounted() {
    this.$data.rewards = await get_available_rewards()
      .then(result => {
        this.$data.loading = false
        return result
      })

    this.update_pointes()
  },
  methods: {
    async claim(id) {
      claim_reward(this.$session.get("user_id"), id)
        .then(valid => {
          if (valid) {
            this.update_pointes()
            this.$router.push(`/reward_detail/${valid}`)
          }
        })
    },
    async update_pointes() {
      this.$data.accumulated_points = (await get_user(this.$session.get("user_id"))).points
    }
  }
}
