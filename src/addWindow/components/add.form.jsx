'use strict'

import React from 'react'

import dispatcher from '../../util/flux/dispatcher'
import * as actions from '../flux/actions'
import * as c from '../../util/const'
import * as util from '../../util/util'
import getText from '../../util/locale'

export default ({data}) => {
  let eventGroup = data.eventGroup
  return (
    <div className='ui form'>
      <div className='fields'>
        <TitleForm value={eventGroup.title} error={eventGroup.error.title} />
        <DateForm value={eventGroup.date} />
        <KindForm value={eventGroup.kind} />
      </div>
      <h4 className='ui dividing header'>{getText('Products')}</h4>
      <EventForm event={eventGroup.eventList[0]}
        idx={0}
        productSet={data.productSet}
        isInputForm />
      <div className='ui divider' />
      {eventGroup.eventList.map((event, idx) => {
        if (idx !== 0) {
          return <EventForm key={'event' + idx}
            event={event}
            idx={idx}
            productSet={data.productSet}
            isInputForm={false} />
        }
      })}
    </div>
  )
}

const TitleForm = ({value, error}) => {
  function _onChange (e) {
    dispatcher.dispatch(actions.CHANGE_EVENTGROUP_FIELD, {field: 'title', value: e.target.value})
  }

  return (
    <div className={'seven wide field' + (error ? ' error' : '')}>
      <label>{getText('Title')}</label>
      <input type='text' value={value} onChange={_onChange} />
    </div>
  )
}

const DateForm = ({value}) => {
  return (
    <div className='four wide field'>
      <label>{getText('Date')}</label>
      <div className='ui calendar' id='DateForm-datePicker'>
        <div className='ui input left icon'>
          <i className='calendar icon' />
          <input type='text' defaultValue={util.getDateString(new Date(value))} />
        </div>
      </div>
    </div>
  )
}

const KindForm = ({value}) => {
  function _onChange (e) {
    dispatcher.dispatch(actions.CHANGE_EVENTGROUP_FIELD, {field: 'kind', value: e.target.value})
  }

  return (
    <div className='five wide field'>
      <label>{getText('Kind')}</label>
      <select className='ui search dropdown' value={value} onChange={_onChange}>
        <option value={c.EVENTGROUP_KIND.SALE}>{getText('Sale')}</option>
        <option value={c.EVENTGROUP_KIND.PRODUCTION}>{getText('Production')}</option>
      </select>
    </div>
  )
}

const EventForm = ({event, idx, productSet, isInputForm}) => {
  function _onProductChange (e) {
    dispatcher.dispatch(actions.CHANGE_EVENT_FIELD, {idx: idx, field: 'productId', value: e.target.value})
  }

  function _onAmountChange (e) {
    dispatcher.dispatch(actions.CHANGE_EVENT_FIELD, {idx: idx, field: 'amount', value: e.target.value})
  }

  return (
    <div className='fields'>
      <div className={'ten wide field' + (event.error.productId ? ' error' : '')}>
        <label>{getText('Product')}</label>
        <select className='ui search dropdown' value={event.productId} onChange={_onProductChange}>
          {idx === 0
            ? <option value='' key={'-1'}>{getText('Select a product')}</option> : ''}
          {Object.keys(productSet).map(id => {
            let product = productSet[id]
            return <option value={product.id} key={product.id}>{product.name}</option>
          })}
        </select>
      </div>
      <div className={'five wide field' + (event.error.amount ? ' error' : '')}>
        <label>{getText('Amount')}</label>
        <input type='text' value={event.amount} onChange={_onAmountChange} />
      </div>
      {isInputForm
        ? (
          <button className='ui icon positive button'
            onClick={() => dispatcher.dispatch(actions.CHANGE_EVENTGROUP_FIELD, {'field': 'eventList'})}>
            <i className='plus icon' />
          </button>)
        : (
          <button className='ui icon negative button'
            onClick={() => dispatcher.dispatch(actions.REMOVE_EVENT, idx)}>
            <i className='minus icon' />
          </button>)}
    </div>
  )
}
