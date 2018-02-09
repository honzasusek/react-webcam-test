import { css } from 'styled-components'
import breakpoints from './breakpoint'

const mq = Object.keys(breakpoints).reduce((accumulator, breakpoint) => {
  const emSize = breakpoints[breakpoint] / 16
  accumulator[breakpoint] = (...args) => css`
    @media (min-width: ${emSize}em) {
      ${css(...args)};
    }
  `
  return accumulator
}, {})

export default mq
