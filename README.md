# Delivery service server

API is available at https://deliveries-eyar.herokuapp.com

/authenticate

POST /

    Register or login
    
    Mandatory: email, password, userType: 'SENDER'/'COURIER'
    Optional: 
      sender: companyName
      courier: firstName, lasttName, phoneNumber, vehicleType

    Response: token
      Subsequent requests should include header: Auhtorization: Bearer ${token}

/delivery

POST /add

    Add delivery, allowed for senders only
    Optional: packageSize, cost, description

POST /assign

    Assign a courier to a delivery
    Mandatory: deliveryId, courierId

GET /get

    Get deliveries. Endpoint is paged.
    Senders - deliveries added
    Couriers - deliveries assigned

    params: date, page

GET /revenue

    For Couriers - get revenue, possibly for range of dates

    params: from, to - date strings

