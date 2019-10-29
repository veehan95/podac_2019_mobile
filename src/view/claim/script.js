import Container from '@/components/container'
import { get_reward_history, get_reward, get_image } from '@/util/db'

export default {
  name: 'Claim',
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
    get_reward_history(this.$session.get("user_id"))
      .then(list => {
        Promise.all(Object.keys(list).map(async (key) => {
            return {
              ...await get_reward(list[key].id),
              date: list[key].date,
              query_key: key,
            }
          }))
          .then(x => {
            const temp = x.map(async (e) => {
              const image_url = await get_image(e.image)
              return { image_url, ...e }
            })
            Promise.all(temp).then(y => {
              this.$data.rewards = y
              this.$data.loading = false
            })
          })
      })
  },
  methods: {
    goto(i) {
      this.$router.push(`/reward_detail/${this.$data.rewards[i].query_key}`)
    }
  }
}
