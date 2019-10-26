const image_via_camera = () => {
  return new Promise((resolve, reject) => {
    navigator.camera.getPicture(
      resolve,
      reject,
      {quality: 50, destinationType: Camera.DestinationType.DATA_URL}
    )
  })
}

const current_coords = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.watchPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      reject,
      {timeout: 30000}
    )
  })
}

export {
  image_via_camera,
  current_coords,
}
