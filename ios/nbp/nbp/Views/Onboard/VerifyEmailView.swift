//
//  VerifyEmailView.swift
//  nbp
//
//  Created by Xuerong on 2024-01-25.
//

import SwiftUI

struct VerifyEmailView: View {
    
    var body: some View {
        NavigationStack {
            Text("TODO: Verify Email")
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
    VerifyEmailView()
}
