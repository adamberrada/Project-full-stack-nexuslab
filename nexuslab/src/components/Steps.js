import React, { useState, useEffect } from "react";
import { useSpring, animated } from "react-spring";
import useMeasure from "./useMeasure";
import '../styles_module/register.css';

const Steps = ({ step, totalSteps }) => {
  const [stepOne, setStepOne] = useState(false);
  const [stepTwo, setStepTwo] = useState(false);
  const [stepThree, setStepThree] = useState(false);
  const [stepFour, setStepFour] = useState(false);
  const [stepWidth, setStepWidth] = useState(0);
  const [currentWidth, setCurrentWidth] = useState(0);
  const [bind, { width }] = useMeasure();
  const [props, set] = useSpring(() => ({ width }));
  const step1Props = useSpring({ opacity: stepOne ? 1 : 0 });
  const step2Props = useSpring({ opacity: stepTwo ? 1 : 0 });
  const step3Props = useSpring({ opacity: stepThree ? 1 : 0 });
  const step4Props = useSpring({ opacity: stepFour ? 1 : 0 });

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
      case 1:
        setStepTwo(true);
        break;

      case 2:
        setStepThree(true);
        break;

      case 3:
        setStepFour(true);
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
        <div>
          Step 2 <animated.span style={step2Props} />
        </div>
        <div>
          Step 3 <animated.span style={step3Props} />
        </div>
        <div>
          Step 4 <animated.span style={step4Props} />
        </div>
      </div>
      <div {...bind} className="stepLine">
        <animated.div className="stepFill" style={props} />
      </div>
    </div>
  );
};

export default Steps;
