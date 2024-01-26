//
//  Session.swift
//  nbp
//
//  Created by Xuerong on 2024-01-25.
//

import Foundation

// A Object that maintains user authentication and permission
// This model can be struct. When any of this properties change, it may result in a view change need.
struct Session {
    var sessionId: String?
    struct Login {
        var id: Int32
    }
    struct User {
        var id: Int32
    }
}
