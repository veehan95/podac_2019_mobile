import firebase from 'firebase'
import firebaseConfig from '@/firebase.json'
import uuidv1 from 'uuid/v1'

firebase.initializeApp(firebaseConfig)

const db = firebase.database()
const storage = firebase.storage()

const available_rewards_ref = db.ref("available_rewards")
const rewards_ref = db.ref("rewards")
const user_ref = db.ref("user")
const feedbacks_ref = db.ref("feedbacks")
const images_ref = storage.ref("images")
const area_ref = db.ref("area")

const get_available_rewards = async () =>{
  return new Promise(res => {
    available_rewards_ref
      .once("value")
      .then(snapshot => res(
        Promise.all(
          snapshot.val().filter(id => id.length > 0).map(get_reward)
        )
      ))
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

const submit_feedback = async (loc, values) => {
  feedbacks_ref
    .child(loc)
    .push()
    .set(values)
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
}
