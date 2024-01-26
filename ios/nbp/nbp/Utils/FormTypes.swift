//
//  FormTypes.swift
//  nbp
//
//  Created by Xuerong on 2024-01-24.
//

// F is short-cut of Form
import Foundation

let emailPattern = #"^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"#
let phonePattern = #"^\(?\d{3}\)?[ -]?\d{3}[ -]?\d{4}$"#
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

protocol FormData {
    var errors: [String]? { get }
    func isValid() -> Bool
}

typealias FEmail = String
typealias FPhoneNumber = String
typealias FPassword = String
typealias FAge = Int32
typealias FInt = Int32
typealias FDouble = Double
typealias FDate = Data
typealias FText = String
typealias FIntArr = [Int32]
typealias FStringArr = [String]


extension FEmail: FormData {
    var errors: [String]? {
        var results: [String] = []
        if self.isEmpty && self.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            results.append("Email is required.")
        }
        if self.range(of: emailPattern, options: .regularExpression) != nil {
            results.append("Invalid Email Format")
        }
        return results.isEmpty ? nil : results
    }
    func isValid() -> Bool {
        return errors == nil
    }
}

extension Optional<FEmail>: FormData {
    var errors: [String]? {
        if self == nil {
            return nil
        } else {
            return self!.errors
        }
    }
    func isValid() -> Bool {
        return errors == nil
    }
}
