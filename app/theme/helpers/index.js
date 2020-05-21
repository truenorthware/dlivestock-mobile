import styledMap, { _dotProp } from 'styled-map'

export const mapToTheme = (key, propName = 'variant') => props =>
  propName ? styledMap(propName, _dotProp(key, props.theme)) : styledMap(_dotProp(key, props.theme))
