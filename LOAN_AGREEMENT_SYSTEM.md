# Loan Agreement System Documentation

## Overview

The BuffrLend Loan Agreement System provides a complete solution for generating, displaying, and processing loan agreements with professional Buffr branding, digital signatures, and compliance features.

## Features

### ✅ **Complete Implementation**

- **Buffr Letterhead & Logo**: Professional company branding with embedded logo
- **Digital Signature Processing**: Canvas-based signature capture with validation
- **Compliance Integration**: NAMFISA and responsible lending compliance checks
- **PDF Generation**: HTML-to-PDF conversion with proper formatting
- **Database Integration**: Full Supabase integration with audit logging
- **API Routes**: RESTful endpoints for agreement management
- **Security**: Row-level security and input validation

## Architecture

### Components

```
buffrlend-starter/
├── lib/services/
│   └── loan-agreement-service.ts          # Core service for agreement generation
├── components/loan-agreement/
│   ├── digital-signature.tsx              # Signature capture component
│   └── loan-agreement-generator.tsx       # Main agreement component
├── app/
│   ├── protected/loan-agreement/
│   │   └── page.tsx                       # Agreement page
│   └── api/loan-agreements/
│       ├── generate/route.ts              # Generate agreement API
│       ├── sign/route.ts                  # Sign agreement API
│       └── pdf/route.ts                   # PDF generation API
└── supabase/migrations/
    └── 20241201000000_create_loan_agreements.sql
```

## Key Components

### 1. Loan Agreement Service (`loan-agreement-service.ts`)

**Purpose**: Core service for generating and managing loan agreements

**Key Features**:
- HTML template generation with Buffr branding
- Logo embedding (base64 conversion)
- Agreement number generation
- Digital signature processing
- Database integration

**Key Methods**:
```typescript
generateLoanAgreement(loanData, userId, loanApplicationId)
processDigitalSignature(agreementId, signature)
generateAgreementHTML(data)
getLogoBase64()
```

### 2. Digital Signature Component (`digital-signature.tsx`)

**Purpose**: Canvas-based signature capture with validation

**Key Features**:
- Mouse and touch support for signature drawing
- Signature validation (non-empty canvas)
- Consent checkboxes for legal compliance
- Client information capture (IP, user agent)
- Real-time signature preview

**Props**:
```typescript
interface DigitalSignatureProps {
  borrowerName: string
  onSignatureComplete: (signature: DigitalSignatureData) => void
  onSignatureError: (error: string) => void
  disabled?: boolean
}
```

### 3. Loan Agreement Generator (`loan-agreement-generator.tsx`)

**Purpose**: Main component orchestrating the entire agreement process

**Key Features**:
- Agreement generation and status tracking
- Loan summary display with all terms
- Borrower, employment, and banking information
- Compliance status indicators
- Digital signature integration
- PDF download functionality

**States**:
- `loading`: Generating agreement
- `generated`: Ready for signature
- `signing`: Processing signature
- `signed`: Agreement completed
- `error`: Error state

### 4. API Routes

#### Generate Agreement (`/api/loan-agreements/generate`)
- **POST**: Create new agreement
- **GET**: Retrieve existing agreement

#### Sign Agreement (`/api/loan-agreements/sign`)
- **POST**: Process digital signature
- **GET**: Check signature status

#### PDF Generation (`/api/loan-agreements/pdf`)
- **GET**: Download agreement as HTML/PDF
- **POST**: Generate agreement content

## Database Schema

### `loan_agreements` Table

```sql
CREATE TABLE loan_agreements (
    id TEXT PRIMARY KEY,
    agreement_number TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    loan_application_id TEXT,
    agreement_data JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'generated',
    signature_data JSONB,
    signed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### `audit_logs` Table

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Buffr Branding Features

### 1. **Company Letterhead**
- **Company Name**: "BUFFR FINANCIAL SERVICES cc"
- **Logo Integration**: Embedded Buffr logo (base64)
- **Contact Information**: Address, phone, email, website
- **Regulatory Information**: NAMFISA registration, NAMRA tax ID

### 2. **Professional Styling**
- **Color Scheme**: Buffr blue (#2563eb) primary color
- **Typography**: Professional font stack
- **Layout**: Clean, structured document layout
- **Print Optimization**: Media queries for PDF generation

### 3. **Signature Sections**
- **Borrower Signature**: Digital signature capture
- **Buffr Representative**: Official signature line
- **Legal Compliance**: Timestamp and IP tracking
- **Audit Trail**: Complete signing history

## Compliance Features

### 1. **NAMFISA Compliance**
- Interest rate validation (14.8% limit)
- Regulatory reporting requirements
- Compliance status indicators
- Audit logging for regulatory review

### 2. **Responsible Lending**
- Affordability assessment (1/3 salary rule)
- Maximum payment calculations
- Compliance status display
- Risk assessment integration

### 3. **Data Protection**
- User consent tracking
- IP address logging
- User agent capture
- Secure signature storage

## Usage Examples

### 1. **Generate Agreement**

```typescript
const agreementService = new LoanAgreementService()

const result = await agreementService.generateLoanAgreement(
  {
    borrower_name: 'John Doe',
    loan_amount: 'N$5,000.00',
    interest_rate: '15%',
    // ... other loan data
  },
  userId,
  loanApplicationId
)
```

### 2. **Process Signature**

```typescript
const signature = {
  borrower_name: 'John Doe',
  borrower_signature: 'data:image/png;base64,...',
  signature_date: new Date().toISOString(),
  consent_given: true,
  salary_deduction_authorized: true,
  ip_address: '127.0.0.1',
  user_agent: navigator.userAgent
}

const result = await agreementService.processDigitalSignature(
  agreementId,
  signature
)
```

### 3. **Component Usage**

```tsx
<LoanAgreementGenerator
  loanData={loanData}
  userId={user.id}
  loanApplicationId="app-123"
  onAgreementComplete={(agreementId) => {
    console.log('Agreement signed:', agreementId)
  }}
  onAgreementError={(error) => {
    console.error('Error:', error)
  }}
/>
```

## Security Features

### 1. **Authentication**
- Supabase Auth integration
- User session validation
- Protected API routes

### 2. **Authorization**
- Row-level security (RLS)
- User-specific data access
- Resource ownership validation

### 3. **Data Validation**
- Input sanitization
- Agreement data validation
- Signature data verification

### 4. **Audit Trail**
- Complete action logging
- IP address tracking
- User agent capture
- Timestamp recording

## Deployment Considerations

### 1. **Environment Variables**
```env
# Required for agreement generation
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_service_key
```

### 2. **Database Setup**
```bash
# Run migration
supabase db push

# Or apply manually
psql -f supabase/migrations/20241201000000_create_loan_agreements.sql
```

### 3. **Logo Asset**
- Ensure `Buffr_Logo.png` is in `/public/` directory
- Logo will be automatically embedded in agreements
- Fallback SVG logo provided if file not found

## Future Enhancements

### 1. **PDF Generation**
- Integrate Puppeteer for server-side PDF generation
- Add PDF optimization and compression
- Implement PDF/A compliance for long-term storage

### 2. **Advanced Signatures**
- Multi-party signature support
- Witness signature requirements
- Biometric signature validation

### 3. **Integration Features**
- RealPay mandate integration
- Email notification system
- WhatsApp agreement sharing
- Document versioning

### 4. **Analytics**
- Agreement completion rates
- Signature processing times
- User experience metrics
- Compliance reporting

## Testing

### 1. **Unit Tests**
```bash
npm test -- loan-agreement-service.test.ts
npm test -- digital-signature.test.tsx
```

### 2. **Integration Tests**
```bash
npm test -- loan-agreement-api.test.ts
```

### 3. **E2E Tests**
```bash
npm run test:e2e -- loan-agreement.spec.ts
```

## Support

For technical support or questions about the loan agreement system:

1. **Documentation**: Check this file and inline code comments
2. **Issues**: Create GitHub issues for bugs or feature requests
3. **Development**: Follow the established patterns and TypeScript interfaces

## License

This loan agreement system is part of the BuffrLend application and follows the same licensing terms.
