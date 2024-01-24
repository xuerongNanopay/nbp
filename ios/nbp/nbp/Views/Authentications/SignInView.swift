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
    
    enum AuthRouter {
        case SignUp, ForgetPassword
    }
    var body: some View {
        let _ = print("SignIn creating")
        NavigationStack {
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
                    
                    ADInput(title: "Email or Username", value: $email).padding(.bottom, 10)
                    
                    ADInput(title: "Password", value: $password, adInputType: .password).padding(.bottom, 5)
                    
                    NavigationLink(value: AuthRouter.ForgetPassword) {
                        Text("Forget Password?")
                            .foregroundColor(.gray)
                            .frame(maxWidth: .infinity, alignment: .trailing)
                    }
                    
                    Button(action: {
                        print("Sign In with email: \(email) and password: \(password)")
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
                        NavigationLink(value: AuthRouter.SignUp) {
                            Text("Create an account").foregroundColor(.green300)
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.top)
                    
                }
                .padding(.horizontal)
                
                Spacer()
            }
            .navigationDestination(for: AuthRouter.self) { route in
                switch route {
                case .SignUp:
                    SignUpView()
                case .ForgetPassword:
                    Text("TODO: ForgetPassword")
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .navigationTitle("Sign In")
            .navigationBarHidden(true)
        }
        .accentColor(.green700)
    }
}

#Preview {
    SignInView()
}
