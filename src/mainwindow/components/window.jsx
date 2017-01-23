'use strict'

import React, {Component, PropTypes} from 'react'

import Body from './body'
import Side from './side'
import ModalNewProduct from './modal.new.product'

export default class Window extends Component {
  componentDidMount () {
    $('#ModalNewProduct').modal({
      closable: false
    })
    $('#ProductList').sortable({
      handle: '.EditableItemContent-moveHandler'
    })
    $('#ProductList').disableSelection()
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.store.ui.isValidNameForProduct) {
      $('#ModalNewProduct-nameForm').removeClass('error')
      $('#ModalNewProduct-createBtn').removeClass('disabled')
    } else {
      $('#ModalNewProduct-nameForm').addClass('error')
      $('#ModalNewProduct-createBtn').addClass('disabled')
    }
  }

  render () {
    return (
      <div>
        <Side data={this.props.store.data}
          ui={this.props.store.ui} />
        <Body data={this.props.store.data}
          ui={this.props.store.ui} />
        <ModalNewProduct data={this.props.store.data}
          ui={this.props.store.ui} />
      </div>
    )
  }
}
Window.propTypes = {
  store: PropTypes.object.isRequired
}
