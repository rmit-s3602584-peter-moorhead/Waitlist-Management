import React from 'react'
import ReactDOM from 'react-dom'
import ParentRegistration from '../ParentRegistration.js'
import NewGuardian from '../NewGuardian.js'
import "../../../setupTests"
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import renderer from "react-test-renderer"

import { shallow, mount } from 'enzyme';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import { wrap } from 'module'

afterEach(cleanup)


it("renders without crashing", () =>{
    //testing it the page actually renders or not
    const div = document.createElement("div");
    ReactDOM.render(<ParentRegistration></ParentRegistration>, div)
})


it("matches snapshot", () => {
    //creating a snapshot test
    const tree = renderer.create(<ParentRegistration></ParentRegistration>).toJSON()
    expect(tree).toMatchSnapshot()
})

it("testing to see if the second parent/guardian appears when the page is first loaded or not", () => {
    //this test tests to see if the form to add another guaridan appears or not
    const wrapper = mount(<ParentRegistration/>)
    const newGuardian = wrapper.find('#newGuardian')
    expect(newGuardian).toHaveLength(0)
})


it("testing the Add Another Guardian button", () => {
    //this test tests the ability to add another parent/guardian by clicking the button
    const wrapper = mount(<ParentRegistration/>)
    const btn = wrapper.find('#addGuardian')
    btn.simulate('click')
    const newGuardian = wrapper.find('#newGuardian')
    expect(newGuardian).toHaveLength(1)

})

it("testing the remove second parent/guardian button", () => {
    //this test tests to see if the remove second parent/guardian appears or not
    const wrapper = mount(<ParentRegistration/>)
    const btn = wrapper.find('#addGuardian')
    btn.simulate('click')
    wrapper.update()
    const btn2 = wrapper.find('#removeGuardian')
    
    expect(btn2.text()).toBe("Remove second parent/guardian")
    expect(wrapper.find('#addGuardian')).toHaveLength(0)

})
it("testing the remove second parent/guardian button if it removes the add guardian button or not", () => {
    //this test tests to see if the add guardian button is removed or not
    const wrapper = mount(<ParentRegistration/>)
    const btn = wrapper.find('#addGuardian')
    btn.simulate('click')
    wrapper.update()
    expect(wrapper.find('#addGuardian')).toHaveLength(0)

})
//expect(component.find('#item-id').prop('style')).toHaveProperty('backgroundSize', '100%');
//free
//premium
it("testing to see if the button with the account features is pressed or not", () => {
    //this tests the selected button 
    const wrapper = mount(<ParentRegistration/>)
    const btn = wrapper.find('#free')
    btn.simulate('click')
    wrapper.update()
    // console.log(wrapper.find('#free').prop('style'))
    expect(wrapper.find('#free').prop('style')).toStrictEqual({
                borderStyle: 'solid',
                borderColor: 'rgb(6,84,113)',
                borderRadius: '2%',
                width: '40%',
                marginRight: '2.5%',
                marginLeft: '7.5%',
                backgroundColor: 'rgb(26, 101, 126)',
                color: "white"
    })
})
it("testing to see if the button with the account features is pressed or not", () => {
    //this tests the other button..not the selected one
    const wrapper = mount(<ParentRegistration/>)
    const btn = wrapper.find('#free')
    btn.simulate('click')
    wrapper.update()
    // console.log(wrapper.find('#free').prop('style'))
    expect(wrapper.find('#premium').prop('style')).toStrictEqual({
                borderStyle: 'solid',
                borderColor: 'rgb(6,84,113)',
                borderRadius: '2%',
                width: '40%',
                marginRight: '7.5%',
                marginLeft: '2.5%',
                backgroundColor: 'white'
    })
})