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
        ZStack {
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
                
                ADInput(title: "Email", value: $forgetPasswordData.email, hint: forgetPasswordData.emailHint).padding(.bottom, 10)
                
                Button(action: {
                    if forgetPasswordData.isValid() {
                        Task {
                            print("Forget passwrod form Success\(forgetPasswordData)")
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
                Text("Submit")
                    .font(.headline)
                    .bold()
                    .padding()
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .background(Color("green_700"))
                    .cornerRadius(10)
                }
                .padding(.top, 15)
                .alert("Error", isPresented: $showAlert) {
                    Button("Close") {
                        alertMessage = ""
                    }
                } message: {
                    Text(alertMessage)
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
    ForgetPasswordView()
}
