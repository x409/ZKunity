import React, { useState, useEffect, useRef } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import { Form, Button } from 'react-bootstrap';

const Whitelist = ({ accounts }) => {
    const form = useRef()

    // const [networkMessage, setNetworkMessage] = useState();
    const [cursor, ] = useState("no-drop")
    const [disabled, setDisabled] = useState(true)
    const [btnText, setBtnText] = useState("COMING SOON")
    const [city, setCity]=useState("")
    const [country, setCountry]=useState("")
    const [countryCode, setCountryCode]=useState("")
    const [ipAddress, setIpAddress]=useState("")
    const [btnColor, setBtnColor]=useState("lightgrey")
    const [textColor, setTextColor]=useState("#000")

    const current = new Date()
 
    const url = process.env.REACT_APP_WHITELIST
    const geolocation_key = process.env.REACT_APP_KEY
    const recaptcha_key = process.env.REACT_APP_RECAPTCHA_KEY

    useEffect(() => {
      const getLocation = () => {
      fetch("https://geolocation-db.com/json/" + geolocation_key)
      .then( response => response.json() )
      .then( data => {
        setCity(data.city)
        setCountry(data.country_name)
        setCountryCode(data.country_code)
        setIpAddress(data.IPv4)
      })
     }
      getLocation()
    }, [geolocation_key])

    function onChange(value) {
      setDisabled(false)
      console.log("Captcha value:", value);
      if (value === null) {
        setDisabled(true)
      }
      }

    const joinWhitelist = (e) => {
      e.preventDefault();
      // window.grecaptcha.reset();
      setBtnText("Sending...")
      setDisabled(true)
      setBtnColor("lightgrey")
      setTextColor("#000")
      fetch(url, {
        header: 'Access-Control-Allow-Origin',
        method: "POST",
        body: new FormData(document.getElementById("join-whitelist"))
      })
        .then((response) => {
          setBtnText("Submission Sent");
          return response.json();
        })
        .then((data) => {
          console.log(data, "DATA")
        })
          .catch(error => {
            console.error(error.message, "ERROR.MESSAGE")
          }
      )
        form.current.reset();
      }

  return (
    <div className='whitelist'>
        <p className="message">Enter your information below to get on the whitelist</p>
        <Form method="POST" ref={form} id='join-whitelist' className="form" onSubmit={joinWhitelist}>
          <Form.Group className="fGroup">
          <Form.Control type="text" value={current} hidden name="TimeStamp" required readOnly />
          <Form.Control type="text" name='Name' placeholder="NAME >>> John Smith" required />
          <Form.Control type="email" name='Email' placeholder="EMAIL >>> johnsmith@gmail.com" required />
          <Form.Control type="text" name='Discord' placeholder="DISCORD >>> johnny#0357" required />
          <Form.Control type="text" name='Wallet_Address' className="account" value={`${accounts}`} required readOnly />
          <Form.Control type="text" value={city} hidden name="City" required readOnly />
          <Form.Control type="text" value={country} hidden name="Country" required readOnly />
          <Form.Control type="text" value={countryCode} hidden name="Country_Code" required readOnly />
          <Form.Control type="text" value={ipAddress} hidden name="IP_Address" required readOnly />
          </Form.Group>
          <Form.Group className="endForm">
          <ReCAPTCHA
            sitekey={`${recaptcha_key}`}
            onChange={onChange}
            className="recaptcha"
            />
          <Button
            className="submitBtn" 
            type='submit' 
            value='send'
            disabled={disabled} 
            style={{
              cursor: `${cursor}`, 
              backgroundColor: `${btnColor}`,
              color: `${textColor}`
              }}
              >
              {btnText}
          </Button>
          </Form.Group>
        </Form>
      </div>
    )
  }

export default Whitelist