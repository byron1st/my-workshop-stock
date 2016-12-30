'use strict'

import React, {Component, PropTypes} from 'react'

import * as util from '../../util/util'
import dispatcher from '../../util/flux/dispatcher'
import * as c from '../../util/const'
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
        <SearchBar text={this.props.text}/>
        <div className='ui three column divided grid'>
          <div className='row'>
            <HistorySegment type={c.EVENT_TYPE.READY} eventList={eventList} text={this.props.text}/>
            <HistorySegment type={c.EVENT_TYPE.PROCESSING} eventList={eventList} text={this.props.text}/>
            <HistorySegment type={c.EVENT_TYPE.DONE} eventList={eventList} text={this.props.text}/>
          </div>
        </div>
      </div>
    )
  }
}
BodyList.propTypes = {
  eventList: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  text: PropTypes.object.isRequired
}

class HistorySegment extends Component {
  render () {
    return (
      <div className='column'>
        <div className='ui medium center aligned header'>
          {this.props.text[this._getSegmentHeader(this.props.type)]}
        </div>
        <div className='ui cards'>
          {this._getEventListView(this.props.eventList, this.props.type)}
        </div>
      </div>
    )
  }
  _getEventListView (eventList, type) {
    return eventList.map((event, index) => {
      if (type === event.status) {
        return <Event key={event.id}
          productName={event.productName}
          amount={event.amount}
          date={new Date(event.date)}
          index={index}
          text={this.props.text}/>
      } else {
        return
      }
    })
  }
  _getSegmentHeader (type) {
    switch (type) {
    case c.EVENT_TYPE.READY: 
      return 'Ready'
    case c.EVENT_TYPE.PROCESSING:
      return 'Processing'
    case c.EVENT_TYPE.DONE:
      return 'Done'
    }
  }
}
HistorySegment.propTypes = {
  type: PropTypes.string.isRequired,
  eventList: PropTypes.array.isRequired,
  text: PropTypes.object.isRequired
}

class Event extends Component {
  render () {
    let icon, amount
    if (this.props.amount < 0) {
      icon = <i className='shipping icon'></i>
      amount = this.props.amount * -1
    } else {
      icon = <i className='cube icon'></i>
      amount = this.props.amount
    }

    return (
      <div className='card'>
        <div className='content'>
          <div className='header'>
            {icon} {this.props.productName}: {util.getCurrencyValue(amount)}
          </div>
          <div className='meta'>
            {util.getDateString(new Date(this.props.date))}
          </div>
        </div>
        <div className='extra content'>
          <div className='ui two buttons'>
            <div className='ui basic green button'>{this.props.text['Accept']}</div>
            <div className='ui basic red button' onClick={() => this._delete(this.props.index, this.props.text)}>{this.props.text['Delete']}</div>
          </div>
        </div>
      </div>
    )
  }
  _delete (index, text) {
    dispatcher.dispatch(eventActions.DELETE_EVENT, {eventIndex: index, text: text})
  }
}
Event.propTypes = {
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