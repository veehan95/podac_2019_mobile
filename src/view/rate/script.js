import { upload_image, submit_feedback, tag_area, get_area_tag } from "@/util/db"
import { geocode } from "@/util/google_api"
import { image_via_camera, current_coords } from "@/util/cordova_plugin"
import Container from '@/components/container'
import Rating from "@/components/rating"
import { gmapApi } from 'vue2-google-maps'

export default {
  name: 'Rate',
  components: { Rating, Container },
  data() {
    return {
      image: "",
      rating_value: 0,
      coords: {lat: 0, lng: 0},
      location_detail: "",
      description: "",
      tags: '',
      submitting_image: false,
      submitting_report: false,
      select_map: false,
    }
  },
  computed: {
    google: gmapApi,
    xxx: function() { this.$data.submitting_image && this.$data.submitting_report },
  },
  async mounted() {
    this.get_gps()

    // this.$refs.gmap.$on('click', () => alert('asdghfashudfghj'))
    // this.google.maps.event.addListener(map, 'click', (e) => {
    //   // this.$data.location.position.lat = e.latLng.lat()
    //   // this.$data.location.position.lng = e.latLng.lng()
    //   alert('mappppp')
    // })
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
      this.$data.tags = await get_area_tag(x.replace(/\./g, '').replace(/\s/g, '_'))
    },
  },
  methods: {
    setPlace(e) {
      this.$data.coords.lat = e.latLng.lat()
      this.$data.coords.lng = e.latLng.lng()
    },
    async get_image() { this.$data.image = await image_via_camera() },
    async get_gps() { this.$data.coords = await current_coords() },
    async geocode() {
      this.$data.location_detail = await geocode(
        this.$data.coords.lat,
        this.$data.coords.lng,
      )
    },
    async submit_form() {
      this.$data.submitting_image = true
      this.$data.submitting_report = true
      const image = await
      upload_image(this.$data.image)
        .then(async image => {
          this.$data.submitting_image = false
          tag_area(this.$data.location_detail.replace(/\s/g, '_').replace(/\./g, ''), [this.$data.tags])
          submit_feedback({
            image,
            coordinate: {
              x: this.$data.coords.lng,
              y: this.$data.coords.lat,
            },
            rating: this.$data.rating_value,
            description: this.$data.description,
            user: this.$session.get("user").id,
            location: this.$data.location_detail.replace(/\s/g, '_').replace(/\./g, ''),
          })
        })
        .then(() => {
          this.$data.submitting_report = false
          this.$router.push(`/post_rate/${this.$data.tags}`)
        })
    },
    update_rating(val) { this.$data.rating_value = val},
  },
}
