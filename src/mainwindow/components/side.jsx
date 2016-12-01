'use strict'

import React, {Component, PropTypes} from 'react'

export default class Side extends Component {
  render () {
    return (
      <div className='ui visible right sidebar inverted vertical menu'>
        <div className='ui center aligned large header inverted'>Stock</div>
        <div className='ui segment inverted'>
          <div className='ui relaxed middle aligned divided inverted list'>
            {this._getProductListView(this.props.productList)}
          </div>
        </div>
      </div>
    )
  }
  _getProductListView (productList) {
    return productList.map(product => {
      let itemContentView
      if (product.editable) {
        itemContentView = <div className='product' id={product.id}>
          <div className='ui mini icon input'>
            <input type='text' defaultValue={product.name} id={product.id}/>
          </div>
          <a href='#'><i className='checkmark box icon'></i></a>
        </div>
        
      } else {
        itemContentView = <div className='product' id={product.id}>
          {product.name} <a href='#'><i className='edit icon'></i></a>
        </div>
      }
      return (<div className='item' key={product.id}>
                <div className='middle aligned content'>
                  {itemContentView}
                </div>
                <div className='extra'>
                   <span>{product.amount}</span>
                </div>
              </div>)
    })
  }
}
Side.propTypes = {
  productList: PropTypes.array.isRequired
}