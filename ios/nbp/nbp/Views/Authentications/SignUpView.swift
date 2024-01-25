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
            Image("nbp_auth_header")
                .resizable()
                .frame(width: 400, height: 150)

            Spacer()
            VStack(alignment: .leading) {
                Text("Create an ccount")
                    .font(.title)
                    .bold()
                    .padding(.bottom, 10)
                ADInput(title: "Email or Username", value: $email).padding(.bottom, 5)
                ADInput(title: "Password", value: $password, adInputType: .password).padding(.bottom, 5)
                ADInput(title: "Password", value: $rePassword, adInputType: .password).padding(.bottom, 5)
                
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
            .padding(.horizontal)
            
            Spacer()
            Spacer()
            Spacer()
        }
    }
}

#Preview {
    SignUpView()
}
