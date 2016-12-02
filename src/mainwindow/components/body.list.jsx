'use strict'

import React, {Component, PropTypes} from 'react'

import * as util from '../../util/util'

export default class BodyList extends Component {
  render () {
    return (
      <div id='bodyList'>
        <h4 className='ui horizontal divider header'>
          History
        </h4>
        <div className='ui padded segment'>
          <div className='ui container'>
            <SearchBar/>
            <div className='ui feed'>
              {this._getEventListView(this.props.eventList)}
            </div>
          </div>
        </div>
      </div>
    )
  }
  _getEventListView (eventList) {
    return eventList.map(event => {
      let icon, amount
      if (event.amount < 0) {
        icon = <i className='shipping icon'></i>
        amount = event.amount * -1
      } else {
        icon = <i className='cube icon'></i>
        amount = event.amount
      }

      return <Event key={event.id}
        icon={icon}
        productName={event.productName}
        amount={amount}
        date={new Date(event.date)}
        id={event.id} />
    })
  }
}
BodyList.propTypes = {
  eventList: PropTypes.array.isRequired
}

class Event extends Component {
  render () {
    return (<div className='event'>
              <div className='label'>
                {this.props.icon}
              </div>
              <div className='content'>
                <div className='summary'>
                  {this.props.productName}: {util.getCurrencyValue(this.props.amount)}
                  <div className='date'>
                    {util.getDateString(new Date(this.props.date))}
                  </div>
                  &nbsp;<i className='remove icon' id={this.props.id}></i>
                </div>
              </div>
            </div>)
  }
}
Event.propTypes = {
  icon: PropTypes.object.isRequired,
  productName: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  date: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired
}

class SearchBar extends Component {
  render () {
    return (
      <div className='ui one column center aligned grid'>
        <div className='column'>
          <div className='ui search' id='eventSearch'>
            <div className='ui icon input'>
              <input className='prompt' type='text' onChange={this._search}/>
              <i className='search icon'></i>
            </div>
            <div className='results'></div>
          </div>
        </div>
      </div>
    )
  }
  _search(e) {
    console.log(e.target.value)
  }
}
SearchBar.propTypes = {
}