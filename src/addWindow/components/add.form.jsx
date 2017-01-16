'use strict'

import React, {Component, PropTypes} from 'react'

export default class AddForm extends Component {
  componentDidMount () {
    
  }
  render () {
    return (
      <div className='ui raised segment'>
        <div className='ui form'>
          <div className='fields'>
            <div className='seven wide field'>
              <label>Title</label>
              <input type='text' />
            </div>
            <div className='three wide field'>
              <label>Kind</label>
              <input type='text' />
            </div>
            <div className='six wide field'>
              <label>Date</label>
              <input type='text' />
            </div>
          </div>
          <h4 className='ui dividing header'>Products</h4>
          <div className='fields'>
            <div className='ten wide field'>
              <label>Product</label>
              <input type='text' />
            </div>
            <div className='five wide field'>
              <label>Amount</label>
              <input type='text' />
            </div>
            <button className='ui icon button'>
              <i className='plus icon'></i>
            </button>
          </div>
          <div className='ui divider'></div>
          <div className='fields'>
            <div className='ten wide field'>
              <label>Product</label>
              <input type='text' />
            </div>
            <div className='five wide field'>
              <label>Amount</label>
              <input type='text' />
            </div>
            <button className='ui icon button'>
              <i className='minus icon'></i>
            </button>
          </div>
          <div className='fields'>
            <div className='ten wide field'>
              <label>Product</label>
              <input type='text' />
            </div>
            <div className='five wide field'>
              <label>Amount</label>
              <input type='text' />
            </div>
            <button className='ui icon button'>
              <i className='minus icon'></i>
            </button>
          </div>
          
        </div>
      </div>
    )
  }
}
AddForm.propTypes = {
  eventGroup: PropTypes.object.isRequired,
  idx: PropTypes.number.isRequired,
  text: PropTypes.object.isRequired
}

