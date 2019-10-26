export default {
  name: 'Container',
  data() {
    return {
      show_menu: false,
    }
  },
  methods: {
    close_menu() { this.$data.show_menu = false },
    open_menu() { this.$data.show_menu = true },
    logout() { this.$session.destroy() }
  }
}
