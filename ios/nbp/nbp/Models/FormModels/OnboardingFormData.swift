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
    
    mutating func sanitise() {
        firstName = firstName.trimmingCharacters(in: .whitespacesAndNewlines)
        if middleName != nil {
            middleName = middleName!.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? nil : middleName!.trimmingCharacters(in: .whitespacesAndNewlines)
        }
        lastName = lastName.trimmingCharacters(in: .whitespacesAndNewlines)
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
