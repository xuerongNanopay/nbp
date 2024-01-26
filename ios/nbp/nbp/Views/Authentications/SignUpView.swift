//
//  SignUpView.swift
//  nbp
//
//  Created by Xuerong on 2024-01-22.
//

import SwiftUI

struct SignUpView: View {
    @State var email: String = ""
    @State var password: String = ""
    @State var rePassword: String = ""

    var body: some View {
        let _ = print("SignUp creating")
        VStack {

            Spacer()
            VStack(alignment: .center) {
                Text("Create an account")
                    .font(.title)
                    .bold()
                    .padding(.bottom, 20)
                ADInput(title: "Email or Username", value: $email).padding(.bottom, 5)
                ADInput(title: "Password", value: $password, adInputType: .password).padding(.bottom, 5)
                ADInput(title: "Repeat Password", value: $rePassword, adInputType: .password).padding(.bottom, 5)
                
                Button(action: {
                    print("Sign Up with email: \(email) and password: \(password)")
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
//                .disabled(true)
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
    SignUpView()
}
