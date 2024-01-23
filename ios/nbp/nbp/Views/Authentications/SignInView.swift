//
//  SignInView.swift
//  nbp
//
//  Created by Xuerong on 2024-01-22.
//

import SwiftUI

struct SignInView: View {
    @State var email: String = ""
    @State var password: String = ""
    
    var body: some View {
        let _ = print("SignIn creating")
        VStack {
            Image("nbp_auth_header")
                .resizable()
                .frame(width: 400, height: 150)
            
            Spacer()
            
            VStack(alignment: .leading) {
                Text("Welcome Back")
                    .font(.title)
                    .bold()
                    .padding(.bottom, 10)
                VStack(alignment: .leading) {
                    Text("Email or Username")
                        .font(.subheadline)
                        .foregroundStyle(.gray)
                        .padding(.bottom, -5)
                    TextField("", text: $email)
                        .padding(10)
                        .accentColor(Color("green_700"))
                        .overlay {
                            RoundedRectangle(cornerRadius: 10)
                                .stroke(Color("green_700"), lineWidth: 2)
                        }
                }
                .padding(.bottom, 10)
                
                VStack(alignment: .leading) {
                    Text("Password")
                        .font(.subheadline)
                        .foregroundStyle(.gray)
                        .padding(.bottom, -5)
                    SecureField("", text: $password)
                        .padding(10)
                        .accentColor(Color("green_700"))
                        .overlay {
                            RoundedRectangle(cornerRadius: 10)
                                .stroke(Color("green_700"), lineWidth: 2)
                        }
                }
                //TODO: change to Nav Link
                Text("ForgetPassword?")
                    .foregroundStyle(.gray)
                    .frame(maxWidth: .infinity, alignment: .trailing)
                    .padding(.top, 5)
                
                Button(action: {
                    print("Sign In button click")
                }) {
                  Text("Sign In")
                    .font(.headline)
                    .bold()
                    .padding()
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .background(Color("green_700"))
                    .cornerRadius(10)
                }
                .padding(.top, 15)
                
                HStack() {
                    Text("Not a User Yet?")
                    
                    Button(action: {
                        print("Sign Up button click")
                    }) {
                        Text("Create an account")
                            .foregroundStyle(.green300)
                    }
                }
                .frame(maxWidth: .infinity)
                .padding(.top)
                
                
            }
            .padding(.horizontal)
            
            Spacer()
        }
    }
}

#Preview {
    SignInView()
}
