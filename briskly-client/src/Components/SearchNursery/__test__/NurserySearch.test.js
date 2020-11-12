import React from 'react'
import ReactDOM from 'react-dom'
import NurserySearch from '../NurserySearch'
import AdvancedSearch from '../AdvancedSearch'
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
    ReactDOM.render(<NurserySearch></NurserySearch>, div)
})


it("matches snapshot", () => {
    //creating a snapshot test
    const tree = renderer.create(<NurserySearch></NurserySearch>).toJSON()
    expect(tree).toMatchSnapshot()
})
//advancedSearch
//advancedSearchButton
it("Checking to see if the advanced search appears or not", () => {
    const wrapper = mount(<NurserySearch/>)
    const btn = wrapper.find('#advancedSearchButton')
    btn.simulate('click')
    wrapper.update()

    expect(wrapper.find('#advancedSearchButton').text()).toBe("Hide Advanced Search")
})

it("Checking to see if the advanced search hides after clicking it again or not", () => {
    const wrapper = mount(<NurserySearch/>)
    const btn = wrapper.find('#advancedSearchButton')
    btn.simulate('click')
    wrapper.update()
    btn.simulate('click')
    wrapper.update()

    expect(wrapper.find('#advancedSearchButton').text()).toBe("Advanced Search")
})

it("Checking to see if the advanced search fields appear or not", () => {
    const wrapper = mount(<NurserySearch/>)
    const btn = wrapper.find('#advancedSearchButton')
    btn.simulate('click')
    wrapper.update()

    expect(wrapper.find('#advancedSearch')).toHaveLength(1)
})

it("Checking to see if the advanced search fields disappears after clicking the button or not", () => {
    const wrapper = mount(<NurserySearch/>)
    const btn = wrapper.find('#advancedSearchButton')
    btn.simulate('click')
    wrapper.update()
    btn.simulate('click')
    wrapper.update()

    expect(wrapper.find('#advancedSearch')).toHaveLength(0)
})