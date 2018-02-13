import PropTypes from 'prop-types'
import { setPropTypes } from 'recompose'
import React from 'react'

export default setPropTypes({
  onChange: PropTypes.func,
})(({ onChange }) => (
  <input type="file" capture="camera" accept="image/*" onChange={onChange} />
))
