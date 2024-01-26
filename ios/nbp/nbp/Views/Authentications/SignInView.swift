//
//  SignInView.swift
//  nbp
//
//  Created by Xuerong on 2024-01-22.
//

import SwiftUI

struct SignInView: View {
    @State var signInData = SignInFormData()
    
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
                    
                    ADInput(title: "Email or Username", value: $signInData.email, hint: signInData.emailHint).padding(.bottom, 10)
                    
                    ADInput(title: "Password", value: $signInData.password, adInputType: .password, hint: signInData.passwordHint).padding(.bottom, 5)
                    
                    NavigationLink(value: AuthRouter.ForgetPassword) {
                        Text("Forget Password?")
                            .foregroundColor(.gray)
                            .frame(maxWidth: .infinity, alignment: .trailing)
                    }
                    
                    Button(action: {
                        if signInData.isValid() {
                            print("Sign In form Success\(signInData)")
                        }
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
                Spacer()
                Spacer()
            }
            .navigationDestination(for: AuthRouter.self) { route in
                switch route {
                case .SignUp:
                    SignUpView()
                case .ForgetPassword:
                    ForgetPasswordView()
                }
            }
            .navigationTitle("Sign In")
            .navigationBarHidden(true)
            .onAppear {
                signInData.resetHint()
            }
        }
        .accentColor(.green700)
    }
}

#Preview {
    SignInView()
}
