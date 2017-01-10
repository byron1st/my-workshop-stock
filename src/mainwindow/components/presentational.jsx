'use strict'

import {Component, PropTypes} from 'react'

export default class PresentationalComp extends Component {
}
PresentationalComp.propTypes = {
  data: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  text: PropTypes.object.isRequired
}