import Container from '@/components/container'
import { get_area_detail } from "@/util/db"

export default {
  name: 'Rate',
  components: { Container },
  data() {
    return {
      area_list: [],
      loading: true,
    }
  },
  mounted() {
    get_area_detail()
      .then(val => {
        const list = Object.keys(val)
          .filter(x => val[x].tags == this.$route.params.tags)
          .map(x => {
            return { ...val[x], key: x}
          })
        return list.length > 0 ? list : Object.keys(val)
          .map(x => {
            return { ...val[x], key: x}
          })
          .sort((a, b) => (a.total/a.number_of_rating) == (b.total/b.number_of_rating) ? 0 : +((a.total/a.number_of_rating) > (b.total/b.number_of_rating)) || -1)
      })
      .then(val => {
        this.$data.area_list = val
        this.$data.loading = false
      })
  },
  methods: {
    showImage(i) { return i != undefined ? i.length <= 0 : true },
    avg_rate(i) { return (i.total / i.number_of_rating).toFixed(2) },
    shortenname(name) { return name.substring(0, 30) + (name.length > 27 ? '...' : '') },
  }
}
