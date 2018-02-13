import React from 'react'
import isBrowser from 'lib/isBrowser'
import hasWebcamAccess from 'lib/hasWebcamAccess'
import { compose, lifecycle, withHandlers, setPropTypes } from 'recompose'
import PropTypes from 'prop-types'
import WebcamFallback from './WebcamFallback'

let webcamInstance

const setRef = instance => {
  webcamInstance = instance
}

export default compose(
  setPropTypes({
    autoSize: PropTypes.bool,
    capture: PropTypes.func.isRequired,
  }),
  withHandlers({
    handleResize: ({ autoSize }) => () => {
      if (!autoSize) return

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
    handleUserMedia: ({ handleResize }) => () => {
      window.addEventListener('resize', handleResize)
      webcamInstance.videoElement.addEventListener(
        'loadedmetadata',
        handleResize
      )
    },
  }),
  lifecycle({
    componentWillUnmount() {
      const { handleResize } = this.props

      window.removeEventListener('resize', handleResize)
    },
  })
)(({ handleButtonClick, handleInputChange, handleUserMedia, ...props }) => {
  if (!isBrowser() || !hasWebcamAccess())
    return <WebcamFallback onChange={handleInputChange} />

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
