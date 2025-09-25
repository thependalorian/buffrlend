#!/bin/bash

# Set correct Workload Identity Federation environment variables
echo "🔐 Setting correct Workload Identity Federation variables..."

# Remove the incorrect value
vercel env rm GOOGLE_WORKLOAD_IDENTITY_PROVIDER production --scope=buffr --yes

# Set the correct full path
echo "projects/106011259735562552981/locations/global/workloadIdentityPools/vercel-pool/providers/vercel-provider" | vercel env add GOOGLE_WORKLOAD_IDENTITY_PROVIDER production --scope=buffr

# Update the OIDC token audience
vercel env rm VERCEL_OIDC_TOKEN_AUDIENCE production --scope=buffr --yes
echo "api://vercel" | vercel env add VERCEL_OIDC_TOKEN_AUDIENCE production --scope=buffr

echo "✅ Workload Identity Federation variables updated successfully!"
echo ""
echo "📋 Current configuration:"
echo "   GOOGLE_SERVICE_ACCOUNT_EMAIL: buffr-lend-rag-pipeline@buffr-lend.iam.gserviceaccount.com"
echo "   GOOGLE_WORKLOAD_IDENTITY_PROVIDER: projects/106011259735562552981/locations/global/workloadIdentityPools/vercel-pool/providers/vercel-provider"
echo "   VERCEL_OIDC_TOKEN_AUDIENCE: api://vercel"
