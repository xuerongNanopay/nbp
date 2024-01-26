//
//  FormTypes.swift
//  nbp
//
//  Created by Xuerong on 2024-01-24.
//

// F is short-cut of Form
import Foundation

let rEmail = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

protocol FValidator {
    var errors: [String] { get }
    func isValid() -> Bool
}

typealias FEmail = String
typealias FPassword = String
typealias FAge = Int32
typealias FInt = Int32
typealias FDouble = Double
typealias FDate = Data
typealias FText = String
typealias FIntArr = [Int32]
typealias FStringArr = [String]


extension FEmail: FValidator {
    var errors: [String] {
        var results: [String] = []
        if self.isEmpty {
            results.append("Email is required.")
        }
        return results
    }
    func isValid() -> Bool {
        return true
    }
}

extension Optional<FEmail>: FValidator {
    var errors: [String] {
        if self == nil {
            return []
        } else {
            return self!.errors
        }
    }
    func isValid() -> Bool {
        if self == nil {
            return true
        } else {
            return self!.isValid()
        }
    }
}
