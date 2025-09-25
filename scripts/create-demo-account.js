/**
 * Demo Account Creation Script for BuffrLend
 * 
 * This script creates a demo account with the following credentials:
 * Email: demo@buffrlend.com
 * Password: demo123
 * 
 * The script will:
 * 1. Create the user in Supabase Auth
 * 2. Create a profile record in the profiles table
 * 3. Set up appropriate permissions and role
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey);
  console.error('\nPlease ensure your .env.local file contains these variables.');
  process.exit(1);
}

// Create Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Demo account details
const demoAccount = {
  email: 'demo@lend.buffr.ai',
  password: 'demo123',
  profile: {
    first_name: 'Demo',
    last_name: 'User',
    phone: '+264811234567',
    id_number: '12345678901',
    company_name: 'BuffrLend Demo Company',
    position: 'Demo Account',
    role: 'user',
    permissions: ['read:loans', 'create:loan_application', 'read:documents', 'upload:documents']
  }
};

async function createDemoAccount() {
  try {
    console.log('🚀 Starting demo account creation...');
    console.log(`📧 Email: ${demoAccount.email}`);
    console.log(`🔑 Password: ${demoAccount.password}`);
    console.log('');

    // Step 1: Check if user already exists
    console.log('🔍 Checking if demo account already exists...');
    const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers();
    
    if (checkError) {
      console.error('❌ Error checking existing users:', checkError.message);
      return;
    }

    const existingUser = existingUsers.users.find(user => user.email === demoAccount.email);
    
    if (existingUser) {
      console.log('⚠️  Demo account already exists!');
      console.log(`   User ID: ${existingUser.id}`);
      console.log('   Updating profile information...');
      
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ...demoAccount.profile,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id);

      if (updateError) {
        console.error('❌ Error updating profile:', updateError.message);
        return;
      }

      console.log('✅ Demo account profile updated successfully!');
      console.log('');
      console.log('🎉 Demo account is ready to use!');
      console.log(`   Login at: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/login`);
      console.log(`   Email: ${demoAccount.email}`);
      console.log(`   Password: ${demoAccount.password}`);
      return;
    }

    // Step 2: Create user in Supabase Auth
    console.log('👤 Creating user in Supabase Auth...');
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: demoAccount.email,
      password: demoAccount.password,
      email_confirm: true, // Auto-confirm email for demo account
      user_metadata: {
        first_name: demoAccount.profile.first_name,
        last_name: demoAccount.profile.last_name,
        company_name: demoAccount.profile.company_name
      }
    });

    if (authError) {
      console.error('❌ Error creating user in Auth:', authError.message);
      return;
    }

    if (!authData.user) {
      console.error('❌ No user data returned from Auth creation');
      return;
    }

    console.log('✅ User created in Supabase Auth');
    console.log(`   User ID: ${authData.user.id}`);

    // Step 3: Create profile record
    console.log('📝 Creating user profile...');
    
    // First, let's check what columns exist in the profiles table
    const { data: tableInfo, error: tableError } = await supabase
      .from('profiles')
      .select('*')
      .limit(0);
    
    if (tableError) {
      console.log('⚠️  Profiles table might not exist or have different structure:', tableError.message);
      console.log('   Creating basic profile with minimal fields...');
      
      // Try with minimal fields
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: demoAccount.email,
          first_name: demoAccount.profile.first_name,
          last_name: demoAccount.profile.last_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (profileError) {
        console.error('❌ Error creating profile:', profileError.message);
        console.log('🧹 Cleaning up failed user creation...');
        await supabase.auth.admin.deleteUser(authData.user.id);
        return;
      }
    } else {
      // Try with all fields
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email: demoAccount.email,
          first_name: demoAccount.profile.first_name,
          last_name: demoAccount.profile.last_name,
          phone: demoAccount.profile.phone,
          company_name: demoAccount.profile.company_name,
          position: demoAccount.profile.position,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (profileError) {
        console.error('❌ Error creating profile:', profileError.message);
        console.log('🧹 Cleaning up failed user creation...');
        await supabase.auth.admin.deleteUser(authData.user.id);
        return;
      }
    }

    if (profileError) {
      console.error('❌ Error creating profile:', profileError.message);
      
      // Clean up: Delete the auth user if profile creation failed
      console.log('🧹 Cleaning up failed user creation...');
      await supabase.auth.admin.deleteUser(authData.user.id);
      return;
    }

    console.log('✅ User profile created successfully');

    // Step 4: Create some sample data for the demo account
    console.log('📊 Creating sample data for demo account...');
    
    // Create a sample partner company
    const { data: companyData, error: companyError } = await supabase
      .from('partner_companies')
      .insert({
        company_name: demoAccount.profile.company_name,
        company_registration_number: 'DEMO123456',
        industry_sector: 'Technology',
        total_employees: 50,
        primary_contact_name: `${demoAccount.profile.first_name} ${demoAccount.profile.last_name}`,
        primary_contact_email: demoAccount.email,
        partnership_status: 'active',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (companyError) {
      console.log('⚠️  Could not create sample company (this is optional):', companyError.message);
    } else {
      console.log('✅ Sample company created');
    }

    // Create a sample loan application
    if (companyData) {
      const { error: loanError } = await supabase
        .from('loan_applications')
        .insert({
          application_id: `DEMO-${Date.now()}`,
          user_id: authData.user.id,
          company_id: companyData.id,
          loan_amount: 50000.00,
          loan_term: 24,
          status: 'pending',
          interest_rate: 12.5,
          monthly_payment: 2350.00,
          total_repayment: 56400.00,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (loanError) {
        console.log('⚠️  Could not create sample loan application (this is optional):', loanError.message);
      } else {
        console.log('✅ Sample loan application created');
      }
    }

    console.log('');
    console.log('🎉 Demo account created successfully!');
    console.log('');
    console.log('📋 Account Details:');
    console.log(`   Email: ${demoAccount.email}`);
    console.log(`   Password: ${demoAccount.password}`);
    console.log(`   Name: ${demoAccount.profile.first_name} ${demoAccount.profile.last_name}`);
    console.log(`   Company: ${demoAccount.profile.company_name}`);
    console.log(`   Role: ${demoAccount.profile.role}`);
    console.log('');
    console.log('🔗 Login Information:');
    console.log(`   URL: ${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/login`);
    console.log('');
    console.log('✨ The demo account is ready to use with sample data!');

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the script
createDemoAccount()
  .then(() => {
    console.log('\n🏁 Script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
