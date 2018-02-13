import React from 'react'
import updateState from 'lib/updateState'
import { compose, withHandlers, withStateHandlers } from 'recompose'
import WebcamWithFallback from 'components/WebcamWithFallback'

export default compose(
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
    <WebcamWithFallback capture={handleCapture} width={320} height={200} />
    {imageSrc && <img alt="Captured" height={200} src={imageSrc} />}
  </div>
))
