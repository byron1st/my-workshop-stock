'use strict'

import React from 'react'

import dispatcher from '../../util/flux/dispatcher'
import * as c from '../../util/const'
import * as eventActions from '../flux/actions.event'
import getText from '../../util/locale'

import EventGroupList from './body.eventgroup'

export default ({data, ui}) => {
  function _openAddWindow () {
    dispatcher.dispatch(eventActions.OPEN_ADDWINDOW)
  }

  return (
    <div id='Body'>
      <div>
        <button className='left floated circular ui icon button'
          id='Body-addEventgroupBtn' onClick={_openAddWindow}>
          <i className='plus icon' />
        </button>
        <div className='ui one column right aligned grid'>
          <div className='column'>
            <SearchBar />
          </div>
        </div>
        <Tab ui={ui} />
        <div className='ui bottom attached active tab segment'>
          <KindSelector data={data} ui={ui} />
          <EventGroupList data={data} ui={ui} isArchived={false} />
          {ui.activeTab === c.UI_TAB.DONE ? <ArchivedHeader ui={ui} /> : ''}
          {ui.activeTab === c.UI_TAB.DONE && ui.isArchivedVisible
            ? <EventGroupList data={data} ui={ui} isArchived /> : ''}
        </div>
      </div>
    </div>
  )
}

const SearchBar = () => {
  function _search (e) {
    dispatcher.dispatch(eventActions.SEARCH_PRODUCTNAME, e.target.value)
  }

  return (
    <div className='ui search' id='eventSearch'>
      <div className='ui icon input'>
        <input className='prompt' type='text' onChange={_search} />
        <i className='search icon' />
      </div>
      <div className='results' />
    </div>
  )
}

const Tab = ({ui}) => {
  function _changeActiveTab (tab) {
    dispatcher.dispatch(eventActions.CHANGE_ACTIVE_TAB, tab)
  }

  return (
    <div className='ui top attached tabular menu'>
      {Object.keys(c.UI_TAB).map(tab => {
        let tabName = c.UI_TAB[tab]
        let tabIcon = <i className={c.STATUS_ICON_NAME[tab] + ' icon'} />
        if (tabName === ui.activeTab) {
          return (
            <div key={tabName} className='active item'>
              {tabIcon} {getText(tabName)}
            </div>
          )
        } else {
          return (
            <div key={tabName} className='item' onClick={() => _changeActiveTab(tabName)}>
              {tabIcon} {getText(tabName)}
            </div>
          )
        }
      })}
    </div>
  )
}

const KindSelector = ({ui}) => {
  return (
    <div className='ui form'>
      <div className='inline fields'>
        <div className='field'>
          <KindRadio kind={c.EVENTGROUP_KIND.ALL} checked={ui.activeKind === c.EVENTGROUP_KIND.ALL} />
          <KindRadio kind={c.EVENTGROUP_KIND.SALE} checked={ui.activeKind === c.EVENTGROUP_KIND.SALE} />
          <KindRadio kind={c.EVENTGROUP_KIND.PRODUCTION} checked={ui.activeKind === c.EVENTGROUP_KIND.PRODUCTION} />
        </div>
      </div>
    </div>
  )
}

const KindRadio = ({kind, checked}) => {
  function _changeActiveKind (kind) {
    dispatcher.dispatch(eventActions.CHANGE_ACTIVE_KIND, kind)
  }

  return (
    <div className='ui radio checkbox'>
      <input type='radio' name={kind} onChange={() => _changeActiveKind(kind)} checked={checked} />
      <label>{_getLabelText(kind)}</label>
    </div>
  )
}

const ArchivedHeader = ({ui}) => {
  function _toggleArchived () {
    dispatcher.dispatch(eventActions.TOGGLE_ARCHIVED, !ui.isArchivedVisible)
  }

  return (
    <h4 className='ui dividing header' onClick={_toggleArchived}>
      <i className={c.STATUS_ICON_NAME.ARCHIVED + ' icon'} /> {ui.isArchivedVisible ? getText('Hide archived') : getText('Show archived')}
    </h4>
  )
}

function _getLabelText (kind) {
  switch (kind) {
    case c.EVENTGROUP_KIND.ALL:
      return getText('All')
    case c.EVENTGROUP_KIND.PRODUCTION:
      return getText('Production')
    case c.EVENTGROUP_KIND.SALE:
      return getText('Sale')
  }
}
