import { get_user_reward } from "@/util/db"

export default {
  name: 'RewardDetail',
  data() {
    return {
      reward_info: {}
    }
  },
  async mounted() {
    this.$data.reward_info = await get_user_reward(
      this.$session.get("user_id"),
      this.$route.params.id,
    )
  },
}
