'use strict'

import React, {PropTypes, Component} from 'react'
import PresentationalComp from './presentational'

import * as util from '../../util/util'
import dispatcher from '../../util/flux/dispatcher'
import * as c from '../../util/const'
import * as eventActions from '../flux/actions.event'
import getText from '../../util/locale'

function _getStatusIcon (status) {
  const STATUS_ICON_NAME = {
    ALL: 'hourglass full',
    READY: 'hourglass start',
    PROCESSING: 'hourglass half',
    DONE: 'hourglass end',
    ARCHIVED: 'archive'
  }

  return (<i className={STATUS_ICON_NAME[status] + ' icon'} />)
}

export default class BodyList extends PresentationalComp {
  render () {
    return (
      <div id='bodyList'>
        <button className='left floated circular ui icon button' id='add-eventgroup-btn' onClick={() => this._openAddWindow()}>
          <i className='plus icon' />
        </button>
        <div className='ui one column right aligned grid'>
          <div className='column'>
            <SearchBar />
          </div>
        </div>
        <Tab data={this.props.data} ui={this.props.ui} />
        <div className='ui bottom attached active tab segment'>
          <KindSelector data={this.props.data} ui={this.props.ui} />
          <EventGroupList data={this.props.data} ui={this.props.ui} />
          {this.props.ui.activeTab === c.UI_TAB.DONE
            ? <h4 className='ui dividing header' onClick={() => this._toggleArchived()}>
              {_getStatusIcon('ARCHIVED')} {this.props.ui.isArchivedVisible
                ? getText('Hide archived') : getText('Show archived')}
            </h4> : ''}
          {this.props.ui.activeTab === c.UI_TAB.DONE && this.props.ui.isArchivedVisible
            ? <ArchivedEventGroupList data={this.props.data} ui={this.props.ui} /> : ''}
        </div>
      </div>
    )
  }
  _toggleArchived () {
    dispatcher.dispatch(eventActions.TOGGLE_ARCHIVED, !this.props.ui.isArchivedVisible)
  }
  _openAddWindow () {
    dispatcher.dispatch(eventActions.OPEN_ADDWINDOW)
  }
}

class Tab extends PresentationalComp {
  render () {
    let tabListView = []
    Object.keys(c.UI_TAB).forEach(tab => {
      let tabView
      let tabName = c.UI_TAB[tab]
      let tabIcon = _getStatusIcon(tab)
      if (tabName === this.props.ui.activeTab) {
        tabView = <div key={tabName} className='active item'>{tabIcon} {getText(tabName)}</div>
      } else {
        tabView = <div key={tabName} className='item' onClick={() => this._changeActiveTab(tabName)}>{tabIcon} {getText(tabName)}</div>
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

class KindSelector extends PresentationalComp {
  render () {
    let activeKind = this.props.ui.activeKind
    return (
      <div className='ui form'>
        <div className='inline fields'>
          <div className='field'>
            <KindRadio kind={c.EVENTGROUP_KIND.ALL} checked={activeKind === c.EVENTGROUP_KIND.ALL} />
            <KindRadio kind={c.EVENTGROUP_KIND.SALE} checked={activeKind === c.EVENTGROUP_KIND.SALE} />
            <KindRadio kind={c.EVENTGROUP_KIND.PRODUCTION} checked={activeKind === c.EVENTGROUP_KIND.PRODUCTION} />
          </div>
        </div>
      </div>
    )
  }
}

class KindRadio extends Component {
  render () {
    let labelText = ''
    switch (this.props.kind) {
      case c.EVENTGROUP_KIND.ALL:
        labelText = getText('All')
        break
      case c.EVENTGROUP_KIND.PRODUCTION:
        labelText = getText('Production')
        break
      case c.EVENTGROUP_KIND.SALE:
        labelText = getText('Sale')
        break
    }

    return (
      <div className='ui radio checkbox'>
        <input type='radio' name={this.props.kind} onChange={() => this._changeActiveKind(this.props.kind)} checked={this.props.checked} />
        <label>{labelText}</label>
      </div>
    )
  }
  _changeActiveKind (kind) {
    dispatcher.dispatch(eventActions.CHANGE_ACTIVE_KIND, kind)
  }
}
KindRadio.propTypes = {
  kind: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired
}

class EventGroupList extends PresentationalComp {
  render () {
    let eventGroupIdList = this._getEventGroupIdList(this.props.data.eventGroupIdList)
    return (
      <div className='ui cards eventgroup'>
        {this._getEventGroupListView(eventGroupIdList)}
      </div>
    )
  }
  _getEventGroupIdList (eventGroupIdList) {
    let filteredList = eventGroupIdList.filter(eventGroupId => {
      let kind = this.props.data.eventGroupSet[eventGroupId].kind
      switch (this.props.ui.activeKind) {
        case c.EVENTGROUP_KIND.ALL: return true
        default: return kind === this.props.ui.activeKind
      }
    })
    return filteredList.filter(eventGroupId => {
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
        id={eventGroupId} data={this.props.data} ui={this.props.ui} />
      eventGroupListView.push(eventGroupView)
    })
    return eventGroupListView
  }
}

class ArchivedEventGroupList extends EventGroupList {
  _getEventGroupIdList (eventGroupIdList) {
    let filteredList = eventGroupIdList.filter(eventGroupId => {
      let kind = this.props.data.eventGroupSet[eventGroupId].kind
      switch (this.props.ui.activeKind) {
        case c.EVENTGROUP_KIND.ALL: return true
        default: return kind === this.props.ui.activeKind
      }
    })

    return filteredList.filter(eventGroupId => {
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
      kindView.labelText = getText('Sale')
      kindView.cardColor = 'blue'
    } else {
      kindView.labelIcon = 'industry icon'
      kindView.labelText = getText('Production')
      kindView.cardColor = 'teal'
    }

    let label = <div className={'ui ' + kindView.cardColor + ' mini label'}><i className={kindView.labelIcon} /> {kindView.labelText}</div>
    let eventListView = []
    eventGroup.eventIdList.forEach(eventId => {
      let eventView = <Event key={eventId} id={eventId} data={this.props.data} />
      eventListView.push(eventView)
    })
    return (
      <div className={'ui raised card'}>
        <div className='content'>
          <div className='header'>
            {this._getStatusIcon(eventGroup.status)} {eventGroup.title}
            <a href='#' onClick={() => this._removeEventGroup(this.props.id)}>
              <i className='ui right floated trash icon' />
            </a>
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
        {() => this._getAttachedButtonView(eventGroup.status, eventGroup.id)}
      </div>
    )
  }
  _getAttachedButtonView (status, id) {
    switch (status) {
      case c.EVENTGROUP_STATUS.READY:
        return (
          <div className='ui bottom attached small button' onClick={() => this._proceedEventGroupStatus(id)}>
            <i className='money icon' /> {getText('Process')}
          </div>)
      case c.EVENTGROUP_STATUS.PROCESSING:
        return (
          <div className='ui bottom attached small two buttons'>
            <div className='ui button' onClick={() => this._undoEventGroupStatus(id)}>
              <i className='undo icon' /> {getText('Undo')}
            </div>
            <div className='or' />
            <div className='ui positive button' onClick={() => this._proceedEventGroupStatus(id)}>
              <i className='shipping icon' /> {getText('Done')}
            </div>
          </div>)
      case c.EVENTGROUP_STATUS.DONE:
        return (
          <div className='ui bottom attached small two buttons'>
            <div className='ui button' onClick={() => this._undoEventGroupStatus(id)}>
              <i className='undo icon' /> {getText('Undo')}
            </div>
            <div className='or' />
            <div className='ui positive button' onClick={() => this._proceedEventGroupStatus(id)}>
              <i className='archive icon' /> {getText('Archive')}
            </div>
          </div>)
      case c.EVENTGROUP_STATUS.ARCHIVED:
        return (
          <div className='ui bottom attached small button' onClick={() => this._undoEventGroupStatus(id)}>
            <i className='undo icon' /> {getText('Undo')}
          </div>)
    }
  }
  _getStatusIcon (status) {
    switch (status) {
      case c.EVENTGROUP_STATUS.READY: return _getStatusIcon('READY')
      case c.EVENTGROUP_STATUS.PROCESSING: return _getStatusIcon('PROCESSING')
      case c.EVENTGROUP_STATUS.DONE: return _getStatusIcon('DONE')
      case c.EVENTGROUP_STATUS.ARCHIVED: return _getStatusIcon('ARCHIVED')
    }
  }
  _proceedEventGroupStatus (eventGroupId) {
    dispatcher.dispatch(eventActions.PROCEED_EVENTGROUP_STATUS, eventGroupId)
  }
  _undoEventGroupStatus (eventGroupId) {
    dispatcher.dispatch(eventActions.UNDO_EVENTGROUP_STATUS, eventGroupId)
  }
  _removeEventGroup (id) {
    dispatcher.dispatch(eventActions.DELETE_EVENTGROUP, id)
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
        <i className='cube icon' />
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
      <div className='ui search' id='eventSearch'>
        <div className='ui icon input'>
          <input className='prompt' type='text' onChange={this._search} />
          <i className='search icon' />
        </div>
        <div className='results' />
      </div>
    )
  }
  _search (e) {
    dispatcher.dispatch(eventActions.SEARCH_PRODUCTNAME, e.target.value)
  }
}
