//
//  ContentView.swift
//  nbp
//
//  Created by Xuerong on 2024-01-22.
//

import SwiftUI

struct ContentView: View {
    var hasSession = true
    var body: some View {
        if hasSession {
            SignInView()
        } else {
            DashBoardView()
        }
    }
}

#Preview {
    ContentView()
}
