//
//  FormTypes.swift
//  nbp
//
//  Created by Xuerong on 2024-01-24.
//

// F is short-cut of Form
import Foundation

let emailPattern = (#"^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"#, "Invalid Email")
let phonePattern = (#"^\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$"#, "Invalid format(eg: 111-111-1111)")
let passwordPatterns = [
    (#"(?=.{8,})"#, "At least 8 characters"),
    (#"(?=.*[A-Z])"#, "At least one capital letter"),
    (#"(?=.*[a-z])"#, "At least one lowercase letter"),
    (#"(?=.*\d)"#, "At least one digit"),
    (#"(?=.*[ !$%&?._-])"#, "At least one special character(!$%&?._-)")
]

let postalCodePattern = (#"^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$"#, "Invalid Format(eg: S4S 3E8)")

struct FormValidator {
    static func failFastEmailValidator(_ email: String) -> String {
        let email = email.trimmingCharacters(in: .whitespacesAndNewlines)
        if email.isEmpty {
            return "Email is required."
        }
        if email.range(of: emailPattern.0, options: .regularExpression) == nil {
            return emailPattern.1
        }
        return ""
    }

    static func failFastPhoneValidator(_ phoneNumber: String) -> String {
        let phoneNumber = phoneNumber.trimmingCharacters(in: .whitespacesAndNewlines)
        if phoneNumber.isEmpty {
            return "Phone number is required."
        }
        if phoneNumber.range(of: phonePattern.0, options: .regularExpression) == nil {
            return phonePattern.1
        }
        return ""
    }

    static func failFastPostalCodeValidator(_ postalCode: String) -> String {
        let postalCode = postalCode.trimmingCharacters(in: .whitespacesAndNewlines)
        if postalCode.isEmpty {
            return "Postal code is required."
        }
        if postalCode.range(of: postalCodePattern.0, options: .regularExpression) == nil {
            return postalCodePattern.1
        }
        return ""
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
