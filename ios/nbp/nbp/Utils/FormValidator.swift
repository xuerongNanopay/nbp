//
//  Validator.swift
//  nbp
//
//  Created by Xuerong on 2024-01-24.
//

import Foundation

struct FormValidator {
    static func required(_ value: String) -> String {
        return value.isEmpty ? "Required" : ""
    }
    
    static func number(_ value: String) -> String {
        return ""
    }
}
