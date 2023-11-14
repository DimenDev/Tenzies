import React from "react"
import "./Dice.css"

export default function Dice(props) {

    const Pip = () => <span className="pip" />;

    let pips = Number.isInteger(props.value) ? Array(props.value).fill(0).map((_, index) => <Pip key={index}></Pip>) : null

    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "#fff"
    }

    return (
    <div className="face" style={styles} onClick={props.handleHold}>
        {pips}
    </div>
    )
}

