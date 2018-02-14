import React from 'react'
import isBrowser from 'lib/isBrowser'
import hasWebcamAccess from 'lib/hasWebcamAccess'
import {
  compose,
  lifecycle,
  withHandlers,
  withStateHandlers,
  setPropTypes,
} from 'recompose'
import PropTypes from 'prop-types'
import WebcamFallback from './WebcamFallback'
import updateState from '../lib/updateState'

let webcamInstance

const setRef = instance => {
  webcamInstance = instance
}

export default compose(
  setPropTypes({
    autoSize: PropTypes.bool,
    capture: PropTypes.func.isRequired,
  }),
  withStateHandlers(
    {
      error: false,
    },
    {
      setError: ({ error }) => value => updateState('error', error, value),
    }
  ),
  withHandlers({
    handleResize: ({ autoSize }) => () => {
      if (!autoSize) return

      webcamInstance.videoElement.width = webcamInstance.videoElement.videoWidth
      webcamInstance.videoElement.height =
        webcamInstance.videoElement.videoHeight
    },
  }),
  withHandlers({
    handleError: ({ setError }) => () => setError(true),
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
)(
  ({
    error,
    handleButtonClick,
    handleError,
    handleInputChange,
    handleUserMedia,
    ...props
  }) => {
    if (error || !isBrowser() || !hasWebcamAccess())
      return <WebcamFallback onChange={handleInputChange} />

    const Webcam = require('@cliener/react-webcam').default

    return [
      <Webcam
        audio={props.audio || false} // audio=false is required by Edge
        key="webcam"
        onFailure={handleError}
        onUserMedia={handleUserMedia}
        ref={setRef}
        {...props}
      />,
      <button key="button" onClick={handleButtonClick}>
        Capture photo
      </button>,
    ]
  }
)
