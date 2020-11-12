import React from 'react'
import ReactDOM from 'react-dom'
import NurseryRegistration from '../NurseryRegistration.js'
import AddProgram from '../AddProgram'
import "../../../setupTests"
import { render, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

import renderer from "react-test-renderer"

import { shallow, mount } from 'enzyme';
import ReactTestUtils, { act } from 'react-dom/test-utils';

afterEach(cleanup)


it("renders without crashing", () =>{
    //testing it the page actually renders or not
    const div = document.createElement("div");
    ReactDOM.render(<NurseryRegistration></NurseryRegistration>, div)
})


it("matches snapshot", () => {
    //creating a snapshot test
    const tree = renderer.create(<NurseryRegistration></NurseryRegistration>).toJSON()
    expect(tree).toMatchSnapshot()
})

it("Testing the number of <AddProgram/> apperance at the start", () => {
    //testing to see if <AddProgram/> is actually there when
    //the page is first loaded
    
    const wrapper = mount(<NurseryRegistration></NurseryRegistration>)
    expect(wrapper.find(AddProgram)).toHaveLength(1)

})

it("Testing the Add Program button", () => {
    //Tetsing the Add Program button by clicking it multiple times
    //and seeing how many <AddProgram/> components appear
    
    const wrapper = mount(<NurseryRegistration></NurseryRegistration>)

    const btn = wrapper.find('#addProgram')
    // console.log(btn.text())

    //click the button twice
    btn.simulate('click')
    btn.simulate('click')
    //update the wrapper
    wrapper.update()
    //should have 3 <AddProgram/>. 2 new and 1 there at the start
    expect(wrapper.find(AddProgram)).toHaveLength(3)


})

it("Testing the Add Program button", () => {
    //Tetsing the remove Program button to see
    //If it deletes the program component or not
    
    const wrapper = mount(<NurseryRegistration></NurseryRegistration>)

    const btn = wrapper.find('#removeBtn')
    // console.log(btn.text())
    btn.simulate('click')
    wrapper.update()
    //to not have any 'Add Program' components rendered there
    expect(wrapper.find(AddProgram)).toHaveLength(0)
})
