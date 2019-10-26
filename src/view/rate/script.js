import { upload_image, submit_feedback, tag_area, get_area_tag } from "@/util/db"
import { geocode } from "@/util/google_api"
import { image_via_camera, current_coords } from "@/util/cordova_plugin"
import Rating from "@/components/rating"

export default {
  name: 'Rate',
  components: { Rating },
  data() {
    return {
      image: "",
      rating_value: 0,
      coords: {latitude: 0, longitude: 0},
      location_detail: "",
      description: "",
      tags: [],
      submitting_image: false,
      submitting_report: false,
    }
  },
  async mounted() {
    this.get_gps()
    // navigator.camera.getPicture(
    //   image => this.$data.image = image,
    //   alert,
    //   {quality: 50, destinationType: Camera.DestinationType.DATA_URL}
    // )
    // await this.get_image(image)
  },
  watch: {
    coords: function(x) { this.geocode() },
    location_detail: async function(x) {
      this.$data.tags = await get_area_tag(this.$data.location_detail)
    },
  },
  methods: {
    async get_image() { this.$data.image = await image_via_camera() },
    async get_gps() { this.$data.coords = await current_coords() },
    async geocode() {
      this.$data.location_detail = await geocode(
        this.$data.coords.latitude,
        this.$data.coords.longitude,
      )
    },
    async submit_form() {
      this.$data.submitting_image = true
      this.$data.submitting_report = true
      const image = await
      upload_image(this.$data.image)
        .then(async image => {
          this.$data.submitting_image = false
          tag_area(this.$data.location_detail, this.$data.tags)
          submit_feedback(this.$data.location_detail, {
            image,
            coordinate: {
              x: this.$data.coords.longitude,
              y: this.$data.coords.latitude,
            },
            rating: this.$data.rating_value,
            description: this.$data.description,
            user: this.$session.get("user_id"),
          })
        })
        .then(() => {
          this.$data.submitting_report = false
          this.$router.push(`/post_rate/${this.$data.tags.join(',')}`)
        })
    },
    update_rating(val) { this.$data.rating_value = val},
  },
}
