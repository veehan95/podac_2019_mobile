import axios from 'axios'
import google_api_credential from '@/google_api.json'

const geocode = (latitude, longitude) => {
  return new Promise(res => {
    axios.get(
      'https://maps.googleapis.com/maps/api/geocode/json?latlng='
      + `${latitude},${longitude}&key=${google_api_credential.apiKey}`
    ).then(json => res(json.data.results[0].formatted_address))
  })
}

export {
  geocode,
}
