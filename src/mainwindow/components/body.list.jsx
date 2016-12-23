'use strict'

import React, {Component, PropTypes} from 'react'

import * as util from '../../util/util'
import dispatcher from '../../util/flux/dispatcher'
import * as eventActions from '../flux/actions.event'

export default class BodyList extends Component {
  render () {
    let eventList
    if (this.props.searchTerm) {
      eventList = this.props.eventList.filter(event => event.productName.includes(this.props.searchTerm))
    } else {
      eventList = this.props.eventList
    }
    return (
      <div id='bodyList'>
        <h4 className='ui horizontal divider header'>
          {this.props.text['History']}
        </h4>
        <div className='ui padded segment'>
          <div className='ui container'>
            <SearchBar text={this.props.text}/>
            <div className='ui feed'>
              {this._getEventListView(eventList)}
            </div>
          </div>
        </div>
      </div>
    )
  }
  _getEventListView (eventList) {
    return eventList.map((event, index) => {
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
        index={index}
        text={this.props.text}/>
    })
  }
}
BodyList.propTypes = {
  eventList: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  text: PropTypes.object.isRequired
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
                  &nbsp;<i className='remove icon' onClick={() => this._delete(this.props.index, this.props.text)}></i>
                </div>
              </div>
            </div>)
  }
  _delete (index, text) {
    dispatcher.dispatch(eventActions.DELETE_EVENT, {eventIndex: index, text: text})
  }
}
Event.propTypes = {
  icon: PropTypes.object.isRequired,
  productName: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  date: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  text: PropTypes.object.isRequired
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
    dispatcher.dispatch(eventActions.SEARCH_PRODUCTNAME, e.target.value)
  }
}
SearchBar.propTypes = {
  text: PropTypes.object.isRequired
}