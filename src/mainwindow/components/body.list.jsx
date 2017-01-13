'use strict'

import React, {PropTypes, Component} from 'react'

import PresentationalComp from './presentational'

import * as util from '../../util/util'
import dispatcher from '../../util/flux/dispatcher'
import * as c from '../../util/const'
import * as eventActions from '../flux/actions.event'

export default class BodyList extends PresentationalComp {
  render () {
    return (
      <div id='bodyList'>
        <h4 className='ui horizontal divider header'>
          {this.props.text['History']}
        </h4>
        <div className='ui segment'>
          <SearchBar />
          <div className='ui one column grid'>
            <Tab data={this.props.data} ui={this.props.ui} text={this.props.text} />
            <div className='ui bottom attached active tab segment'>
              <EventGroupList data={this.props.data} ui={this.props.ui} text={this.props.text} />
              {this.props.ui.activeTab === c.UI_TAB.DONE ? 
                <h4 className='ui dividing header' onClick={() => this._toggleArchived()}>
                  {this.props.ui.isArchivedVisible ? 
                    this.props.text['Hide archived'] : this.props.text['Show archived']}
                </h4> : ''}
              {this.props.ui.activeTab === c.UI_TAB.DONE && this.props.ui.isArchivedVisible ?
                <ArchivedEventGroupList data={this.props.data} ui={this.props.ui} text={this.props.text} /> : ''}
            </div>
          </div>
        </div>
      </div>
    )
  }
  _toggleArchived () {
    dispatcher.dispatch(eventActions.TOGGLE_ARCHIVED, !this.props.ui.isArchivedVisible)
  }
}

class Tab extends PresentationalComp {
  render () {
    let tabListView = []
    Object.keys(c.UI_TAB).forEach(tab => {
      let tabView
      let tabName = c.UI_TAB[tab]
      if (tabName === this.props.ui.activeTab) {
        tabView = <div key={tabName} className='active item'>{this.props.text[tabName]}</div>
      } else {
        tabView = <div key={tabName} className='item' onClick={() => this._changeActiveTab(tabName)}>{this.props.text[tabName]}</div>
      }
      tabListView.push(tabView)
    })

    return (
      <div className='ui top attached tabular menu'>
        {tabListView}
      </div>
    )
  }
  _changeActiveTab (tab) {
    dispatcher.dispatch(eventActions.CHANGE_ACTIVE_TAB, tab)
  }
}

class EventGroupList extends PresentationalComp {
  render() {
    let eventGroupIdList = this._getEventGroupIdList(this.props.data.eventGroupIdList)
    return (
      <div className='ui cards eventgroup'>
        {this._getEventGroupListView(eventGroupIdList)}
      </div>
    )
  }
  _getEventGroupIdList (eventGroupIdList) {
    return eventGroupIdList.filter(eventGroupId => {
      let status = this.props.data.eventGroupSet[eventGroupId].status
      switch (this.props.ui.activeTab) {
      case c.UI_TAB.ALL: return true
      case c.UI_TAB.READY: return status === c.EVENTGROUP_STATUS.READY
      case c.UI_TAB.PROCESSING: return status === c.EVENTGROUP_STATUS.PROCESSING
      case c.UI_TAB.DONE: return status === c.EVENTGROUP_STATUS.DONE
      }
    })
  }
  _getEventGroupListView (eventGroupIdList) {
    let eventGroupListView = []
    eventGroupIdList.forEach(eventGroupId => {
      let eventGroupView = <EventGroup key={eventGroupId} 
        id={eventGroupId} data={this.props.data} ui={this.props.ui} text={this.props.text} />
      eventGroupListView.push(eventGroupView)
    })
    return eventGroupListView
  }
}

class ArchivedEventGroupList extends EventGroupList {
  _getEventGroupIdList (eventGroupIdList) {
    return eventGroupIdList.filter(eventGroupId => {
      let status = this.props.data.eventGroupSet[eventGroupId].status
      return status === c.EVENTGROUP_STATUS.ARCHIVED
    })
  }
}

class EventGroup extends PresentationalComp {
  render () {
    let eventGroup = this.props.data.eventGroupSet[this.props.id]
    let kindView = {}
    if (eventGroup.kind === c.EVENTGROUP_KIND.SALE) {
      kindView.labelIcon = 'shop icon'
      kindView.labelText = this.props.text['Sale']
      kindView.cardColor = 'blue'
    } else {
      kindView.labelIcon = 'industry icon'
      kindView.labelText = this.props.text['Production']
      kindView.cardColor = 'teal'
    }

    let label = <div className={'ui ' + kindView.cardColor + ' mini label'}><i className={kindView.labelIcon}></i> {kindView.labelText}</div>
    let eventListView = []
    eventGroup.eventIdList.forEach(eventId => {
      let eventView = <Event key={eventId} id={eventId} data={this.props.data} />
      eventListView.push(eventView)
    })
    return (
      <div className={'ui raised ' + kindView.cardColor + ' card'}>
        <div className='content'>
          <div className='header'>
            {eventGroup.title}
            <i className='ui right floated trash icon'></i>
          </div>
          <div className='meta'>
            {util.getDateString(new Date(eventGroup.date))} {label}
          </div>
          <div className='description'>
            <div className='ui list'>
              {eventListView}
            </div>
          </div>
        </div>
        {this._getAttachedButtonView.call(this, eventGroup.status, eventGroup.id)}
      </div>
    )
  }
  _getAttachedButtonView (status, id) {
    switch(status) {
    case c.EVENTGROUP_STATUS.READY:
      return (
        <div className='ui bottom attached small button' onClick={() => this._proceedEventGroupStatus(id)}>
          <i className='money icon'></i> {this.props.text['Process']}
        </div>)
    case c.EVENTGROUP_STATUS.PROCESSING:
      return (
        <div className='ui bottom attached small two buttons'>
          <div className='ui button' onClick={() => this._undoEventGroupStatus(id)}>
            <i className='undo icon'></i> {this.props.text['Undo']}
          </div>
          <div className='or'></div>
          <div className='ui positive button' onClick={() => this._proceedEventGroupStatus(id)}>
            <i className='shipping icon'></i> {this.props.text['Done']}
          </div>
        </div> )
    case c.EVENTGROUP_STATUS.DONE:
      return (
        <div className='ui bottom attached small two buttons'>
          <div className='ui button' onClick={() => this._undoEventGroupStatus(id)}>
            <i className='undo icon'></i> {this.props.text['Undo']}
          </div>
          <div className='or'></div>
          <div className='ui positive button' onClick={() => this._proceedEventGroupStatus(id)}>
            <i className='archive icon'></i> {this.props.text['Archive']}
          </div>
        </div> )
    case c.EVENTGROUP_STATUS.ARCHIVED:
      return (
        <div className='ui bottom attached small button' onClick={() => this._undoEventGroupStatus(id)}>
          <i className='undo icon'></i> {this.props.text['Undo']}
        </div> )
    }
  }
  _proceedEventGroupStatus (eventGroupId) {
    dispatcher.dispatch(eventActions.PROCEED_EVENTGROUP_STATUS, eventGroupId)
  }
  _undoEventGroupStatus (eventGroupId) {
    dispatcher.dispatch(eventActions.UNDO_EVENTGROUP_STATUS, eventGroupId)
  }
}
EventGroup.propTypes = {
  id: PropTypes.string.isRequired
}

class Event extends PresentationalComp {
  render () {
    let event = this.props.data.eventSet[this.props.id]
    let productName = this.props.data.productSet[event.productId].name
    return (
      <div className='item'>
        <i className='cube icon'></i>
        <div className='content'>
          {productName}: {event.amount}
        </div>
      </div>
    )
  }
}
Event.propTypes = {
  id: PropTypes.string.isRequired
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