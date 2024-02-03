//
//  UserOnboardView.swift
//  nbp
//
//  Created by Xuerong on 2024-01-25.
//

import SwiftUI

struct UserOnboardView: View {
    @State var onboardingFormData = OnboardingFormData()
    
    var body: some View {
        NavigationStack {
            VStack {
                ScrollView(showsIndicators: false) {
                    UserNameView(
                        firstName: $onboardingFormData.firstName,
                        firstNameHint: onboardingFormData.firstNameHint,
//                            middleName: $onboardingFormData.middleName,
                        middleNameHint: onboardingFormData.middleNameHint,
                        lastName: $onboardingFormData.lastName,
                        lastNameHint: onboardingFormData.lastNameHint
                    )
                    .padding(.leading, 1)
                    .padding(.trailing, 1)
                }
                .padding(.top, 25)

                
                VStack {
                    Button(action: {
                        let _ = onboardingFormData.isValid()
                    }) {
                    Text("Next")
                        .font(.headline)
                        .bold()
                        .padding()
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .background(Color("green_700"))
                        .cornerRadius(10)
                    }
                }
                .padding(.bottom)
            }
            .padding(.horizontal)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Image("nbp_navbar_icon")
                        .resizable()
                        .frame(width: 40, height: 40)
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        print("Log out")
                    } label: {
                        Image(systemName: "xmark")
                            .resizable()
                            .foregroundColor(.green500)
                            .frame(width: 20, height: 20)
                    }
                }
            }
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

enum OnboardingFormStepper {
    case UserNameView
}



struct UserNameView: View {
    @Binding var firstName: String
    var firstNameHint: String
    var middleName: Binding<String>? = nil
    var middleNameHint: String
    @Binding var lastName: String
    var lastNameHint: String

    var body: some View {
        VStack {
            Text("Let's Get to Know You!")
                .font(.title3)
                .bold()
                .padding(.bottom)
            
            Text("Please enter your full legal name so we can begin setting up your account.")
                .font(.subheadline)
                .multilineTextAlignment(.center)
                .padding(.bottom)

            ADInput(
                title: "First Name", 
                value: $firstName,
                hint: firstNameHint
            ).padding(.bottom, 10)
            
            ADInput(
                title: "Middle Name",
                value: $firstName,
                hint: firstNameHint
            ).padding(.bottom, 10)
            
            ADInput(
                title: "Last Name",
                value: $lastName,
                hint: lastNameHint
            ).padding(.bottom, 10)
        }
    }
}

#Preview("Usr Onboard View") {
    UserOnboardView()
}

//#Preview("Usr Data View") {
//    UserNameView()
//}
