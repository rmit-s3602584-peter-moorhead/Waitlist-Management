import React, {Component} from 'react'
import "../../ComponentStyles.css"

class AdvancedSearch extends Component{

    /*

        This component show the Advanced Search options for the user to select from

    */

    render(){
        return(
        
            <div id="advancedSearch">
               
                <div class="form-group">
                    <div class="form-check"><input class="form-check-input" type="checkbox" name="ChildCareFeedReduction" value="yes" id="formCheck-2"/><label class="form-check-label" for="formCheck-2">Your center is a member of the Child Care Fee Reduction Initiative</label></div>
                </div>

                 <div class="form-group">
                    <div class="form-check"><input class="form-check-input" type="checkbox" name="ECE" value="yes" id="formCheck-3"/><label class="form-check-label" for="formCheck-3">ECE (Early Childhood Education) Certification</label></div>
                </div>

                <div class="form-group">
                    <div class="form-check"><input class="form-check-input" type="checkbox" name="ELF" value="yes" id="formCheck-4"/><label class="form-check-label" for="formCheck-4">ELF (Early Learning Framework) Programming</label></div>
                </div>


                <div class="form-group">
                    <div><label>Facility type:</label>
                        <div class="form-check"><input name="FacilityType" class="form-check-input" name="faciltyType" type="radio" value="Licensed Family" id="formCheck-9"/><label class="form-check-label" for="formCheck-9">Licensed Family</label></div>
                        <div class="form-check"><input name="FacilityType" class="form-check-input" name="faciltyType" type="radio" value="Licensed Group" id="formCheck-10"/><label class="form-check-label" for="formCheck-10">Licensed Group</label></div>
                    </div>
                </div>


                <div class="form-group"><label>Program(s):</label>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-11" name="programs1" value="Under 36 Months"/><label class="form-check-label" for="formCheck-11">Under 36 Months</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-14" name="programs2" value="3 years to Kindergarten"/><label class="form-check-label" for="formCheck-14">3 years to Kindergarten</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-13" name="programs3" value="Licensed Preschool"/><label class="form-check-label" for="formCheck-13">Licensed Preschool</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-12" name="programs4" value="School Age: Grade 1 to Age 12"/><label class="form-check-label" for="formCheck-12">School Age: Grade 1 to Age 12</label></div>
                </div>


                <div class="form-group"><label>House of Operation:</label>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-15" name="HouseOfOperation1" value="Weekdays"/><label class="form-check-label" for="formCheck-15">Weekdays</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-20" name="HouseOfOperation2" value="Weekends"/><label class="form-check-label" for="formCheck-20">Weekends</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-19" name="HouseOfOperation3" value="Statutory Holidays"/><label class="form-check-label" for="formCheck-19">Statutory Holidays</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-18" name="HouseOfOperation4" value="Overnight"/><label class="form-check-label" for="formCheck-18">Overnight</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-17" name="HouseOfOperation5" value="Weekdays Before 6am"/><label class="form-check-label" for="formCheck-17">Weekdays Before 6am</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-16" name="HouseOfOperation6" value="Weekdays After 7pm"/><label class="form-check-label" for="formCheck-16">Weekdays After 7pm</label></div>
                </div>

                <div class="form-group"><label>Meal Services:</label>
                    <div class="form-check"><input class="form-check-input" value="Extra Fee" name="MealServices" type="radio" id="formCheck-21"/><label class="form-check-label" for="formCheck-21">Extra Fee</label></div>
                    <div class="form-check"><input class="form-check-input" value="Included in fee" name="MealServices" type="radio" id="formCheck-23"/><label class="form-check-label" for="formCheck-23">Included in fee</label></div>
                    <div class="form-check"><input class="form-check-input" value="Not offered" name="MealServices" type="radio" id="formCheck-22"/><label class="form-check-label" for="formCheck-22">Not offered</label></div>
                </div>

                <div class="form-group"><label>Pick-up Service:</label>
                    <div class="form-check"><input class="form-check-input" value="Extra Fee" name="pickup" type="radio" id="formCheck-24"/><label class="form-check-label" for="formCheck-24">Extra Fee</label></div>
                    <div class="form-check"><input class="form-check-input" value="Included in fee" name="pickup" type="radio" id="formCheck-26"/><label class="form-check-label" for="formCheck-26">Included in fee</label></div>
                    <div class="form-check"><input class="form-check-input" value="Not offered" name="pickup" type="radio" id="formCheck-25"/><label class="form-check-label" for="formCheck-25">Not offered</label></div>
                </div>
                <div class="form-group"><label>Language:</label>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-502" name="Language6" value="English" /><label class="form-check-label" for="formCheck-502">English</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-27" name="Language1" value="Cantonese" /><label class="form-check-label" for="formCheck-27">Cantonese</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-31" name="Language2" value="French"/><label class="form-check-label" for="formCheck-31">French</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-30" name="Language3" value="Mandarin"/><label class="form-check-label" for="formCheck-30">Mandarin</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-29" name="Language4" value="Punjabi"/><label class="form-check-label" for="formCheck-29">Punjabi</label></div>
                    <div class="form-check"><input class="form-check-input" type="checkbox" id="formCheck-28" name="Language5" value="Spanish"/><label class="form-check-label" for="formCheck-28">Spanish</label></div>
                </div>
                <div class="form-group"><label>Aboriginal Programming:</label>
                    <div class="form-check"><input class="form-check-input" value="yes" name="Aboriginal" type="radio" id="formCheck-5"/><label class="form-check-label" for="formCheck-5">Yes</label></div>
                    <div class="form-check"><input class="form-check-input" value="no" name="Aboriginal" type="radio" id="formCheck-6"/><label class="form-check-label" for="formCheck-6">No</label></div>
                </div>
                <div class="form-group"><label>Special Needs</label>
                    <div class="form-check"><input class="form-check-input" value="yes" name="specialNeeds" type="radio" id="formCheck-7"/><label class="form-check-label" for="formCheck-7">Yes</label></div>
                    <div class="form-check"><input class="form-check-input" value="no" name="specialNeeds" type="radio" id="formCheck-8"/><label class="form-check-label" for="formCheck-8">No</label></div>
                </div>
            

              
            </div>
          



        )
    }

}

export default AdvancedSearch