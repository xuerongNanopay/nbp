//
//  OnboardingFormData.swift
//  nbp
//
//  Created by Xuerong on 2024-02-02.
//

import Foundation

//MARK: Sign In Form Data
struct OnboardingFormData: Codable {
    var firstName = ""
    var firstNameHint = ""
    var middleName: String?
    var middleNameHint = ""
    var lastName = ""
    var lastNameHint = ""
    
    var address1 = ""
    var address1Hint = ""
    var address2 = ""
    var address2Hint = ""
    var city = ""
    var cityHint = ""
    var provinceCode = ""
    var provinceCodeHint = ""
    var countryCode = ""
    var countryCodeHint = ""
    var postalCode = ""
    var postalCodeHint = ""
    var phoneNumber = ""
    var phoneNumberHint = ""
    
    mutating func resetHint() {
        firstNameHint = ""
        middleNameHint = ""
        lastNameHint = ""
        
        address1Hint = ""
        address2Hint = ""
        cityHint = ""
        provinceCodeHint = ""
        countryCodeHint = ""
        postalCodeHint = ""
        phoneNumberHint = ""
    }
    
    mutating func reset() {
        resetHint()

        firstName = ""
        middleName = ""
        lastName = ""
        
        address1 = ""
        address2 = ""
        city = ""
        provinceCode = ""
        countryCode = ""
        postalCode = ""
        phoneNumber = ""
    }
    
    mutating func sanitise() {
        firstName = firstName.trimmingCharacters(in: .whitespacesAndNewlines)
        if middleName != nil {
            middleName = middleName!.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? nil : middleName!.trimmingCharacters(in: .whitespacesAndNewlines)
        }
        lastName = lastName.trimmingCharacters(in: .whitespacesAndNewlines)

        address1 = address1.trimmingCharacters(in: .whitespacesAndNewlines)
        if address2 != nil {
            address2 = address2!.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? nil : address2!.trimmingCharacters(in: .whitespacesAndNewlines)
        }
        city = city.trimmingCharacters(in: .whitespacesAndNewlines)
        provinceCode = provinceCode.trimmingCharacters(in: .whitespacesAndNewlines)
        countryCode = countryCode.trimmingCharacters(in: .whitespacesAndNewlines)
        postalCode = postalCode.trimmingCharacters(in: .whitespacesAndNewlines)
        phoneNumber = phoneNumber.trimmingCharacters(in: .whitespacesAndNewlines)
    }
    
    
    mutating func isValid() -> Bool {
        resetHint()
        sanitise()
        var valid = true
        var hint: String = ""
        
        hint = FormValidator.failFastRequireValidator(firstName, "Firstname is required.")
        if !hint.isEmpty {
            firstNameHint = hint
            valid = false
        }
        
        hint = FormValidator.failFastRequireValidator(lastName, "Lastname is required.")
        if !hint.isEmpty {
            lastNameHint = hint
            valid = false
        }
        
        return valid
    }
}
