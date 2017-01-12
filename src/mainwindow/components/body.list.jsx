'use strict'

import React, {PropTypes} from 'react'

import PresentationalComp from './presentational'

import * as util from '../../util/util'
// import dispatcher from '../../util/flux/dispatcher'
import * as c from '../../util/const'
// import * as eventActions from '../flux/actions.event'

export default class BodyList extends PresentationalComp {
  render () {
    // let eventList
    // if (this.props.searchTerm) {
    //   eventList = this.props.eventList.filter(event => event.productName.includes(this.props.searchTerm))
    // } else {
    //   eventList = this.props.eventList
    // }
    return (
      <div id='bodyList'>
        <h4 className='ui horizontal divider header'>
          {this.props.text['History']}
        </h4>
        <div className='ui segment'>
          {/*<SearchBar />*/}
          <div className='ui three column divided grid'>
            <div className='row'>
              <EventGroupList data={this.props.data} ui={this.props.ui} text={this.props.text} />
              {/*<HistorySegment type={c.EVENT_TYPE.READY} eventList={eventList} text={this.props.text}/>
              <HistorySegment type={c.EVENT_TYPE.PROCESSING} eventList={eventList} text={this.props.text}/>
              <HistorySegment type={c.EVENT_TYPE.DONE} eventList={eventList} isArchivedVisible={this.props.isArchivedVisible} text={this.props.text}/>*/}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class EventGroupList extends PresentationalComp {
  render() {
    let eventGroupIdList = this.props.data.eventGroupIdList
    let eventGroupListView = []
    eventGroupIdList.forEach(eventGroupId => {
      let eventGroupView = <EventGroup key={eventGroupId} 
        id={eventGroupId} data={this.props.data} ui={this.props.ui} text={this.props.text} />
      eventGroupListView.push(eventGroupView)
    })
    return (
      <div className='ui cards'>
        {eventGroupListView}
      </div>
    )
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
        {this._getAttachedButtonView.call(this, eventGroup.status)}
      </div>
    )
  }
  _getAttachedButtonView (status) {
    switch(status) {
    case c.EVENTGROUP_STATUS.READY:
      return (
        <div className='ui bottom attached small button'>
          <i className='money icon'></i> {this.props.text['Process']}
        </div>)
    case c.EVENTGROUP_STATUS.PROCESSING:
      return (
        <div className='ui bottom attached small two buttons'>
          <div className='ui button'><i className='undo icon'></i> {this.props.text['Undo']}</div>
          <div className='or'></div>
          <div className='ui positive button'><i className='shipping icon'></i> {this.props.text['Done']}</div>
        </div> )
    case c.EVENTGROUP_STATUS.DONE:
      return (
        <div className='ui bottom attached small two buttons'>
          <div className='ui button'><i className='undo icon'></i> {this.props.text['Undo']}</div>
          <div className='or'></div>
          <div className='ui positive button'><i className='archive icon'></i> {this.props.text['Archive']}</div>
        </div> )
    case c.EVENTGROUP_STATUS.ARCHIVED:
      return (
        <div className='ui bottom attached small button'>
          <i className='undo icon'></i> {this.props.text['Undo']}
        </div> )
    }
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

// class HistorySegment extends Component {
//   render () {
//     let toggleArchived = ''
//     if (this.props.type === c.EVENT_TYPE.DONE) {
//       if (this.props.isArchivedVisible) {
//         toggleArchived = <div className='sub header'>
//           <a href='#' onClick={() => this._toggleArchived(false)}>{this.props.text['Hide archived']}</a>
//         </div>
//       } else {
//         toggleArchived = <div className='sub header'>
//           <a href='#' onClick={() => this._toggleArchived(true)}>{this.props.text['Show archived']}</a>
//         </div>
//       }
//     }
//     return (
//       <div className='column'>
//         <div className='ui medium center aligned header'>
//           {this.props.text[this._getSegmentHeader(this.props.type)]}
//           {toggleArchived}
//         </div>
//         <div className='ui middle aligned divided list'>
//           {this._getEventListView(this.props.eventList, this.props.type)}
//         </div>
//         {this.props.isArchivedVisible ? this._getArchivedHeader(this.props.text['Archived']) : ''}
//         <div className='ui middle aligned divided list'>
//           {this.props.isArchivedVisible ? this._getEventListView(this.props.eventList, c.EVENT_TYPE.ARCHIVED) : ''}
//         </div>
//       </div>
//     )
//   }
//   _getEventListView (eventList, type) {
//     return eventList.map((event, index) => {
//       if (type === event.status) {
//         return <Event key={event.id}
//           productName={event.productName}
//           amount={event.amount}
//           date={new Date(event.date)}
//           index={index}
//           type={type}
//           text={this.props.text}/>
//       } else {
//         return
//       }
//     })
//   }
//   _getSegmentHeader (type) {
//     switch (type) {
//     case c.EVENT_TYPE.READY: 
//       return 'Ready'
//     case c.EVENT_TYPE.PROCESSING:
//       return 'Processing'
//     case c.EVENT_TYPE.DONE:
//       return 'Done'
//     }
//   }
//   _getArchivedHeader (archivedText) {
//     return (
//       <h5 className='ui dividing disabled header'>
//         {archivedText}
//       </h5>
//     )
//   }
//   _toggleArchived (isArchivedVisible) {
//     dispatcher.dispatch(eventActions.TOGGLE_ARCHIVED, isArchivedVisible)
//   }
// }
// HistorySegment.propTypes = {
//   type: PropTypes.string.isRequired,
//   eventList: PropTypes.array.isRequired,
//   isArchivedVisible: PropTypes.bool,
//   text: PropTypes.object.isRequired
// }

// class Event extends Component {
//   render () {
//     let icon, amount
//     if (this.props.amount < 0) {
//       icon = <i className='shipping icon'></i>
//       amount = this.props.amount * -1
//     } else {
//       icon = <i className='cube icon'></i>
//       amount = this.props.amount
//     }

//     let leftButton, rightButton
//     switch (this.props.type) {
//     case c.EVENT_TYPE.READY:
//       leftButton = this._getIconButton('', 'remove', () => this._delete(this.props.index, this.props.text))
//       rightButton = this._getIconButton('primary', 'checkmark', () => this._approve(this.props.index))
//       break
//     case c.EVENT_TYPE.PROCESSING:
//       leftButton = this._getIconButton('', 'arrow circle left', () => this._disapprove(this.props.index))
//       rightButton = this._getIconButton('primary', 'checkmark', () => this._approve(this.props.index))
//       break
//     case c.EVENT_TYPE.DONE:
//       leftButton = this._getIconButton('', 'arrow circle left', () => this._disapprove(this.props.index))
//       rightButton = this._getIconButton('', 'archive', () => this._approve(this.props.index))
//       break
//     case c.EVENT_TYPE.ARCHIVED:
//       leftButton = this._getIconButton('', 'undo', () => this._disapprove(this.props.index))
//       break
//     }

//     return (
//       <div className='item'>
//         <div className='right floated content'>
//           <div className='ui buttons'>
//             {leftButton}
//             {rightButton}
//           </div>
//         </div>
//         <div className='content'>
//           <div className='header'>
//             {icon} {this.props.productName}: {util.getCurrencyValue(amount)}
//           </div>
//           <div className='description'>
//             {util.getDateString(new Date(this.props.date))}
//           </div>
//         </div>
//       </div>
//     )
//   }
//   _delete (index, text) {
//     dispatcher.dispatch(eventActions.DELETE_EVENT, {eventIndex: index, text: text})
//   }
//   _approve (index) {
//     dispatcher.dispatch(eventActions.APPROVE_EVENT, index)
//   }
//   _disapprove (index) {
//     dispatcher.dispatch(eventActions.DISAPPROVE_EVENT, index)
//   }
//   _getIconButton (color, icon, onClickFunction) {
//     return (
//       <button className={'ui ' + color + ' icon button'} onClick={onClickFunction}>
//         <i className={icon + ' icon'}></i>
//       </button>)
//   }
// }
// Event.propTypes = {
//   productName: PropTypes.string.isRequired,
//   amount: PropTypes.number.isRequired,
//   date: PropTypes.object.isRequired,
//   index: PropTypes.number.isRequired,
//   type: PropTypes.string.isRequired,
//   text: PropTypes.object.isRequired
// }

// class SearchBar extends PresentationalComp {
//   render () {
//     return (
//       <div className='ui one column center aligned grid'>
//         <div className='column'>
//           <div className='ui search' id='eventSearch'>
//             <div className='ui icon input'>
//               <input className='prompt' type='text' onChange={this._search}/>
//               <i className='search icon'></i>
//             </div>
//             <div className='results'></div>
//           </div>
//         </div>
//       </div>
//     )
//   }
//   _search(e) {
//     dispatcher.dispatch(eventActions.SEARCH_PRODUCTNAME, e.target.value)
//   }
// }