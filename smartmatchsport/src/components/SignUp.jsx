import React, { useState, useCallback } from "react";
import { animated, useTransition } from "react-spring";
import FormOne from "./Forms";
import Steps from "./Steps";
import { LoginForm } from "./login/LoginForm";

import '../styles_module/register.css';
import Twitter from '../image/twitter.png';
import Facebook from "../image/facebook.png";
import Google from "../image/social.png";
// import {WaterDropGrid} from '../components/anime'


const pagesSignUp = [
  ({ style, onClick, step, formData, setFormData }) => (
    <animated.div style={{ ...style, background: "" }}>
      <p></p>
      <FormOne onClick={onClick} step={step} formData={formData} setFormData={setFormData} />
    </animated.div>
    
  ),
  ({ style, onClick, step, formData, setFormData }) => (
    <animated.div style={{ ...style, background: "" }}>
      <p></p>
      <FormOne onClick={onClick} step={step} formData={formData} setFormData={setFormData} />
    </animated.div>
  ),
  ({ style, onClick, step, formData, setFormData }) => (
    
    <animated.div style={{ ...style, background: "" }}>
      <p></p>
       <FormOne onClick={onClick} step={step} formData={formData} setFormData={setFormData} />
    </animated.div>
  ),
  ({ style, onClick, step, formData, setFormData }) => (
    <animated.div style={{ ...style, background: "" }}>
      <p></p>
       <FormOne onClick={onClick} step={step} formData={formData} setFormData={setFormData} />
    </animated.div>
  ),
];

export function SignUp() {
  const [index, set] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    city: "",
    country: "",
    address: "",
  });

  const onClick = useCallback(() => {
    console.log("called");

    set(state => (state !== pagesSignUp.length - 1 ? state + 1 : pagesSignUp.length - 1));
  }, []);

  const transitions = useTransition(index, {
    keys: index,
    from: {
      opacity: 1,
      transform: "translate3d(0%,0,0)",
    },
    enter: {
      opacity: 1,
      transform: "translate3d(0%,0,0)",
    },
    leave: { opacity: 0 },
  });

  return (
    <div>

    {/* register space form  */}

    {/* <img className="logoForm" src={logo} alt="Logo" /> */}
    <div className="clip"></div>
    <div className="form">
      <h2>SignUp</h2>
      <Steps step={index} totalSteps={pagesSignUp.length} />
      <div className="simple-trans-main">
        {transitions((style, item) => {
          const Page = pagesSignUp[item];
          return (
            <Page
              style={style}
              onClick={onClick}
              step={item}
              formData={formData}
              setFormData={setFormData}
            />
          );
        })}
      
      </div>
      <div className="form-footer">
        <div>
        <a href="https://myaccount.google.com/">
        <img src={Google} style={{width: '30px', height: '30px'}} alt='' ></img>
        </a>
      

        </div>
        <div>
        <a href="https://www.facebook.com/">
      <img src={Facebook} style={{width: '30px', height: '30px'}} alt='' ></img>
        </a>

        </div>
        <div>
        <a href="https://x.com/">
      <img src={Twitter} style={{width: '30px', height: '30px'}} alt='' ></img>
        </a>

        </div>
    </div>
    </div>   


    {/* login space form  */}
    <div className="formLogin">
      <h2>Login</h2>
      <LoginForm />
    </div>
   
    </div>

    
  );
}
