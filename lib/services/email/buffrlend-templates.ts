/**
 * BuffrLend Email Templates
 * 
 * Specialized email templates for BuffrLend loan management system
 * Founder: George Nekwaya (george@buffr.ai +12065308433)
 */

export const buffrLendEmailTemplates = {
  loan_application_confirmation: {
    subject: 'Loan Application Received - \{\{loan_amount\}\} \{\{currency\}\}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Loan Application Confirmation</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2c3e50; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .loan-details { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
              .button { background-color: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }
              .footer { background-color: #ecf0f1; padding: 20px; text-align: center; font-size: 12px; color: #7f8c8d; }
              .contact-info { background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>🏦 Loan Application Received</h1>
                  <p>BuffrLend - lend.buffr.ai</p>
              </div>
              
              <div class="content">
                  <h2>Hello \{\{applicant_name\}\},</h2>
                  
                  <p>Thank you for your loan application with BuffrLend. We have received your application and it is currently being reviewed.</p>
                  
                  <div class="loan-details">
                      <h3 style="margin-top: 0; color: #2c3e50;">📋 Application Details</h3>
                      <ul style="list-style: none; padding: 0;">
                          <li><strong>💰 Loan Amount:</strong> \{\{loan_amount\}\} \{\{currency\}\}</li>
                          <li><strong>📝 Purpose:</strong> \{\{loan_purpose\}\}</li>
                          <li><strong>🆔 Application ID:</strong> \{\{application_id\}\}</li>
                          <li><strong>⏰ Processing Time:</strong> \{\{processing_time\}\}</li>
                      </ul>
                  </div>
                  
                  <div class="contact-info">
                      <h4 style="margin-top: 0; color: #27ae60;">📞 Contact Information</h4>
                      <p><strong>Support Email:</strong> <a href="mailto:\{\{support_email\}\}">\{\{support_email\}\}</a></p>
                      <p><strong>Support Phone:</strong> <a href="tel:\{\{support_phone\}\}">\{\{support_phone\}\}</a></p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="\{\{application_url\}\}" class="button">
                          📊 View Application Status
                      </a>
                  </div>
                  
                  <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                      <h4 style="margin-top: 0; color: #856404;">⚠️ Important Information</h4>
                      <ul>
                          <li>Please keep your application ID for future reference</li>
                          <li>We will notify you via email of any updates</li>
                          <li>Ensure all required documents are submitted</li>
                          <li>Contact support if you have any questions</li>
                      </ul>
                  </div>
                  
                  <p style="color: #7f8c8d; font-size: 14px;">
                      <strong>Need help?</strong> Contact our support team at 
                      <a href="mailto:\{\{support_email\}\}">\{\{support_email\}\}</a> 
                      or call <a href="tel:\{\{support_phone\}\}">\{\{support_phone\}\}</a>.
                  </p>
              </div>
              
              <div class="footer">
                  <p><strong>© 2024 BuffrLend. All rights reserved.</strong></p>
                  <p>Powered by BuffrLend - <a href="https://lend.buffr.ai" style="color: #27ae60;">lend.buffr.ai</a></p>
                  <p>This email was sent from noreply@mail.buffr.ai</p>
              </div>
          </div>
      </body>
      </html>
    `,
    text: `
      LOAN APPLICATION CONFIRMATION
      =============================
      
      Hello \{\{applicant_name\}\},
      
      Thank you for your loan application with BuffrLend. We have received your application and it is currently being reviewed.
      
      APPLICATION DETAILS:
      ===================
      Loan Amount: \{\{loan_amount\}\} \{\{currency\}\}
      Purpose: \{\{loan_purpose\}\}
      Application ID: \{\{application_id\}\}
      Processing Time: \{\{processing_time\}\}
      
      CONTACT INFORMATION:
      ===================
      Support Email: \{\{support_email\}\}
      Support Phone: \{\{support_phone\}\}
      
      VIEW APPLICATION:
      ================
      \{\{application_url\}\}
      
      IMPORTANT INFORMATION:
      =====================
      - Please keep your application ID for future reference
      - We will notify you via email of any updates
      - Ensure all required documents are submitted
      - Contact support if you have any questions
      
      NEED HELP?
      ==========
      Contact our support team at \{\{support_email\}\} or call \{\{support_phone\}\}.
      
      ---
      © 2024 BuffrLend. All rights reserved.
      Powered by BuffrLend - lend.buffr.ai
      This email was sent from noreply@mail.buffr.ai
    `
  },

  loan_approval: {
    subject: '🎉 Loan Approved - \{\{loan_amount\}\} \{\{currency\}\}',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Loan Approved</title>
          <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #27ae60; color: white; padding: 20px; text-align: center; }
              .content { padding: 20px; }
              .loan-details { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
              .button { background-color: #2c3e50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; }
              .footer { background-color: #ecf0f1; padding: 20px; text-align: center; font-size: 12px; color: #7f8c8d; }
              .contact-info { background-color: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <h1>🎉 Congratulations! Loan Approved</h1>
                  <p>BuffrLend - lend.buffr.ai</p>
              </div>
              
              <div class="content">
                  <h2>Hello \{\{applicant_name\}\},</h2>
                  
                  <p>Great news! Your loan application has been approved. We're excited to help you achieve your financial goals.</p>
                  
                  <div class="loan-details">
                      <h3 style="margin-top: 0; color: #2c3e50;">💰 Loan Details</h3>
                      <ul style="list-style: none; padding: 0;">
                          <li><strong>💵 Loan Amount:</strong> \{\{loan_amount\}\} \{\{currency\}\}</li>
                          <li><strong>📈 Interest Rate:</strong> \{\{interest_rate\}\}%</li>
                          <li><strong>📅 Loan Term:</strong> \{\{loan_term\}\} months</li>
                          <li><strong>💳 Monthly Payment:</strong> \{\{monthly_payment\}\} \{\{currency\}\}</li>
                          <li><strong>🆔 Loan ID:</strong> \{\{loan_id\}\}</li>
                          <li><strong>✅ Approval Date:</strong> \{\{approval_date\}\}</li>
                      </ul>
                  </div>
                  
                  <div class="contact-info">
                      <h4 style="margin-top: 0; color: #27ae60;">📞 Contact Information</h4>
                      <p><strong>Support Email:</strong> <a href="mailto:\{\{support_email\}\}">\{\{support_email\}\}</a></p>
                      <p><strong>Support Phone:</strong> <a href="tel:\{\{support_phone\}\}">\{\{support_phone\}\}</a></p>
                  </div>
                  
                  <div style="text-align: center; margin: 30px 0;">
                      <a href="\{\{loan_url\}\}" class="button">
                          📋 View Loan Details
                      </a>
                  </div>
                  
                  <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
                      <h4 style="margin-top: 0; color: #155724;">✅ Next Steps</h4>
                      <ul>
                          <li>Review your loan agreement carefully</li>
                          <li>Sign the loan documents</li>
                          <li>Funds will be disbursed within 2-3 business days</li>
                          <li>Set up automatic payments for convenience</li>
                      </ul>
                  </div>
                  
                  <p style="color: #7f8c8d; font-size: 14px;">
                      <strong>Need help?</strong> Contact our support team at 
                      <a href="mailto:\{\{support_email\}\}">\{\{support_email\}\}</a> 
                      or call <a href="tel:\{\{support_phone\}\}">\{\{support_phone\}\}</a>.
                  </p>
              </div>
              
              <div class="footer">
                  <p><strong>© 2024 BuffrLend. All rights reserved.</strong></p>
                  <p>Powered by BuffrLend - <a href="https://lend.buffr.ai" style="color: #27ae60;">lend.buffr.ai</a></p>
                  <p>This email was sent from noreply@mail.buffr.ai</p>
              </div>
          </div>
      </body>
      </html>
    `,
    text: `
      🎉 LOAN APPROVED - CONGRATULATIONS!
      ===================================
      
      Hello \{\{applicant_name\}\},
      
      Great news! Your loan application has been approved. We're excited to help you achieve your financial goals.
      
      LOAN DETAILS:
      =============
      Loan Amount: \{\{loan_amount\}\} \{\{currency\}\}
      Interest Rate: \{\{interest_rate\}\}%
      Loan Term: \{\{loan_term\}\} months
      Monthly Payment: \{\{monthly_payment\}\} \{\{currency\}\}
      Loan ID: \{\{loan_id\}\}
      Approval Date: \{\{approval_date\}\}
      
      CONTACT INFORMATION:
      ===================
      Support Email: \{\{support_email\}\}
      Support Phone: \{\{support_phone\}\}
      
      VIEW LOAN DETAILS:
      ==================
      \{\{loan_url\}\}
      
      NEXT STEPS:
      ===========
      - Review your loan agreement carefully
      - Sign the loan documents
      - Funds will be disbursed within 2-3 business days
      - Set up automatic payments for convenience
      
      NEED HELP?
      ==========
      Contact our support team at \{\{support_email\}\} or call \{\{support_phone\}\}.
      
      ---
      © 2024 BuffrLend. All rights reserved.
      Powered by BuffrLend - lend.buffr.ai
      This email was sent from noreply@mail.buffr.ai
    `
  },

  partner_summary: {
    subject: 'Monthly Loan Summary - \{\{month\}\} \{\{year\}\}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">📊 Monthly Loan Summary</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">\{\{company_name\}\} - \{\{month\}\} \{\{year\}\}</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello \{\{partner_name\}\},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Here's your monthly loan summary for <strong>\{\{company_name\}\}</strong> for \{\{month\}\} \{\{year\}\}.
          </p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0;">
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-top: 4px solid #4caf50;">
              <h3 style="color: #4caf50; margin: 0 0 10px 0; font-size: 24px;">\{\{total_active_loans\}\}</h3>
              <p style="color: #666; margin: 0;">Active Loans</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-top: 4px solid #2196f3;">
              <h3 style="color: #2196f3; margin: 0 0 10px 0; font-size: 24px;">N$\{\{total_loan_amount\}\}</h3>
              <p style="color: #666; margin: 0;">Total Loan Amount</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-top: 4px solid #ff9800;">
              <h3 style="color: #ff9800; margin: 0 0 10px 0; font-size: 24px;">N$\{\{total_monthly_payments\}\}</h3>
              <p style="color: #666; margin: 0;">Monthly Payments</p>
            </div>
            <div style="background: white; padding: 20px; border-radius: 8px; text-align: center; border-top: 4px solid #9c27b0;">
              <h3 style="color: #9c27b0; margin: 0 0 10px 0; font-size: 24px;">\{\{new_loans_this_month\}\}</h3>
              <p style="color: #666; margin: 0;">New Loans This Month</p>
            </div>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">📈 Performance Metrics</h3>
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
              <span style="color: #666;">Completed Loans This Month:</span>
              <span style="font-weight: bold; color: #4caf50;">\{\{completed_loans_this_month\}\}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
              <span style="color: #666;">Default Rate:</span>
              <span style="font-weight: bold; color: #f44336;">\{\{default_rate\}\}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
              <span style="color: #666;">Average Loan Amount:</span>
              <span style="font-weight: bold; color: #2196f3;">N$\{\{average_loan_amount\}\}</span>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="\{\{dashboard_url\}\}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              📊 View Full Dashboard
            </a>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">📞 Partner Support</h3>
            <p style="color: #666; margin: 0;">
              Questions about your loan portfolio?<br>
              📧 \{\{support_email\}\}<br>
              📱 \{\{support_phone\}\}
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
      Monthly Loan Summary - \{\{month\}\} \{\{year\}\}
      
      Hello \{\{partner_name\}\},
      
      Here's your monthly loan summary for \{\{company_name\}\} for \{\{month\}\} \{\{year\}\}.
      
      Key Metrics:
      - Active Loans: \{\{total_active_loans\}\}
      - Total Loan Amount: N$\{\{total_loan_amount\}\}
      - Monthly Payments: N$\{\{total_monthly_payments\}\}
      - New Loans This Month: \{\{new_loans_this_month\}\}
      - Completed Loans This Month: \{\{completed_loans_this_month\}\}
      - Default Rate: \{\{default_rate\}\}%
      - Average Loan Amount: N$\{\{average_loan_amount\}\}
      
      View your full dashboard: \{\{dashboard_url\}\}
      
      Partner Support:
      Email: \{\{support_email\}\}
      Phone: \{\{support_phone\}\}
      
      Best regards,
      BuffrLend Team
    `
  },

  employee_loan_confirmation: {
    subject: 'Loan Approved - Salary Deduction Authorized - N$\{\{loan_amount\}\}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Loan Approved!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Salary Deduction Authorized</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Congratulations \{\{employee_name\}\}!</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            Your loan application has been approved and salary deduction has been authorized by <strong>\{\{company_name\}\}</strong>.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4caf50;">
            <h3 style="color: #333; margin-top: 0;">📋 Loan Details</h3>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Application ID:</span>
              <span style="font-weight: bold;">\{\{application_id\}\}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Loan Amount:</span>
              <span style="font-weight: bold; color: #4caf50;">N$\{\{loan_amount\}\}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Loan Term:</span>
              <span style="font-weight: bold;">\{\{loan_term\}\} months</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Monthly Payment:</span>
              <span style="font-weight: bold; color: #2196f3;">N$\{\{monthly_payment\}\}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Salary Deduction Starts:</span>
              <span style="font-weight: bold;">\{\{salary_deduction_start_date\}\}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Next Payment:</span>
              <span style="font-weight: bold;">\{\{next_payment_date\}\}</span>
            </div>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-weight: bold;">
              💡 Your monthly payment of N$\{\{monthly_payment\}\} will be automatically deducted from your salary starting \{\{salary_deduction_start_date\}\}.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="\{\{loan_url\}\}" style="background: linear-gradient(135deg, #4caf50 0%, #45a049 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              📊 View Loan Details
            </a>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">📞 Need Help?</h3>
            <p style="color: #666; margin: 0;">
              Questions about your loan?<br>
              📧 \{\{support_email\}\}<br>
              📱 \{\{support_phone\}\}
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
      Loan Approved - Salary Deduction Authorized
      
      Congratulations \{\{employee_name\}\}!
      
      Your loan application has been approved and salary deduction has been authorized by \{\{company_name\}\}.
      
      Loan Details:
      - Application ID: \{\{application_id\}\}
      - Loan Amount: N$\{\{loan_amount\}\}
      - Loan Term: \{\{loan_term\}\} months
      - Monthly Payment: N$\{\{monthly_payment\}\}
      - Salary Deduction Starts: \{\{salary_deduction_start_date\}\}
      - Next Payment: \{\{next_payment_date\}\}
      
      Your monthly payment of N$\{\{monthly_payment\}\} will be automatically deducted from your salary starting \{\{salary_deduction_start_date\}\}.
      
      View your loan details: \{\{loan_url\}\}
      
      Need help? Contact us:
      Email: \{\{support_email\}\}
      Phone: \{\{support_phone\}\}
      
      Best regards,
      BuffrLend Team
    `
  },

  salary_deduction_authorization: {
    subject: 'Salary Deduction Authorization Required - \{\{employee_name\}\} - N$\{\{loan_amount\}\}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">⚡ Authorization Required</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Salary Deduction Request</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello \{\{partner_name\}\},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            An employee at <strong>\{\{company_name\}\}</strong> has requested a loan and requires salary deduction authorization.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
            <h3 style="color: #333; margin-top: 0;">👤 Employee Details</h3>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Name:</span>
              <span style="font-weight: bold;">\{\{employee_name\}\}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Employee ID:</span>
              <span style="font-weight: bold;">\{\{employee_id\}\}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Loan Amount:</span>
              <span style="font-weight: bold; color: #4caf50;">N$\{\{loan_amount\}\}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Monthly Payment:</span>
              <span style="font-weight: bold; color: #2196f3;">N$\{\{monthly_payment\}\}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Deduction Start Date:</span>
              <span style="font-weight: bold;">\{\{salary_deduction_start_date\}\}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Application ID:</span>
              <span style="font-weight: bold;">\{\{application_id\}\}</span>
            </div>
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-weight: bold;">
              ⚠️ Action Required: Please authorize the salary deduction of N$\{\{monthly_payment\}\} per month starting \{\{salary_deduction_start_date\}\}.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="\{\{authorization_url\}\}" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              ✅ Authorize Salary Deduction
            </a>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">📞 Partner Support</h3>
            <p style="color: #666; margin: 0;">
              Questions about salary deductions?<br>
              📧 \{\{support_email\}\}<br>
              📱 \{\{support_phone\}\}
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
      Salary Deduction Authorization Required
      
      Hello \{\{partner_name\}\},
      
      An employee at \{\{company_name\}\} has requested a loan and requires salary deduction authorization.
      
      Employee Details:
      - Name: \{\{employee_name\}\}
      - Employee ID: \{\{employee_id\}\}
      - Loan Amount: N$\{\{loan_amount\}\}
      - Monthly Payment: N$\{\{monthly_payment\}\}
      - Deduction Start Date: \{\{salary_deduction_start_date\}\}
      - Application ID: \{\{application_id\}\}
      
      Action Required: Please authorize the salary deduction of N$\{\{monthly_payment\}\} per month starting \{\{salary_deduction_start_date\}\}.
      
      Authorize here: \{\{authorization_url\}\}
      
      Partner Support:
      Email: \{\{support_email\}\}
      Phone: \{\{support_phone\}\}
      
      Best regards,
      BuffrLend Team
    `
  },

  partner_payment_reminder: {
    subject: 'Payment Reminder - N$\{\{total_amount\}\} Due - \{\{company_name\}\}',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">⏰ Payment Reminder</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Salary Deductions Due</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello \{\{partner_name\}\},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This is a reminder that salary deductions for <strong>\{\{company_name\}\}</strong> are due.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f44336;">
            <h3 style="color: #333; margin-top: 0;">💰 Payment Summary</h3>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Total Amount Due:</span>
              <span style="font-weight: bold; color: #f44336; font-size: 18px;">N$\{\{total_amount\}\}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Number of Deductions:</span>
              <span style="font-weight: bold;">\{\{pending_payments_count\}\}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span style="color: #666;">Due Date:</span>
              <span style="font-weight: bold;">\{\{due_date\}\}</span>
            </div>
          </div>
          
          <div style="background: #ffebee; border: 1px solid #ffcdd2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #c62828; margin: 0; font-weight: bold;">
              ⚠️ Please ensure salary deductions are processed by \{\{due_date\}\} to avoid any delays.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="\{\{payment_url\}\}" style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              💳 Process Payments
            </a>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">📞 Partner Support</h3>
            <p style="color: #666; margin: 0;">
              Need assistance with payments?<br>
              📧 \{\{support_email\}\}<br>
              📱 \{\{support_phone\}\}
            </p>
          </div>
        </div>
      </div>
    `,
    text: `
      Payment Reminder - Salary Deductions Due
      
      Hello \{\{partner_name\}\},
      
      This is a reminder that salary deductions for \{\{company_name\}\} are due.
      
      Payment Summary:
      - Total Amount Due: N$\{\{total_amount\}\}
      - Number of Deductions: \{\{pending_payments_count\}\}
      - Due Date: \{\{due_date\}\}
      
      Please ensure salary deductions are processed by \{\{due_date\}\} to avoid any delays.
      
      Process payments here: \{\{payment_url\}\}
      
      Partner Support:
      Email: \{\{support_email\}\}
      Phone: \{\{support_phone\}\}
      
      Best regards,
      BuffrLend Team
    `
  }
};
