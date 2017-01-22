'use default'

import React from 'react'

import * as util from '../../util/util'
import dispatcher from '../../util/flux/dispatcher'
import * as c from '../../util/const'
import * as eventActions from '../flux/actions.event'
import getText from '../../util/locale'

export default ({data, ui, isArchived}) => {
  return (
    <div className='ui cards eventgroup'>
      {_getEventGroupIdList(data, ui, isArchived).map(eventGroupId => <EventGroup key={eventGroupId}
        id={eventGroupId} data={data} ui={ui} />
      )}
    </div>
  )
}

const EventGroup = ({data, id}) => {
  let eventGroup = data.eventGroupSet[id]
  return (
    <div className={'ui raised card'}>
      <div className='content'>
        <EventGroupCardHeader status={eventGroup.status} title={eventGroup.title} id={id} />
        <EventGroupCardMeta date={eventGroup.date} kind={eventGroup.kind} />
        <div className='description'>
          <div className='ui list'>
            {eventGroup.eventIdList.map(eventId => {
              let event = data.eventSet[eventId]
              return <Event key={eventId}
                amount={event.amount}
                productName={data.productSet[event.productId].name} />
            })}
          </div>
        </div>
      </div>
      <EventGroupCardButton status={eventGroup.status} id={eventGroup.id} />
    </div>
  )
}

const EventGroupCardHeader = ({status, title, id}) => {
  function _removeEventGroup (id) {
    dispatcher.dispatch(eventActions.DELETE_EVENTGROUP, id)
  }

  return (
    <div className='header'>
      {_getStatusIcon(status)} {title}
      <a href='#' onClick={() => _removeEventGroup(id)}>
        <i className='ui right floated trash icon' />
      </a>
    </div>
  )
}

const EventGroupCardMeta = ({date, kind}) => {
  return (
    <div className='meta'>
      {util.getDateString(new Date(date))} {
        kind === c.EVENTGROUP_KIND.SALE
        ? (
          <div className={'ui blue mini label'}>
            <i className='shop icon' /> {getText('Sale')}
          </div>)
        : (
          <div className={'ui teal mini label'}>
            <i className='industry icon' /> {getText('Production')}
          </div>)}
    </div>
  )
}

const EventGroupCardButton = ({status, id}) => {
  function _proceedEventGroupStatus (eventGroupId) {
    dispatcher.dispatch(eventActions.PROCEED_EVENTGROUP_STATUS, eventGroupId)
  }

  function _undoEventGroupStatus (eventGroupId) {
    dispatcher.dispatch(eventActions.UNDO_EVENTGROUP_STATUS, eventGroupId)
  }

  switch (status) {
    case c.EVENTGROUP_STATUS.READY:
      return (
        <div className='ui bottom attached small button' onClick={() => _proceedEventGroupStatus(id)}>
          <i className='money icon' /> {getText('Process')}
        </div>)
    case c.EVENTGROUP_STATUS.PROCESSING:
      return (
        <div className='ui bottom attached small two buttons'>
          <div className='ui button' onClick={() => _undoEventGroupStatus(id)}>
            <i className='undo icon' /> {getText('Undo')}
          </div>
          <div className='or' />
          <div className='ui positive button' onClick={() => _proceedEventGroupStatus(id)}>
            <i className='shipping icon' /> {getText('Done')}
          </div>
        </div>)
    case c.EVENTGROUP_STATUS.DONE:
      return (
        <div className='ui bottom attached small two buttons'>
          <div className='ui button' onClick={() => _undoEventGroupStatus(id)}>
            <i className='undo icon' /> {getText('Undo')}
          </div>
          <div className='or' />
          <div className='ui positive button' onClick={() => _proceedEventGroupStatus(id)}>
            <i className='archive icon' /> {getText('Archive')}
          </div>
        </div>)
    case c.EVENTGROUP_STATUS.ARCHIVED:
      return (
        <div className='ui bottom attached small button' onClick={() => _undoEventGroupStatus(id)}>
          <i className='undo icon' /> {getText('Undo')}
        </div>)
  }
}

const Event = ({amount, productName}) => {
  return (
    <div className='item'>
      <i className='cube icon' />
      <div className='content'>
        {productName}: {amount}
      </div>
    </div>
  )
}

function _getEventGroupIdList (data, ui, isArchived) {
  let filteredList = data.eventGroupIdList.filter(eventGroupId => {
    let kind = data.eventGroupSet[eventGroupId].kind
    switch (ui.activeKind) {
      case c.EVENTGROUP_KIND.ALL: return true
      default: return kind === ui.activeKind
    }
  })

  return filteredList.filter(eventGroupId => {
    let status = data.eventGroupSet[eventGroupId].status
    switch (ui.activeTab) {
      case c.UI_TAB.ALL: return true
      case c.UI_TAB.READY: return status === c.EVENTGROUP_STATUS.READY
      case c.UI_TAB.PROCESSING: return status === c.EVENTGROUP_STATUS.PROCESSING
      case c.UI_TAB.DONE: {
        if (isArchived) {
          return status === c.EVENTGROUP_STATUS.ARCHIVED
        } else {
          return status === c.EVENTGROUP_STATUS.DONE
        }
      }
    }
  })
}

function _getStatusIcon (status) {
  switch (status) {
    case c.EVENTGROUP_STATUS.READY: return <i className={c.STATUS_ICON_NAME['READY'] + ' icon'} />
    case c.EVENTGROUP_STATUS.PROCESSING: return <i className={c.STATUS_ICON_NAME['PROCESSING'] + ' icon'} />
    case c.EVENTGROUP_STATUS.DONE: return <i className={c.STATUS_ICON_NAME['DONE'] + ' icon'} />
    case c.EVENTGROUP_STATUS.ARCHIVED: return <i className={c.STATUS_ICON_NAME['ARCHIVED'] + ' icon'} />
  }
}
