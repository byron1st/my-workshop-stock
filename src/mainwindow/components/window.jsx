'use strict'

import React, {Component, PropTypes} from 'react'

// import Body from './body'
import Side from './side'

export default class Window extends Component {
  render () {
    return (
      <div>
        <Side 
          data={this.props.store.data}
          ui={this.props.store.ui}
          text={this.props.text} />
        {/*<Body eventList={this.props.store.eventList}
          newEvent={this.props.store.newEvent}
          productSet={this.props.store.productSet}
          productOrder={this.props.store.productOrder}
          searchTerm={this.props.store.searchTerm}
          isArchivedVisible={this.props.store.isArchivedVisible}
          text={this.props.text}/>*/}
      </div>
    )
  }
}
Window.propTypes = {
  store: PropTypes.object.isRequired,
  text: PropTypes.object.isRequired
}