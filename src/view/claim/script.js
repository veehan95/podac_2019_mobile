import { get_reward_history } from '@/util/db'

export default {
  name: 'Claim',
  data() {
    return {
      reward_list: [],
    }
  },
  mounted() {
    get_reward_history(this.$session.get("user_id"))
      .then(list => {
        return Object.keys(list).map(key => {
          return {...list[key], key, path: `/reward_detail/${key}`}
        })
      })
      .then(list => {
        this.$data.reward_list = list
      })
  },
}
