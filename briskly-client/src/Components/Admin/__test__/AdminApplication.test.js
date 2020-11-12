import React from 'react'
import ReactDOM from 'react-dom'
import PaymentSetup from "../PaymentSetup.js"
import Prices from "../Prices.js"
import SendNotification from "../SendNotification.js"
import RegistrationRequestsSearch from "../RegistrationRequestsSearch.js"
import RegistrationRequests from "../RegistrationRequests.js"
import NurseryApplication from "../NurseryApplication.js"
import "../../../setupTests"
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import renderer from "react-test-renderer"

import { shallow, mount } from 'enzyme';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import axios from 'axios'

import AuthenticationService from "../../../AuthenticationService"

afterEach(cleanup)

jest.mock('axios');


it("Testing the nursery application page to accept a nursery to the system", async () => {
    const mockCallBack = jest.fn();
   
    //setting up the Authentication Service so that it does not fail when the
    //component renders.
    AuthenticationService.registerSuccessfulLoginForJwt("1","admin","123")

    //rendering the component
    const component = shallow(<NurseryApplication/>);

    //calling the mocked backend to add the results to the frontend component.
    const result = await axios.post("http://localhost:9000/singleNurseryAdmin")
    
    component.setState({data:result["data"], status: 0})
    component.update()
    //setting the event
    const event = {
        target: { value: 'approveNursery' }
      };
    //getting the button to test clicking it
    var clicked = false
    const btn = component.find('#approveNursery')
    if(btn.text() === "Approve"){
        btn.simulate('click', event);
        clicked = true
    }
    //ensuring that the button was clicked and the nursery approved
    expect(clicked).toBe(true)
    
})

it("Testing the nursery application page to reject a nursery to the system", async () => {
    const mockCallBack = jest.fn();
   
    //setting up the Authentication Service so that it does not fail when the
    //component renders.
    AuthenticationService.registerSuccessfulLoginForJwt("1","admin","123")

    //rendering the component
    const component = shallow(<NurseryApplication/>);

    //calling the mocked backend to add the results to the frontend component.
    const result = await axios.post("http://localhost:9000/singleNurseryAdmin")
    
    component.setState({data:result["data"], status: 0})
    component.update()
    //setting the event
    const event = {
        target: { value: 'declineNursery' }
      };
    //getting the button to test clicking it
    var clicked = false
    const btn = component.find('#declineNursery')
    if(btn.text() === "Decline"){
        btn.simulate('click', event);
        clicked = true
    }
    //ensuring that the button was clicked and the nursery approved
    expect(clicked).toBe(true)
    
})

it("Testing the nursery application to reject a nursery to the system when the status of the nursery does not show the approve button (status = 1)", async () => {
    const mockCallBack = jest.fn();
   
    //setting up the Authentication Service so that it does not fail when the
    //component renders.
    AuthenticationService.registerSuccessfulLoginForJwt("1","admin","123")

    //rendering the component
    const component = shallow(<NurseryApplication/>);

    //calling the mocked backend to add the results to the frontend component.
    const result = await axios.post("http://localhost:9000/singleNurseryAdmin")
    
    component.setState({data:result["data"], status: 1})
    component.update()
    //setting the event
    const event = {
        target: { value: 'declineNursery' }
      };
    //getting the button to test clicking it
    var clicked = false
    const btn = component.find('#declineNursery')
    if(btn.text() === "Stop"){
        btn.simulate('click', event);
        clicked = true
    }
    //ensuring that the button was clicked and the nursery approved
    expect(clicked).toBe(true)
    
})
it("Testing the nursery application to accept a nursery to the system when the status = 3 which does not show the decline button", async () => {
    const mockCallBack = jest.fn();
   
    //setting up the Authentication Service so that it does not fail when the
    //component renders.
    AuthenticationService.registerSuccessfulLoginForJwt("1","admin","123")

    //rendering the component
    const component = shallow(<NurseryApplication/>);

    //calling the mocked backend to add the results to the frontend component.
    const result = await axios.post("http://localhost:9000/singleNurseryAdmin")
    
    component.setState({data:result["data"], status: 3})
    component.update()
    //setting the event
    const event = {
        target: { value: 'approveNursery' }
      };
    //getting the button to test clicking it
    var clicked = false
    const btn = component.find('#approveNursery')
    if(btn.text() === "Approve"){
        btn.simulate('click', event);
        clicked = true
    }
    //ensuring that the button was clicked and the nursery approved
    expect(clicked).toBe(true)
    
})