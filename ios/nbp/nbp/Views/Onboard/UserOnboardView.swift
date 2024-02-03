//
//  UserOnboardView.swift
//  nbp
//
//  Created by Xuerong on 2024-01-25.
//

import SwiftUI

let minStep = 1
let maxStep = 1

struct UserOnboardView: View {
    @State var step = minStep
    @State var onboardingFormData = OnboardingFormData()
    
    @ViewBuilder var formView: some View {
        switch step {
        case 1:
            UserFullNameFormView(
                firstName: $onboardingFormData.firstName,
                firstNameHint: onboardingFormData.firstNameHint,
                middleName: $onboardingFormData.middleName ?? "",
                middleNameHint: onboardingFormData.middleNameHint,
                lastName: $onboardingFormData.lastName,
                lastNameHint: onboardingFormData.lastNameHint
            )
        default:
            Text("Error")
        }
    }
    
    var body: some View {
        NavigationStack {
            VStack {
                ScrollView(showsIndicators: false) {
                    formView
                        .padding(.horizontal, 2)
                }
                .padding(.top, 25)

                
                VStack {
                    if step > minStep {
                        Button(action: {
                            step -= 1
                        }) {
                            Text("Back")
                                .font(.headline)
                                .bold()
                                .padding()
                                .foregroundColor(Color("green_700"))
                                .frame(maxWidth: .infinity)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(Color("green_700"), lineWidth: 2)
                                )
                        }
                    }
                    
                    if step != maxStep {
                        Button(action: {
                            let valid = onboardingFormData.isValid()
                            if valid {
                                step += 1
                            }
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
                    
                    if step == maxStep {
                        Button(action: {
                            let valid = onboardingFormData.isValid()
                            
                            if valid {
                                //TODO: Submit
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

//MARK: UserFullNameFormView
struct UserFullNameFormView: View {
    typealias AssocType = UserFullNameFormView
    
    @Binding var firstName: String
    var firstNameHint: String
    @Binding var middleName: String
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
                value: $middleName,
                hint: middleNameHint
            ).padding(.bottom, 10)
            
            ADInput(
                title: "Last Name",
                value: $lastName,
                hint: lastNameHint
            ).padding(.bottom, 10)
        }
    }
}

//MARK: UserAddressFormView
struct UserAddressFormView: View {
    
    @Binding var firstName: String
    var firstNameHint: String
    @Binding var middleName: String
    var middleNameHint: String
    @Binding var lastName: String
    var lastNameHint: String
    
    var body: some View {
        VStack {
            Text("Your Residential Address and Phone Number")
                .font(.title3)
                .bold()
                .padding(.bottom)
            
            Text("We require this information to continue setting up your Foree Remittance account.")
                .font(.subheadline)
                .multilineTextAlignment(.center)
                .padding(.bottom)
        }
    }
}

func ??<T>(lhs: Binding<Optional<T>>, rhs: T) -> Binding<T> {
    Binding(
        get: { lhs.wrappedValue ?? rhs },
        set: { lhs.wrappedValue = $0 }
    )
}

#Preview("Usr Onboard View") {
    UserOnboardView()
}

//#Preview("Usr Data View") {
//    UserFullNameFormView()
//}
