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
        ZStack {
//            Image("icybay")
//                .resizable()
//                .scaledToFill()
//                .ignoresSafeArea()
            VStack {
                Image("nbp_auth_header")
                    .resizable()
                    .frame(width: 400, height: 150)
                
                Spacer()
                
                VStack(alignment: .leading) {
                    Text("Welcome Back")
                        .font(.title)
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
                        .padding(.top, 10)
                }
                .padding(.horizontal)
            }
        }
    }
}

#Preview {
    SignInView()
}
