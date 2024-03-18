import React, { Fragment, useEffect, useState } from 'react'

import MetaData from '../layout/MetaData'
import CheckoutSteps from './CheckoutSteps'

import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { createOrder, clearErrors } from '../../actions/orderActions'

import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js'

import axios from 'axios'
// import { checkout } from '../../../../backend/routes/auth'

const options = {
  style: {
    base: {
      fontSize: '16px',
    },
    invalid: {
      color: '#9e2146',
    },
  },
}

const Payment = ({ history }) => {
  const [selectOption, setSelectOption] = useState('online')
  const alert = useAlert()
  const stripe = useStripe()
  const elements = useElements()
  const dispatch = useDispatch()

  const { user } = useSelector(state => state.auth)
  const { cartItems, shippingInfo } = useSelector(state => state.cart)
  const { error } = useSelector(state => state.newOrder)

  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }
  }, [dispatch, alert, error])

  // cart, ship info
  const order = {
    orderItems: cartItems,
    shippingInfo,
  }

  const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'))
  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice
    order.shippingPrice = orderInfo.shippingPrice
    order.taxPrice = orderInfo.taxPrice
    order.totalPrice = orderInfo.totalPrice
  }

  const paymentData = {
    amount: Math.round(orderInfo.totalPrice * 100), // total price
  }

  const submitHandler = async e => {
    e.preventDefault()
    document.querySelector('#pay_btn').disabled = true // tìm kiếm các phần tử dựa trên id

    let res
    try {
      const config = {
        // config header type
        headers: {
          'Content-Type': 'application/json',
        },
      }

      res = await axios.post('/api/v1/payment/process', paymentData, config) // call api paymant process

      const clientSecret = res.data.client_secret // client_secret json client

      console.log(clientSecret)

      if (!stripe || !elements) {
        // data input payment stripe
        return
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        // Xác thực card info
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            // chi tiết thanh toán
            name: user.name,
            email: user.email,
          },
        },
      })

      if (result.error) {
        alert.error(result.error.message) // return alert error
        document.querySelector('#pay_btn').disabled = false // disabled btn
      } else {
        // Thanh toán có được xử lý hay không?
        if (result.paymentIntent.status === 'succeeded') {
          // if success

          order.paymentInfo = {
            // payment with info cart, shipInfo
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          }

          dispatch(createOrder(order)) // call createOrder action

          history.push('/success') // return page success
        } else {
          alert.error('Có một số vấn đề trong khi xử lý thanh toán')
        }
      }
    } catch (error) {
      // error server
      document.querySelector('#pay_btn').disabled = false
      alert.error(error.response.data.message)
    }
  }

  const submitHandlerCOD = async e => {
    e.preventDefault()
    order.paymentInfo = {
      status: 'Đã đặt hàng',
    }
    dispatch(createOrder(order))
    history.push('/success')
  }
  const onOptionChange = e => {
    setSelectOption(e.target.value)
  }
  return (
    <Fragment>
      <MetaData title={'Thông tin thẻ'} />

      <CheckoutSteps shipping confirmOrder payment />

      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="selection-payment"
              id="online"
              checked={selectOption === 'online'}
              value="online"
              onChange={onOptionChange}
            />
            <label className="form-check-label" htmlFor="online">
              Thanh toán online
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="selection-payment"
              id="cod"
              checked={selectOption === 'cod'}
              value="cod"
              onChange={onOptionChange}
            />
            <label className="form-check-label" htmlFor="cod">
              Thanh toán trực tiếp
            </label>
          </div>

          {selectOption === 'online' ? (
            <form className="shadow-lg" onSubmit={submitHandler}>
              <h1 className="mb-4">Thông tin thẻ</h1>
              <div className="form-group">
                <label htmlFor="card_num_field">Số thẻ</label>
                <CardNumberElement
                  type="text"
                  id="card_num_field"
                  className="form-control"
                  options={options}
                />
              </div>

              <div className="form-group">
                <label htmlFor="card_exp_field">Hạn thẻ</label>
                <CardExpiryElement
                  type="text"
                  id="card_exp_field"
                  className="form-control"
                  options={options}
                />
              </div>

              <div className="form-group">
                <label htmlFor="card_cvc_field">Số CVC</label>
                <CardCvcElement
                  type="text"
                  id="card_cvc_field"
                  className="form-control"
                  options={options}
                />
              </div>

              <button id="pay_btn" type="submit" className="btn btn-block py-3">
                Thanh toán{' '}
                {` - ${(orderInfo && orderInfo.totalPrice).toLocaleString()}`}đ
              </button>
            </form>
          ) : (
            <form className="shadow-lg" onSubmit={submitHandlerCOD}>
              <button id="pay_btn" type="submit" className="btn btn-block py-3">
                Thanh toán ngay{' '}
                {` - ${(orderInfo && orderInfo.totalPrice).toLocaleString()}`}đ
              </button>
            </form>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default Payment
