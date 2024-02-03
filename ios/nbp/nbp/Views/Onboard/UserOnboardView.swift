//
//  UserOnboardView.swift
//  nbp
//
//  Created by Xuerong on 2024-01-25.
//

import SwiftUI

struct UserOnboardView: View {
    static let minStep: UInt8 = 1
    static let maxStep: UInt8 = 2
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
        case 2:
            UserAddressAndPhoneFormView(
                address1: $onboardingFormData.address1,
                address1Hint: onboardingFormData.address1Hint,
                address2: $onboardingFormData.address2  ?? "",
                address2Hint: onboardingFormData.address2Hint,
                city: $onboardingFormData.city,
                cityHint: onboardingFormData.cityHint,
                provinceCode: $onboardingFormData.provinceCode,
                provinceCodeHint: onboardingFormData.provinceCodeHint,
                countryCode: $onboardingFormData.countryCode,
                countryCodeHint: onboardingFormData.countryCodeHint,
                postalCode: $onboardingFormData.postalCode,
                postalCodeHint: onboardingFormData.postalCodeHint,
                phoneNumber: $onboardingFormData.phoneNumber,
                phoneNumberHint: onboardingFormData.phoneNumberHint
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
                    if step > UserOnboardView.minStep {
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
                    
                    if step != UserOnboardView.maxStep {
                        Button(action: {
                            let valid = onboardingFormData.isValid(step)
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
                    
                    if step == UserOnboardView.maxStep {
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
                .padding(.vertical)
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

//MARK: UserAddressAndPhoneFormView
struct UserAddressAndPhoneFormView: View {
    
    @Binding var  address1: String
    var address1Hint: String
    @Binding var  address2: String
    var address2Hint: String
    @Binding var  city: String
    var cityHint: String
    @Binding var  provinceCode: String
    var provinceCodeHint: String
    @Binding var  countryCode: String
    var countryCodeHint: String
    @Binding var  postalCode: String
    var postalCodeHint: String
    @Binding var  phoneNumber: String
    var phoneNumberHint: String
    
    var body: some View {
        VStack {
            Text("Your Residential Address and Phone Number")
                .font(.system(size: 14))
                .bold()
                .padding(.bottom)
            
            Text("We require this information to continue setting up your Foree Remittance account.")
                .font(.subheadline)
                .multilineTextAlignment(.center)
                .padding(.bottom)
            
            ADInput(
                title: "Address Line 1",
                value: $address1,
                hint: address1Hint
            ).padding(.bottom, 10)
            
            ADInput(
                title: "Address Line 2",
                value: $address2,
                hint: address2Hint
            ).padding(.bottom, 10)
            
            ADInput(
                title: "City",
                value: $city,
                hint: cityHint
            ).padding(.bottom, 10)
            
            ADInput(
                title: "Province",
                value: $provinceCode,
                hint: provinceCodeHint
            ).padding(.bottom, 10)
            
            ADInput(
                title: "Country",
                value: $countryCode,
                hint: countryCodeHint
            ).padding(.bottom, 10)

            ADInput(
                title: "Postal Code",
                value: $postalCode,
                hint: postalCodeHint
            ).padding(.bottom, 10)

            ADInput(
                title: "PhoneNumber",
                value: $phoneNumber,
                hint: phoneNumberHint
            ).padding(.bottom, 10)
        }
    }
}

#Preview("User Onboard View") {
    UserOnboardView()
}

#Preview("User Fullname Form Wizard") {
    UserFullNameFormView(
        firstName: .constant(""),
        firstNameHint: "",
        middleName: .constant(""),
        middleNameHint: "",
        lastName: .constant(""),
        lastNameHint: ""
    )
}

#Preview("User Address and Phone Form Wizard") {
    UserAddressAndPhoneFormView(
        address1: .constant(""),
        address1Hint: "",
        address2: .constant(""),
        address2Hint: "",
        city: .constant(""),
        cityHint: "",
        provinceCode: .constant(""),
        provinceCodeHint: "",
        countryCode: .constant(""),
        countryCodeHint: "",
        postalCode: .constant(""),
        postalCodeHint: "",
        phoneNumber: .constant(""),
        phoneNumberHint: ""
    )
}

