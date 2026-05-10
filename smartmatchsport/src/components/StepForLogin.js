import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import useMeasure from "./useMeasure";
import '../styles_module/register.css';

const StepForLogin = ({ step, totalSteps }) => {
  const [stepOne, setStepOne] = useState(false);
 
  const [stepWidth, setStepWidth] = useState(0);
  const [currentWidth, setCurrentWidth] = useState(0);
  const [bind, { width }] = useMeasure();
  const [props, set] = useSpring(() => ({ width }));
  const step1Props = useSpring({ opacity: stepOne ? 1 : 0 });


  useEffect(() => {
    setStepWidth(width / (totalSteps - 1));
  }, [width, totalSteps]);

  useEffect(() => {
    set({ width: currentWidth });
  }, [currentWidth, set]);

  useEffect(() => {
    if (step > 0) {
      setCurrentWidth(c => c + stepWidth);
    }
    switch (step) {
      case 0:
        setStepOne(true);
        break;
    

      default:
        break;
    }
  }, [step, stepWidth]);

  return (
    <div className="stepsWrapper">
      <div className="steps">
        <div>
          Step 1 <animated.span style={step1Props} />
        </div>
      </div>
      <div {...bind} className="stepLine">
        <animated.div className="stepFill" style={props} />
      </div>
    </div>
  );
};

export default StepForLogin;
