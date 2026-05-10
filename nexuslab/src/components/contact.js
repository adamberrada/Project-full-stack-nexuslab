
import React from "react";
import '../styles_module/contact.css';

import logo from '../image/logo.png' // or correct relative path
import { Link } from "react-router-dom";


export function Contact() {

return (
    <div className="contact">
    <img className="logoForm-contact" src={logo} alt="Logo" />

    <div className="inner-form">
        <form className="form-contact">
        <h2 className="h2-contact">Contact Us</h2>
            <div className="form-style-contact">
                        <label for="name">Full Name:
                          <input id="name" name="name" type="text" placeholder="Enter your Full Name" className="description input-contact" required/>
                        </label>
            </div>
            <div className="form-style-contact">
                        <label for="email">
                            Email:
                            <input id="email" name="email" type="email" className="description input-contact" required placeholder="Enter your Email"/>
                        </label>
            </div>
            <div className="form-style-contact">
                        <label for="age">
                            Age:
<span>(optional)</span>
                            <input id="age" name="age" type="number" placeholder="Age" min="10" max="99" required className="description input-contact"/>
                      </label>
            </div>    
            <div className="form-style-contact">
                        <label  for="password">
                            Enter your Password:
                            <input id="password" className="description input-contact" name="password" type="password" required placeholder="Enter your Password" pattern="\w{1,14}"/>
                        </label>
            </div>
            <div className="form-style-contact">
                        <p>Which option best describes your current role?</p>
                        <select name="role" id="role" className="description">
                            <option value="">Select current role</option>
                            <option value="1">student</option>
                            <option value="2">Full Time Job</option>
                            <option value="3">full Time Learner</option>
                            <option value="4">Prefer not to say</option>
                            <option value="5">Other</option>
                        </select>
            </div>
            <div className="form-style-contact">
                        <p>What would you like to see improved?(check all that apply)</p>
                            <input id="improvements" name="improvements" rows="20" cols="103" className="textera-input-contact" placeholder="Enter your suggestions" ></input>
            </div>

            <button  className="button-contact">
                  <Link className="linkForm" to="/App">Submit</Link>
                </button>
        </form>     
        </div>
        <div className="clip-contact"></div>        
    </div>
  );

}