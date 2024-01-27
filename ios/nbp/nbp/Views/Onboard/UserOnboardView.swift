//
//  UserOnboardView.swift
//  nbp
//
//  Created by Xuerong on 2024-01-25.
//

import SwiftUI

struct UserOnboardView: View {
    var body: some View {
        NavigationStack {
            Text("TODO: Onboarding")
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Image("nbp_navbar_icon")
                        .resizable()
                        .frame(width: 40, height: 40)
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        print("Log out")
                    } label: {
                        Image(systemName: "xmark")
                            .resizable()
                            .foregroundColor(.green500)
                            .frame(width: 20, height: 20)
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

#Preview {
    UserOnboardView()
}
