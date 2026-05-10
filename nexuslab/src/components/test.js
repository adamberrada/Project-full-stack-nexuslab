
import { useState, useEffect, } from "react";

export function Test()  {


const [textInput, setIsInput] = useState(false);
const handleInputStyle = () => {
// const text = textInput.includes("important");
console.log()
}

useEffect(() => {
setIsInput();
})
    return (
        <div>
            <input id="test" type="test" /> 
            {textInput ? <p onChange={handleInputStyle} style={{color: "red"}}></p> : ""}
            
        </div>
    )
}