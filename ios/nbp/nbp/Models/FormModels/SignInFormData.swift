//
//  Form.swift
//  nbp
//
//  Created by Xuerong on 2024-01-26.
//

import Foundation

//MARK: Sign In Form Data
struct SignInFormData: Codable {
    var email = ""
    var emailHint = ""
    var password = ""
    var passwordHint = ""
    
    mutating func resetHint() {
        emailHint = ""
        passwordHint = ""
    }
    
    mutating func reset() {
        resetHint()
        email = ""
        password = ""
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
        
        hint = FormValidator.failFastRequireValidator(password, "Password is required.")
        if !hint.isEmpty {
            passwordHint = hint
            valid = false
        }
        return valid
    }
    
}
