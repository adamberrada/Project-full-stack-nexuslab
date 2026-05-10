import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';


export function RgisterForm() {
    const navigate = useNavigate();
    const [form,setFrom] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        city: "",
        country: "",
        address: "",
    })

    const [message, setMessage] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFrom({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setMessage("");

        const response = await fetch("/api/auth/register", {
            method: 'POST',
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(form),
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


    return(
           <form onSubmit={handleSubmit}>
      <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} />
      <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} />
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
      <input name="city" placeholder="City" value={form.city} onChange={handleChange} />
      <input name="country" placeholder="Country" value={form.country} onChange={handleChange} />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      <button type="submit">Register</button>
      <p>{message}</p>
    </form>
    );
}