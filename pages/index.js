import React from 'react'
import isBrowser from 'lib/isBrowser'
import updateState from 'lib/updateState'
import { compose, withHandlers, withStateHandlers } from 'recompose'

let webcamInstance

const setRef = instance => {
  webcamInstance = instance
}

export default compose(
  withStateHandlers(
    {
      imageSrc: null,
      videoWidth: 640,
      videoHeight: 480,
    },
    {
      setImageSrc: ({ imageSrc }) => value =>
        updateState('imageSrc', imageSrc, value),
      setVideoDimensions: ({ videoWidth, videoHeight }) => (width, height) => ({
        ...updateState('videoWidth', videoWidth, width),
        ...updateState('videoHeight', videoHeight, height),
      }),
    }
  ),
  withHandlers({
    handleMetaDataLoad: () => () => {
      webcamInstance.videoElement.width = webcamInstance.videoElement.videoWidth
      webcamInstance.videoElement.height =
        webcamInstance.videoElement.videoHeight
    },
  }),
  withHandlers({
    capture: ({ setImageSrc }) => () => {
      setImageSrc(webcamInstance.getScreenshot())
    },
    handleUserMedia: ({ handleMetaDataLoad }) => () => {
      webcamInstance.videoElement.addEventListener(
        'loadedmetadata',
        handleMetaDataLoad
      )
    },
  })
)(({ capture, handleUserMedia, imageSrc }) => {
  if (!isBrowser) return <div />

  const Webcam = require('@cliener/react-webcam').default

  return (
    <div>
      <Webcam onUserMedia={handleUserMedia} ref={setRef} />
      <button onClick={capture}>Capture photo</button>
      {imageSrc && <img alt="Captured" src={imageSrc} />}
    </div>
  )
})
