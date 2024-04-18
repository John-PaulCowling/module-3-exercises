import { test, expect } from '@playwright/test';
import {faker} from '@faker-js/faker'

test.describe("API Test Suite", () => {

  let authToken = ""  //not sure what the best practice is for sharing state between before methods and the test method.
  test.beforeAll(async ({request}) => {
    let authResponse = await request.post("https://thinking-tester-contact-list.herokuapp.com/users/login",
        { 
          data:{
              "email": "sdfafasdads@landservices.com.au",
              "password": process.env.PASSWORD
          }
        }
      )
  
      expect(authResponse.status()).toBe(200)
  
      let authResponseJson = await authResponse.json()
      authToken = authResponseJson.token
      console.log(authToken)
})

  test('Test Adding A Contact', async ({ request }) => 
 {

    let headers = {"Authorization" : `Bearer ${authToken}`}

    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()
    const email = faker.internet.exampleEmail({firstName: firstName, lastName: lastName})
    const birthdate =  faker.date.birthdate().toISOString().substring(0,10)
    const phone =  faker.phone.number("1-!##-!##-####")
    const street1 =  faker.location.secondaryAddress()
    const street2 =  faker.location.streetAddress(false)
    const state =  faker.location.state()
    const city =  faker.location.city()
    const postalCode =  faker.location.zipCode()
    const country =  faker.location.countryCode()

    let response = await request.post("https://thinking-tester-contact-list.herokuapp.com/contacts", {headers: headers,
      data:{
          "firstName": firstName,
          "lastName": lastName,
          "birthdate": birthdate,
          "email": email,
          "phone": phone,
          "street1": street1,
          "street2": street2,
          "city": city,
          "stateProvince": state,
          "postalCode": postalCode,
          "country": country
    
      }
    })
    expect(response.status()).toBe(201)
    
    response = await request.get("https://thinking-tester-contact-list.herokuapp.com/contacts", {headers: headers})
    expect(response.status()).toBe(200)
    console.log(JSON.stringify(await response.json()))
  })
}
)





