//
//  ForgetPasswordView.swift
//  nbp
//
//  Created by Xuerong on 2024-01-25.
//

import SwiftUI

struct ForgetPasswordView: View {
    @State private var forgetPasswordData = ForgetPasswordFormData()
    @State private var isSubmitting = false
    @State private var showAlert = false
    @State private var alertMessage = ""
    
    var body: some View {
        let _ = print("ForgetPassword View creating")
        VStack {
            Spacer()
            Text("Forget Password?")
                .font(.title)
                .bold()
                .padding(.bottom, 10)
            Text("Enter the email you used to create your account in order to reset your password")
                .font(.subheadline)
                .multilineTextAlignment(.center)
                .padding(.bottom, 20)
            
            ADInput(title: "Email", value: $forgetPasswordData.email).padding(.bottom, 10)
            
            Button(action: {
//                print("Forget password: \(email)")
            }) {
            Text("Submit")
                .font(.headline)
                .bold()
                .padding()
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .background(Color("green_700"))
                .cornerRadius(10)
            }
            Spacer()
            Spacer()
        }
        .padding(.horizontal)
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
