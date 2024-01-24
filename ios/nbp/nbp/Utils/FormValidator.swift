//
//  Validator.swift
//  nbp
//
//  Created by Xuerong on 2024-01-24.
//

import Foundation

//Currently need(Make it simple for now): email, password, noEmptyString, number.
struct FormValidator {
    static let rEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
    
    static func trim(_ value: String) -> String {
        return value.trimmingCharacters(in: .whitespaces)
    }
    
    static func required(_ value: String) -> String {
        return value.isEmpty ? "Required" : ""
    }
    
    static func number(_ value: String) -> String {
        return ""
    }
}
