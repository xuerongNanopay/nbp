//
//  ForgetPasswordFormData.swift
//  nbp
//
//  Created by Xuerong on 2024-01-26.
//

import Foundation

struct ForgetPasswordFormData: Codable {
    var email = ""
    var emailHint = ""
    
    mutating func resetHint() {
        emailHint = ""
    }
    
    mutating func reset() {
        resetHint()
        email = ""
    }
    
    mutating func isValid() -> Bool {
        resetHint()
        var valid = true
        var hint: String = ""
        hint = FormValidator.failFastEmailValidator(email)
        if !hint.isEmpty {
            emailHint = hint
            valid = false
        }
        return valid
    }
}
