import { get_area_detail } from '@/util/db'

export default {
  name: 'Claim',
  data() {
    return {
      result: [],
    }
  },
  methods: {
    async input_change() {
      this.$data.result = await get_area_detail()
    },
  },
}
