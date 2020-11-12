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

it("Testing the Prices page which shows the current payment setups", async () => {

    //setting up the Authentication Service so that it does not fail when the
    //component renders.
    AuthenticationService.registerSuccessfulLoginForJwt("1","admin","123")

    //mocking the request to get the current prices.
    const result = await axios.post("http://localhost:9000/prices")
    //rendering the component
    const component = shallow(<Prices/>);
    //setting the component state with the data received from the FAKE backend
    component.setState(result["data"])

    //updating the component after getting the prices
    component.update()
    //getting all of the components with the .div2 class (they are the ones that hold the actual data)
    const wrapper = component.first(".div2")
    
    //Testing to see if the prices retreived actually appear or not with the correct date as well.
    expect(wrapper.text().includes("$200")).toBe(true)
    expect(wrapper.text().includes("$150")).toBe(true)
    expect(wrapper.text().includes("$80")).toBe(true)
    expect(wrapper.text().includes("16-9-2020")).toBe(true)
    expect(wrapper.text().includes("16-9-2022")).toBe(true)
    
})


it("Testing to see if the prices have been updated or not when the admin updates them", async () => {

    //setting up the Authentication Service so that it does not fail when the
    //component renders.
    AuthenticationService.registerSuccessfulLoginForJwt("1","admin","123")

    //rendering the component
    const component = shallow(<PaymentSetup/>);
    //getting and setting the input fields
    const activationDate = component.find("#activationDate")
    const deactivationDate = component.find("#deactivationDate")
    const userFees = component.find("#userFees")
    const nurseryFees = component.find("#nurseryFees")
    const accountFees = component.find("#accountFees")
    activationDate.value = "20-12-1998"
    deactivationDate.value = "20-12-2025"
    userFees.value = "25"
    nurseryFees.value = "80"
    accountFees.value = "150"
    
    //updating the component
    component.update()

     //after clicking the button
    component.find("#newFeesSaveBtn").simulate("click");
    //updates successfully after clicking the button with no issues
    expect(component.state()["failed"]).toBe(false)

})

it("Testing the results received from the backend for the nurseries.", async ()=> {
    //setting up the Authentication Service so that it does not fail when the
    //component renders.
    AuthenticationService.registerSuccessfulLoginForJwt("1","admin","123")

    //rendering the component
    const component = shallow(<RegistrationRequests/>);

    const result = await axios.post("http://localhost:9000/getAdminNurseries")
    // console.log(result["data"])
    component.setState({data:result["data"]})
    component.update()
    //contains all of the received data divs that ARE DISPLAYED TO THE USER
    const wrapper = component.first(".resultsDiv").text()

    //checking to see if it contains the data recieved from the backend (The actual test)

    for(var i = 0; i<result["data"].length; i++){
        //checking to see if all the data received from the mocked backend
        //are all displayed to the user.
        expect(wrapper.includes(result["data"][i]["nurseryName"])).toBe(true)
        expect(wrapper.includes(result["data"][i]["CommercialRegistrationNumber"])).toBe(true)
        expect(wrapper.includes(result["data"][i]["city"])).toBe(true)
        expect(wrapper.includes(result["data"][i]["status"])).toBe(true)

    }

})

it("Testing the results received from the backend for the nurseries. This time we will check for non-existing data", async ()=> {
    //setting up the Authentication Service so that it does not fail when the
    //component renders.
    AuthenticationService.registerSuccessfulLoginForJwt("1","admin","123")

    //rendering the component
    const component = shallow(<RegistrationRequests/>);

    const result = await axios.post("http://localhost:9000/getAdminNurseries")
    // console.log(result["data"])
    component.setState({data:result["data"]})
    component.update()
    //contains all of the received data divs that ARE DISPLAYED TO THE USER
    const wrapper = component.first(".resultsDiv").text()

    //checking to see if it contains the data recieved from the backend (The actual test)

    //checking to see if all the data received from the mocked backend
    //testing to see if it passes when non-existing data is passed to it
    expect(wrapper.includes("some nursery")).toBe(false)
    expect(wrapper.includes("123456789")).toBe(false)
    expect(wrapper.includes("Sydney")).toBe(false)
    expect(wrapper.includes("No Status")).toBe(false)


})


it("Testing the results received from the backend for the nurseries. This time we will check for non-existing data", async ()=> {
    //setting up the Authentication Service so that it does not fail when the
    //component renders.
    AuthenticationService.registerSuccessfulLoginForJwt("1","admin","123")

    //rendering the component
    const component = shallow(<RegistrationRequests/>);

    const result = await axios.post("http://localhost:9000/getAdminNurseries")
    // console.log(result["data"])
    component.setState({data:result["data"]})
    component.update()
    //contains all of the received data divs that ARE DISPLAYED TO THE USER
    const wrapper = component.first(".resultsDiv").text()

    //checking to see if it contains the data recieved from the backend (The actual test)

    //checking to see if all the data received from the mocked backend
    //testing to see if it passes when non-existing data is passed to it
    expect(wrapper.includes("some nursery123")).toBe(false)
    expect(wrapper.includes("123452312--236789")).toBe(false)
    expect(wrapper.includes("Hobart")).toBe(false)
    expect(wrapper.includes("Stopped")).toBe(false)


})

it("Testing the nursery application to see if it renders or not", async () => {

    shallow(<NurseryApplication/>);

})
