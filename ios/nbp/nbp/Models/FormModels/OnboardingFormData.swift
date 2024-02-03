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
    
    mutating func resetHint() {
        firstNameHint = ""
        middleNameHint = ""
        lastNameHint = ""
    }
    
    mutating func reset() {
        resetHint()
    }
    
    
    mutating func isValid() -> Bool {
        resetHint()
        var valid = true
        var hint: String = ""
        
        hint = FormValidator.failFastRequireValidator(firstName, "Firstname is required.")
        if !hint.isEmpty {
            firstNameHint = hint
            valid = true
        }
        
        hint = FormValidator.failFastRequireValidator(lastName, "Lastname is required.")
        if !hint.isEmpty {
            lastNameHint = hint
            valid = true
        }
        
        return valid
    }
}
