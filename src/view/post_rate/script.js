import { get_area_detail } from "@/util/db"

export default {
  name: 'Rate',
  data() {
    return {
      area_list: [],
    }
  },
  async mounted() {
    this.$data.area_list = await get_area_detail()
  }
}
