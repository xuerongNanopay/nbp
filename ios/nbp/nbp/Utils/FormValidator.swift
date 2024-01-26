//
//  FormTypes.swift
//  nbp
//
//  Created by Xuerong on 2024-01-24.
//

// F is short-cut of Form
import Foundation

let emailPattern = (#"^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"#, "Invalid Email")
let phonePattern = (#"^\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$"#, "Invalid Phone Number")
let passwordPattern =
    // At least 8 characters
    #"(?=.{8,})"# +
    // At least one capital letter
    #"(?=.*[A-Z])"# +
    // At least one lowercase letter
    #"(?=.*[a-z])"# +
    // At least one digit
    #"(?=.*\d)"# +
    // At least one special character
    #"(?=.*[ !$%&?._-])"#
let passwordPatterns = [
    (#"(?=.{8,})"#, "At least 8 characters"),
    (#"(?=.*[A-Z])"#, "At least one capital letter"),
    (#"(?=.*[a-z])"#, "At least one lowercase letter"),
    (#"(?=.*\d)"#, "At least one digit"),
    (#"(?=.*[ !$%&?._-])"#, "At least one special character")
]

struct FormValidator {
    static func emailValidator(_ email: String) -> [String] {
        var results: [String] = []
        let email = email.trimmingCharacters(in: .whitespacesAndNewlines)
        if email.isEmpty {
            results.append("Email is required.")
        }
        if email.range(of: emailPattern.0, options: .regularExpression) == nil {
            results.append(emailPattern.1)
        }
        return results
    }
    
    static func failFastEmailValidator(_ email: String) -> String {
        let results = emailValidator(email)
        return results.isEmpty ? "" : results.first!
    }

    static func failFastPhoneValidator(_ phone: String) -> String {
        return phone
    }
    
    static func failFastAdultAgeValidator(_ age: Int32) -> String {
        return "aaaa"
    }
    
    static func failFastPasswordValidator(_ password: String) -> String {
        let password = password.trimmingCharacters(in: .whitespacesAndNewlines)
        if password.isEmpty {
            return "Password is required."
        }
        
        for pattern in passwordPatterns {
            if password.range(of: pattern.0, options: .regularExpression) == nil {
                return pattern.1
            }
        }
        return ""
    }
    
    static func failFastRequireValidator(_ value: String, _ hint: String = "Require") -> String {
        return value.isEmpty ? hint : ""
    }
}
