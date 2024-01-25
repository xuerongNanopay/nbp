//
//  ForgetPasswordView.swift
//  nbp
//
//  Created by Xuerong on 2024-01-25.
//

import SwiftUI

struct ForgetPasswordView: View {
    var body: some View {
        let _ = print("ForgetPassword View creating")
        VStack {
            Text("Todo: ForgetPassword View")
        }
        .toolbar {
            ToolbarItem(placement: .principal) {
                Image("nbp_navbar_icon")
                    .resizable()
                    .frame(width: 35, height: 35)
            }
        }
        .navigationBarTitleDisplayMode(.inline)
    }
}

#Preview {
    ForgetPasswordView()
}
