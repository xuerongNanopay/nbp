//
//  ADInput.swift
//  nbp
//
//  Created by Xuerong on 2024-01-23.
//

import SwiftUI

struct ADInput: View {
    var title: String
    @Binding var value: String
    var adInputType = ADInputType.text
    var hint = ""
    
    enum ADInputType {
        case text, password
    }
    
    @ViewBuilder var FieldView: some View {
        switch adInputType {
        case .text:
            TextField("", text: $value)
        case .password:
            SecureField("", text: $value)
                .textContentType(.oneTimeCode)
        }
    }
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(title)
                .font(.subheadline)
                .foregroundStyle(.gray)
                .padding(.bottom, -3)
            FieldView
                .padding(10)
                .accentColor(Color("green_700"))
                .overlay {
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color("green_700"), lineWidth: 2)
                }
            if !hint.isEmpty {
                Text(hint)
                    .foregroundStyle(.red)
                    .font(.footnote)
            }
        }
    }
    
}

#Preview {
    Group {
        ADInput(title: "Email and Password", value: .constant("email"))
        ADInput(title: "Passowrd", value: .constant("password"), adInputType: .password)
        ADInput(title: "Passowrd", value: .constant("password"), adInputType: .password, hint: "invalid password")
    }
}
