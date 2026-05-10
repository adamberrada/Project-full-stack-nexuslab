import React, { useEffect, useState } from "react";
import { animated, useTrail } from "react-spring";
import useMeasure from "./useMeasure";
import '../styles_module/register.css';
import { useNavigate } from "react-router-dom";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  city: string;
  country: string;
  address: string;
};

interface FormOneProps {
  onClick: () => void;
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
}

const FormOne = ({ onClick, step, formData, setFormData }: FormOneProps) => {
  const [bind, bounds] = useMeasure() as unknown as [
    { ref: React.RefObject<HTMLFormElement> },
    { left: number; top: number; width: number; height: number }
  ];
  const { height } = bounds;
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  

  // Fields configuration for each step
  const stepFields: Record<number, Array<{ id: keyof FormData; label: string; type: string }>> = {
    0: [
      { id: 'firstName', label: 'First Name*', type: 'text' },
      { id: 'lastName', label: 'Last Name*', type: 'text' },
    ],
    1: [
      { id: 'phone', label: 'Phone*', type: 'tel' },
      { id: 'city', label: 'City*', type: 'text' },
    ],
    2: [
      { id: 'country', label: 'Country*', type: 'text' },
      { id: 'address', label: 'Address*', type: 'text' },
    ],
    3: [
      { id: 'email', label: 'Email*', type: 'email' },
      { id: 'password', label: 'Password*', type: 'password' },
    ],
  };
  // Get current step fields
  const currentFields = stepFields[step] || [];

  // Animation configuration
  const config = { mass: 5, tension: 2000, friction: 200 };
  const trail = useTrail(currentFields.length, {
    config,
    x: 0,
    from: { x: 100 }
  });

  useEffect(() => {
    const formElement = document.querySelector(".form-x") as HTMLElement | null;
    if (formElement) {
      formElement.style.transition = "all 0.5s ease-in-out";
      formElement.style.minHeight = `${height}px`;
    }
  }, [height]);

 const handleChange = (event: React.ChangeEvent<HTMLInputElement>, fieldId?: keyof FormData) => {
    const id = fieldId || (event.target.name as keyof FormData);
    setFormData(prev => ({
      ...prev,
      [id]: event.target.value,
    }));
  };

     const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            setMessage("");
    
            const response = await fetch("/api/auth/register", {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                },
                body: JSON.stringify(formData),
            });
            if(!response.ok) {
                const errorData = await response.json();
                setMessage(errorData.message || "Registration failed!");
                return;
            } 
            const data = await response.json().catch(() => null);
            if (data?.id) {
                localStorage.setItem('userId', String(data.id));
            }
            if (data?.email) {
                localStorage.setItem('userEmail', data.email);
            }
            if (data?.firstName) {
                localStorage.setItem('firstName', data.firstName);
            }
            if (data?.lastName) {
                localStorage.setItem('lastName', data.lastName);
            }
            window.dispatchEvent(new Event('auth:changed'));
            setMessage("Registration successful!");
            navigate('/profile');
        }

  const sayHello = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step === 4) {
      window.location.reload();
    }
    onClick();
  };

  return (
    <form className="form-x" onSubmit={handleSubmit} {...bind}>
      {trail.map(({ x, ...rest }, index) => {
        const field = currentFields[index];
        return (
          <animated.div
            key={field.id}
            className="trails-text"
            style={rest}
          >
            <label className="label">{field.label}</label>
            <input
              type={field.type}
              name={field.id}
              value={formData[field.id]}
              onChange={(e) => handleChange(e, field.id)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              required
            />
          </animated.div>
        );
      })}

      {step === 3 ? (
      <button  className="button" type="submit">
        Register
      </button>
    ) : (
      <button className="button" onClick={sayHello}>
        Next
      </button>
    )}
    <p>{message}</p>
        </form>
  );
};

export default FormOne;