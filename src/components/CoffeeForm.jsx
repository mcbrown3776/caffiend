import { useState } from 'react'
import Authentication from './Authentication'
import { coffeeOptions } from '../utils'
import Modal from './Modal'
import { useAuth } from '../context/AuthContext'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const CoffeeForm = (props) => {
  const { isAuthenticated } = props

  const [showModal, setShowModal] = useState(false)
  const [selectedCoffee, setSelectedCoffee] = useState(null)
  const [showCoffeeTypes, setShowCoffeeTypes] = useState(false)
  const [coffeeCost, setCoffeeCost] = useState(0)
  const [hour, setHour] = useState(0)
  const [minute, setMinute] = useState(0)

  const { globalData, setGlobalData, globalUser } = useAuth()

  const handleSubmitForm = async () => {
    if (!isAuthenticated) {
      setShowModal(true)
      return
    }

    // only submit form if it is completed
    if (!selectedCoffee) return

    try {
      // create new data object
      const newGlobalData = {
        ...(globalData || {}),
      }

      const nowTime = Date.now()
      const timeToSubtract = hour * 60 * 60 * 1000 + minute * 60 * 1000
      const timestamp = nowTime - timeToSubtract

      const newData = {
        name: selectedCoffee,
        cost: coffeeCost,
      }
      newGlobalData[timestamp] = newData
      console.log(timestamp, selectedCoffee, coffeeCost)

      // update the global state
      setGlobalData(newGlobalData)

      // persist the data in the firebase firestore
      const userRef = doc(db, 'users', globalUser.uid)
      const res = await setDoc(
        userRef,
        {
          [timestamp]: newData,
        },
        { merge: true }
      )

      setSelectedCoffee(null)
      setHour(0)
      setMinute(0)
      setCoffeeCost(0)
    } catch (err) {
      console.error('Authentication error:', err)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>
      )}

      <div className='section-header'>
        <i className='fa-solid fa-pencil'></i>
        <h2>Start Tracking Today</h2>
      </div>
      <h4>Select coffee type</h4>
      <div className='coffee-grid'>
        {coffeeOptions.slice(0, 5).map((option, optionIndex) => {
          return (
            <button
              key={optionIndex}
              className={
                'button-card ' +
                (option.name === selectedCoffee
                  ? 'coffee-button-selected'
                  : ' ')
              }
              onClick={() => {
                setSelectedCoffee(option.name)
                setShowCoffeeTypes(false)
              }}
            >
              <h4>{option.name}</h4>
              <p>{option.caffeine} mg</p>
            </button>
          )
        })}

        <button
          className={
            'button-card ' + (showCoffeeTypes ? 'coffee-button-selected' : ' ')
          }
          onClick={() => {
            setShowCoffeeTypes(true)
            setSelectedCoffee(null)
          }}
        >
          <h4>Other</h4>
          <p>n/a</p>
        </button>
      </div>
      {showCoffeeTypes && (
        <select
          name='coffee-list'
          id='coffee-list'
          onChange={(e) => {
            setSelectedCoffee(e.target.value)
          }}
        >
          <option value='null'>Select type</option>
          {coffeeOptions.map((option, optionIndex) => {
            return (
              <option key={optionIndex} value={option.name}>
                {option.name} ({option.caffeine}mg)
              </option>
            )
          })}
        </select>
      )}
      <h4>Add the cost ($)</h4>
      <input
        type='number'
        value={coffeeCost}
        className='w-full'
        placeholder='4.50'
        onChange={(e) => {
          setCoffeeCost(e.target.value)
        }}
      />
      <h4>Time since consumption</h4>
      <div className='time-entry'>
        <div>
          <h6>Hours</h6>
          <select
            name='hours-select'
            id='hours-select'
            onChange={(e) => {
              setHour(e.target.value)
            }}
          >
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ].map((hour, hourIndex) => {
              return (
                <option key={hourIndex} value={hour}>
                  {hour}
                </option>
              )
            })}
          </select>
        </div>

        <div>
          <h6>Minutes</h6>
          <select
            name='mins-select'
            id='mins-select'
            onChange={(e) => {
              setMinute(e.target.value)
            }}
          >
            {[0, 5, 10, 15, 30, 45].map((min, minIndex) => {
              return (
                <option key={minIndex} value={min}>
                  {min}
                </option>
              )
            })}
          </select>
        </div>
      </div>
      <button onClick={handleSubmitForm}>
        <p>Add Entry</p>
      </button>
    </>
  )
}

export default CoffeeForm
