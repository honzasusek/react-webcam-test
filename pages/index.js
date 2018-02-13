import React from 'react'
import updateState from 'lib/updateState'
import { compose, lifecycle, withHandlers, withStateHandlers } from 'recompose'
import WebcamWithFallback from 'components/WebcamWithFallback'
import forceHttps from 'lib/forceHttps'
import isProduction from 'lib/isProduction'

export default compose(
  lifecycle({
    componentDidMount() {
      if (isProduction()) forceHttps()
    },
  }),
  withStateHandlers(
    {
      imageSrc: null,
    },
    {
      setImageSrc: ({ imageSrc }) => value =>
        updateState('imageSrc', imageSrc, value),
    }
  ),
  withHandlers({
    handleCapture: ({ setImageSrc }) => url => setImageSrc(url),
  })
)(({ imageSrc, handleCapture }) => (
  <div>
    <WebcamWithFallback capture={handleCapture} width="640" height="480" />
    {imageSrc && <img alt="Captured" src={imageSrc} />}
  </div>
))
