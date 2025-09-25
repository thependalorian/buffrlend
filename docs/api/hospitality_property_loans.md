# BuffrLend API: Hospitality Property Loans

## Overview
This API endpoint allows external systems, such as BuffrHost, to request loan offers for hospitality properties. The system will assess the property details and generate a potential loan offer.

## Endpoint
`POST /hospitality-property-loans`

## Authentication
This endpoint requires API Key authentication. Include your BuffrLend API Key in the `Authorization` header as a Bearer token.

`Authorization: Bearer YOUR_BUFFRLEND_API_KEY`

## Request Body
The request body should be a JSON object conforming to the `HospitalityPropertyLoanRequest` schema.

### `HospitalityPropertyLoanRequest` Schema
| Field             | Type      | Required | Description                                                              |
|-------------------|-----------|----------|--------------------------------------------------------------------------|
| `property_id`     | `string`  | Yes      | Unique identifier for the hospitality property from the originating system (e.g., BuffrHost). |
| `property_name`   | `string`  | Yes      | Name of the hospitality property.                                        |
| `contact_email`   | `string`  | Yes      | Contact email for the property.                                          |
| `requested_amount`| `number`  | Yes      | The desired loan amount.                                                 |
| `loan_purpose`    | `string`  | Yes      | The purpose of the loan (e.g., "renovation", "expansion", "working_capital"). |
| `estimated_revenue`| `number`  | No       | Estimated annual revenue of the property.                                |

## Response

### Success Response (HTTP 200 OK)
```json
{
  "message": "Loan offer process initiated for hospitality property",
  "property_id": "prop-123",
  "status": "pending_assessment",
  "estimated_offer": 8000.00
}
```

### Error Response (HTTP 4xx/5xx)
```json
{
  "detail": "Error message describing the issue."
}
```

## Example Request
```bash
curl -X POST \
  https://lend.buffr.ai/hospitality-property-loans \
  -H "Authorization: Bearer YOUR_BUFFRLEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ 
    "property_id": "hotel-alpha-1",
    "property_name": "Alpha Hotel & Suites",
    "contact_email": "manager@alphahotel.com",
    "requested_amount": 10000.00,
    "loan_purpose": "renovation",
    "estimated_revenue": 500000.00
  }'
```