import { get_user_id } from '@/util/db'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      loading: false,
    }
  },
  methods: {
    async login() {
      this.$data.loading= true
      get_user_id(this.$data.username)
        .then(user => {
          if (user == undefined) {
            alert('Invalid login.')
          } else if (this.$data.password != user[Object.keys(user)[0]].pw) {
            alert('Invalid login.')
          } else {
            this.$session.set('loggined', true)
            this.$session.set('user', {...user[Object.keys(user)[0]],id: Object.keys(user)[0]})
            this.$router.push('/')
          }
          this.$data.loading= false
        })
    },
  },
}
