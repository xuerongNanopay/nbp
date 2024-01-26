//
//  SignUpView.swift
//  nbp
//
//  Created by Xuerong on 2024-01-22.
//

import SwiftUI

struct SignUpView: View {
    @State private var signUpData = SignUpFormData()
    @State private var isSubmitting = false
    @State private var showAlert = false
    @State private var alertMessage = ""

    var body: some View {
        let _ = print("SignUp creating")
        ZStack {
            VStack {

                Spacer()
                VStack(alignment: .center) {
                    Text("Create an account")
                        .font(.title)
                        .bold()
                        .padding(.bottom, 20)
                    ADInput(title: "Email", value: $signUpData.email, hint: signUpData.emailHint).padding(.bottom, 5)
                    ADInput(title: "Password", value: $signUpData.password, adInputType: .password, hint: signUpData.passwordHint).padding(.bottom, 5)
                    ADInput(title: "Repeat Password", value: $signUpData.rePassword, adInputType: .password, hint: signUpData.rePaswordHint).padding(.bottom, 5)
                    
                    Button(action: {
                        if signUpData.isValid() {
                            Task {
                                print("Sign In form Success\(signUpData)")
                                isSubmitting = true
                                
                                try await Task.sleep(nanoseconds: UInt64(4 * Double(NSEC_PER_SEC)))
                                
                                isSubmitting = false
                                showAlert = true
                            }
                        } else {
                            alertMessage = "Please check all your inputs."
                            showAlert = true
                        }
                    }) {
                    Text("Sign Up")
                        .font(.headline)
                        .bold()
                        .padding()
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .background(Color("green_700"))
                        .cornerRadius(10)
                    }
                    .padding(.top, 15)
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
            
            if isSubmitting {
                VStack {
                    Spacer()
                    ProgressView()
                        .controlSize(.large)
                        .progressViewStyle(CircularProgressViewStyle(tint: Color.white))
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .background(Color.gray.opacity(0.5))
                    Spacer()
                }
                .ignoresSafeArea()
            }
        }
    }
}

#Preview {
    SignUpView()
}
