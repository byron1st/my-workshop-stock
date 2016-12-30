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
        <div className='ui segment'>
          <SearchBar text={this.props.text}/>
          <div className='ui three column divided grid'>
            <div className='row'>
              <HistorySegment type={c.EVENT_TYPE.READY} eventList={eventList} text={this.props.text}/>
              <HistorySegment type={c.EVENT_TYPE.PROCESSING} eventList={eventList} text={this.props.text}/>
              <HistorySegment type={c.EVENT_TYPE.DONE} eventList={eventList} isArchivedVisible={this.props.isArchivedVisible} text={this.props.text}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
BodyList.propTypes = {
  eventList: PropTypes.array.isRequired,
  searchTerm: PropTypes.string.isRequired,
  isArchivedVisible: PropTypes.bool.isRequired,
  text: PropTypes.object.isRequired
}

class HistorySegment extends Component {
  render () {
    let toggleArchived = ''
    if (this.props.type === c.EVENT_TYPE.DONE) {
      if (this.props.isArchivedVisible) {
        toggleArchived = <div className='sub header'>
          <a href='#' onClick={() => this._toggleArchived(false)}>{this.props.text['Hide archived']}</a>
        </div>
      } else {
        toggleArchived = <div className='sub header'>
          <a href='#' onClick={() => this._toggleArchived(true)}>{this.props.text['Show archived']}</a>
        </div>
      }
    }
    return (
      <div className='column'>
        <div className='ui medium center aligned header'>
          {this.props.text[this._getSegmentHeader(this.props.type)]}
          {toggleArchived}
        </div>
        <div className='ui middle aligned divided list'>
          {this._getEventListView(this.props.eventList, this.props.type)}
        </div>
        {this.props.isArchivedVisible ? this._getArchivedHeader(this.props.text['Archived']) : ''}
        <div className='ui middle aligned divided list'>
          {this.props.isArchivedVisible ? this._getEventListView(this.props.eventList, c.EVENT_TYPE.ARCHIVED) : ''}
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
          type={type}
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
  _getArchivedHeader (archivedText) {
    return (
      <h5 className='ui dividing disabled header'>
        {archivedText}
      </h5>
    )
  }
  _toggleArchived (isArchivedVisible) {
    dispatcher.dispatch(eventActions.TOGGLE_ARCHIVED, isArchivedVisible)
  }
}
HistorySegment.propTypes = {
  type: PropTypes.string.isRequired,
  eventList: PropTypes.array.isRequired,
  isArchivedVisible: PropTypes.bool,
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

    let leftButton, rightIcon
    switch (this.props.type) {
    case c.EVENT_TYPE.READY:
      leftButton = <button className='circular ui positive icon button' onClick={() => this._approve(this.props.index)}>
          <i className='checkmark icon'></i>
        </button>
      rightIcon = <i className='ui right floated remove icon' onClick={() => this._delete(this.props.index, this.props.text)}></i>
      break
    case c.EVENT_TYPE.DONE:
      leftButton = <button className='circular ui positive icon button' onClick={() => this._approve(this.props.index)}>
          <i className='archive icon'></i>
        </button>
      rightIcon = <i className='ui right floated angle double down icon' onClick={() => this._disapprove(this.props.index)}></i>
      break
    case c.EVENT_TYPE.ARCHIVED:
      leftButton = <button className='circular ui icon disabled button'>
          <i className='archive icon'></i>
        </button>
      rightIcon = <i className='ui right floated angle double down icon' onClick={() => this._disapprove(this.props.index)}></i>
      break
    default:
      leftButton = <button className='circular ui positive icon button' onClick={() => this._approve(this.props.index)}>
          <i className='checkmark icon'></i>
        </button>
      rightIcon = <i className='ui right floated angle double down icon' onClick={() => this._disapprove(this.props.index)}></i>
    }

    return (
      <div className='item'>
        <div className='left floated content'>
          {leftButton}
        </div>
        <div className='content'>
          <div className='header'>
            {icon} {this.props.productName}: {util.getCurrencyValue(amount)}
            <a href='#'>{rightIcon}</a>
          </div>
          <div className='description'>
            {util.getDateString(new Date(this.props.date))}
          </div>
        </div>
      </div>
    )
  }
  _delete (index, text) {
    dispatcher.dispatch(eventActions.DELETE_EVENT, {eventIndex: index, text: text})
  }
  _approve (index) {
    dispatcher.dispatch(eventActions.APPROVE_EVENT, index)
  }
  _disapprove (index) {
    dispatcher.dispatch(eventActions.DISAPPROVE_EVENT, index)
  }
}
Event.propTypes = {
  productName: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  date: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
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