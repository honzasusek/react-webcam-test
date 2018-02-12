import React from 'react'
import isBrowser from 'lib/isBrowser'
import updateState from 'lib/updateState'
import {
  compose,
  withHandlers,
  withStateHandlers,
  setPropTypes,
} from 'recompose'
import PropTypes from 'prop-types'

let webcamInstance

const setRef = instance => {
  webcamInstance = instance
}

export default compose(
  setPropTypes({
    capture: PropTypes.func.isRequired,
  }),
  withStateHandlers(
    {
      videoWidth: 640,
      videoHeight: 480,
    },
    {
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
    handleButtonClick: ({ capture }) => () => {
      capture(webcamInstance.getScreenshot())
    },
    handleInputChange: ({ capture }) => e => {
      if (e.target.files && e.target.files.length) {
        capture(window.URL.createObjectURL(e.target.files[0]))
      }
    },
    handleUserMedia: ({ handleMetaDataLoad }) => () => {
      webcamInstance.videoElement.addEventListener(
        'loadedmetadata',
        handleMetaDataLoad
      )
    },
  })
)(({ handleButtonClick, handleInputChange, handleUserMedia, ...props }) => {
  if (!isBrowser) return <div />

  if (!navigator || !navigator.getUserMedia)
    return (
      <input
        type="file"
        capture="camera"
        accept="image/*"
        onChange={handleInputChange}
      />
    )

  const Webcam = require('@cliener/react-webcam').default

  return [
    <Webcam
      key="webcam"
      onUserMedia={handleUserMedia}
      ref={setRef}
      {...props}
    />,
    <button key="button" onClick={handleButtonClick}>
      Capture photo
    </button>,
  ]
})
