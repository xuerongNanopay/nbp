//
//  SignUpFormData.swift
//  nbp
//
//  Created by Xuerong on 2024-01-26.
//

import Foundation

//MARK: Sign Up Form Data
struct SignUpFormData: Codable {
    var email = ""
    var emailHint = ""
    var password = ""
    var passwordHint = ""
    var rePassword = ""
    var rePaswordHint = ""
    
    mutating func resetHint() {
        emailHint = ""
        passwordHint = ""
        rePaswordHint = ""
    }
    
    mutating func reset() {
        resetHint()
        email = ""
        password = ""
        rePassword = ""
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
        
        hint = FormValidator.failFastPasswordValidator(password)
        if !hint.isEmpty {
            passwordHint = hint
            valid = false
        }
        
        if password != rePassword {
            rePaswordHint = "Password shoud match."
            valid = false
        }
        return valid
    }
    
}
