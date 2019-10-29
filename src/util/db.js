import firebase from 'firebase'
import firebaseConfig from '@/firebase.json'
import uuidv1 from 'uuid/v1'
import moment from 'moment'

firebase.initializeApp(firebaseConfig)

const db = firebase.database()
const storage = firebase.storage()


const update_rating = (rating, val) => {
  rating = rating ? rating : {}
  return {
    total: rating.total ? rating.total += val.rating : val.rating,
    number_of_rating: rating.number_of_rating ? rating.number_of_rating += 1 : 1,
  }
}

const update_history = (history, id, val) => {
  const key = moment().format('YYYY_MM_DD')
  history = history ? history : {}

  if (history[key]) {
    history[key].report.push(id)
    history[key].rating = update_rating(history[key].rating, val)
  } else {
    history[key] = {
      report: [id],
      rating: update_rating({}, val)
    }
  }

  return history
}

const available_rewards_ref = db.ref("available_rewards")
const rewards_ref = db.ref("reward")
const user_ref = db.ref("user")
const feedbacks_ref = db.ref("feedbacks")
const images_ref = storage.ref("images")
const area_ref = db.ref("location_detail")

const get_available_rewards = async () =>{
  return new Promise(res => {
    rewards_ref
      .once('value')
      .then(snapshot => {
        const val = snapshot.val()
        res(
          Object.keys(val)
            .filter(key => val[key].available == true)
            .map(key => {
              return {id:key, ...val[key]}
            })
        )
      })
  })
}

const get_reward = async (id) =>{
  return new Promise(res => {
    rewards_ref
      .child(id)
      .once("value")
      .then(snapshot => {
        let to_return = snapshot.val() || {}
        to_return.id = id
        return res(to_return)
      })
  })
}

const get_user = async (id) => {
  return new Promise(res => {
    user_ref
      .child(id)
      .once("value")
      .then(snapshot => res(snapshot.val()))
  })
}

const get_user_id = async (id) => {
  return new Promise(res => {
    user_ref
      .orderByChild('username')
      .equalTo(id)
      .once('value')
      .then(snapshot => res(snapshot.val()))
  })
}

const claim_reward = async (user, item) => {
  const user_points = (await get_user(user)).points
  const item_points = (await get_reward(item)).points

  if (user_points < item_points)
    return false

  user_ref
    .child(user)
    .child("points")
    .transaction(x => x - item_points)
  const reward_obj = {
    date: Date.now(),
    id: item,
    code: Math.random().toString(36).substring(7)
  }
  return user_ref
    .child(user)
    .child("reward_history")
    .push(reward_obj)
    .key
}

const get_user_reward = async (user, item) => {
  return new Promise(res => {
    user_ref
      .child(user)
      .child("reward_history")
      .child(item)
      .once("value")
      .then(snapshot => res(snapshot.val()))
  })
}

const get_reward_history = async (user) => {
  return new Promise(res => {
    user_ref
      .child(user)
      .child("reward_history")
      .once("value")
      .then(snapshot => res(snapshot.val()))
  })
}

const upload_image = async (image_blob, filename=uuidv1()) => {
  images_ref
    .child(`${filename}.jpeg`)
    .putString(image_blob, 'base64')
  return filename
}

const submit_feedback = async (val) => {
  const id = uuidv1()
  await db.ref("feedback").child(id).set(val)
  await db.ref("location_detail")
    .child(val.location.replace(/\s/g, '_'))
    .transaction(x => {
      x = x ? x : {}
      x.rating = update_rating(x.rating, val)
      x.history = update_history(x.history, id, val)
      return x
    })
  await db.ref("user")
    .child(val.user)
    .child('feedbacks')
    .transaction(x => x ? x.concat(id): [id])
  await db.ref("user")
    .child(val.user)
    .child('points')
    .transaction(x => x + 100 < 1000 ? x + 100: 1000)
}

const tag_area = async (loc, tags) => {
  area_ref
    .child(loc)
    .child('tags')
    .transaction(x => x = undefined ? x.concat(tags.filter(tag => x.indexOf(tag))) : tags)
}

const get_area_tag = async (loc) => {
  return new Promise(res => {
    area_ref
      .child(loc)
      .child("tags")
      .once("value")
      .then(snapshot => res(snapshot.val()))
  })
}

const get_area_detail = async () => {
  return new Promise(res => {
    area_ref
      .once("value")
      .then(snapshot => res(snapshot.val()))
  })
}

const get_area_with_tag = async (tags) => {
  return new Promise(res => {
    area_ref
      .once("value")
      .then(snapshot => {
        const area = snapshot.val()
        const valid = Object.keys(area)
          .filter(key => {
            for(tag in area[key].tags)
              if (tags.indexOf(tag))
              return true
            return false
          })
        res(valid)
      })
  })
}

const get_image = async (image_name)=> {
  return new Promise(res => {
    images_ref
      .child(image_name)
      .getDownloadURL()
      .then(url => res(url))
  })
}
export {
  get_available_rewards,
  get_user,
  claim_reward,
  get_user_reward,
  get_reward_history,
  upload_image,
  submit_feedback,
  tag_area,
  get_area_tag,
  get_area_detail,
  get_area_with_tag,
  get_image,
  get_reward,
  get_user_id,
}
