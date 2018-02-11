export default (key, oldValue, newValue) =>
  newValue !== oldValue ? { [key]: newValue } : undefined // eslint-disable-line no-undefined
