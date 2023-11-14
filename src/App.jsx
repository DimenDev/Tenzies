import { useState, useEffect } from 'react'
import './App.css'
import Dice from "./Components/Dice"
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

function App() {

const [dice, setDice] = useState(allNewDice())
const [tenzies, setTenzies] = useState(false)
const [rolls, setRolls] = useState(0)
const [time, setTime] = useState(0)
const [isRunning, SetIsRunning] = useState(true)
const [bestTime, setBestTime] = useState(JSON.parse(localStorage.getItem("recordTime")))

console.log(bestTime)

useEffect(() => {
  let intervalId

  if (isRunning) {
    intervalId = setInterval(() => setTime(time + 1), 1000)
  }

  return () => clearInterval(intervalId)

}, [isRunning, time])

const hours = Math.floor(time / 3600)
const minutes = Math.floor((time % 3600) / 60)
const seconds = Math.floor(time % 60)
const bestHour = Math.floor(bestTime / 3600)
const bestMinute = Math.floor((bestTime % 3600) / 60)
const bestSecond = Math.floor(bestTime % 60)

useEffect(() => {

  if (tenzies) {
    SetIsRunning(false)

    if(time < bestTime || bestTime === null) {
    localStorage.setItem("recordTime", JSON.stringify(time))
    setBestTime(time)
    }
    
  }
}, [tenzies])





useEffect(() => {
    const isWon = dice.every(die => die.isHeld && die.value === dice[0].value)
    if (isWon) {
      setTenzies(true)
    }
}, [dice])


function generateNewDie() {
  return {
    value: Math.floor(Math.random() * 6) + 1,
    isHeld: false,
    id: nanoid()
  }
}  

function allNewDice() {
  const newArr = []
  for (let i = 0; i < 10; i++) {
    newArr.push(generateNewDie());
  }

  return newArr
}



function holdDice(id) {
  setDice(prevDice => {
    return prevDice.map(die => {
      return die.id === id ? {...die, isHeld: !die.isHeld} : die
    })
  })
}

 
const allDiceElements = dice.map(die => {
  return <Dice key={die.id} value={die.value} isHeld={die.isHeld} handleHold={() => holdDice(die.id)}></Dice>
})

function rollDice() {

  setRolls(prevRoll => prevRoll + 1)
  

  if (tenzies) {
    setDice(allNewDice())
    setTenzies(false)
    setRolls(0)
    SetIsRunning(true)
    setTime(0)
  }

  else {
    SetIsRunning(true)
    setDice(prevDice => prevDice.map(die => {
      return die.isHeld ? die : generateNewDie()
    }))
  }
}

  return (
   <main>
    {tenzies && <Confetti></Confetti>}
    <div className='gameInfo'>
    <h1 className="title">Tenzies</h1>
    <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
    </div>
      <div className="dices">
        {allDiceElements}
      </div>
      <button onClick={rollDice} className='dice__btn'>{tenzies ? "New Game" : "Roll"}</button>
    <div className="stats">
      <h2>Number of Rolls: {rolls}</h2>
      <p className="stopwatch-time">
        Time: {hours}:{minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </p>
      <p className="stopwatch-time">
        Record: {bestHour}:{bestMinute.toString().padStart(2, "0")}:
        {bestSecond.toString().padStart(2, "0")}
      </p>

    </div>
   </main>
  )
}

export default App
