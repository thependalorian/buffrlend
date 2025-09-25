"use client";

import React, { useState } from 'react';
import { ArrowRight, Shield, Zap, Globe, Users, CheckCircle, Calculator, Menu, X, Clock, Award } from 'lucide-react';
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import LoanCalculator from "@/components/loan-calculator";
import CompanyLookup from "@/components/company-lookup";

import { GoogleSignupButton } from "@/components/auth/google-signup-button";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 text-white overflow-hidden">


      {/* Navigation */}
      <nav className="navbar bg-base-100/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </div>
            {mobileMenuOpen && (
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100/90 backdrop-blur-lg rounded-box w-52">
                <li><a href="#features" className="text-white/80 hover:text-white">Features</a></li>
                <li><a href="#demo" className="text-white/80 hover:text-white">Demo</a></li>
                <li><a href="#pricing" className="text-white/80 hover:text-white">Pricing</a></li>
                <li><button className="btn btn-outline btn-sm w-full">Sign In</button></li>
                <li><button className="btn btn-primary btn-sm w-full">Get Started</button></li>
              </ul>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              BuffrLend
            </Link>
            <span className="badge badge-primary badge-sm">
              AI-Powered
            </span>
          </div>
        </div>
        
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 space-x-8">
            <li><a href="#calculator" className="text-white/80 hover:text-white transition-colors">Calculate</a></li>
            <li><a href="#employer-search" className="text-white/80 hover:text-white transition-colors">Employers</a></li>
            <li><a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a></li>
            <li><a href="#kyc" className="text-white/80 hover:text-white transition-colors">How It Works</a></li>
          </ul>
        </div>
        
        <div className="navbar-end">
          <div className="flex items-center space-x-4">
            <ThemeSwitcher />
            <button className="btn btn-outline btn-sm" onClick={() => window.location.href = '/auth/login'}>Sign In</button>
            <button className="btn btn-primary btn-sm" onClick={() => window.location.href = '/auth/signup'}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero min-h-screen relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="hero-content text-center lg:text-left max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
                <Shield className="h-4 w-4 text-success" />
                <span className="text-sm font-medium">NAMFISA Licensed • CC/2024/09322</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-8">
                <span className="block text-white">Fast, Fair, and</span>
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Responsible Lending
                </span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-2xl mb-6 leading-relaxed">
                Quick loans for private sector employees
              </p>
              
              <p className="text-lg text-gray-400 max-w-2xl mb-10 leading-relaxed">
                Get the cash you need with transparent 15% interest + third-party fees. No credit bureau checks. 
                Automated salary deduction. Apply in minutes.
              </p>

              {/* Primary CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <button className="btn btn-primary btn-lg group" onClick={() => document.getElementById('loan-application')?.scrollIntoView({ behavior: 'smooth' })}>
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="btn btn-outline btn-lg" onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate Loan
                </button>
              </div>

              {/* Secondary CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                <button className="btn btn-ghost btn-lg" onClick={() => window.location.href = '/auth/signup'}>
                  <Users className="mr-2 h-5 w-5" />
                  Create Account
                </button>
                <button className="btn btn-ghost btn-lg" onClick={() => document.getElementById('employer-search')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Globe className="mr-2 h-5 w-5" />
                  Search Employer
                </button>
              </div>

              {/* Value Proposition */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-success mb-1">15%</div>
                    <div className="text-sm text-gray-300">Interest + Fees</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary mb-1">24hrs</div>
                    <div className="text-sm text-gray-300">Approval Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-secondary mb-1">N$10K</div>
                    <div className="text-sm text-gray-300">Max Loan Amount</div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-success" />
                  NAMFISA Regulated
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  No Credit Bureau Checks
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-secondary" />
                  Automated Salary Deduction
                </div>
              </div>
            </div>

            {/* Right Column - Visual Money Flow */}
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/maiye-jeremiah--jyVPJozxCg-unsplash.jpg" 
                  alt="Professional man with glasses looking at his phone, representing loan approval and financial success" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-black/80 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-white font-bold">N$5,000 APPROVED!</div>
                  </div>
                  <p className="text-white/90 text-sm">Money deposited in 18 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Why Buffr? Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-base-200/10 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Why Choose Buffr?</h2>
          <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto">
            Fast, Fair, and Responsible Lending for private sector employees in Namibia. 
            Transparent rates, no credit bureau checks, and automated salary deduction.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-4">NAMFISA Licensed</h3>
              <p className="text-gray-300">Licensed and regulated for your protection.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calculator className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">15% Interest + Fees</h3>
              <p className="text-gray-300">Transparent pricing: 15% interest plus third-party fees (disbursement, stamp duty, regulatory levies).</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">24-Hour Approval</h3>
              <p className="text-gray-300">Fast approval and disbursement process.</p>
            </div>
          </div>

        </div>
      </section>


      {/* Features Section */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-base-200/20 backdrop-blur-sm relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Why Choose Buffr?</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              When you need money, you need it fast. No stress, no surprises, just cash in your account.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                title: "No ITC Check", 
                description: "Your credit history doesn't matter. We look at your job and salary, not your past mistakes.",
                color: "bg-primary"
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: "No Stress Payments",
                description: "Money comes straight from your salary. No remembering due dates, no late fees, no stress.",
                color: "bg-warning"
              },
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Apply Anywhere",
                description: "On your phone, on your computer, wherever you are. No need to visit a branch or wait in line.",
                color: "bg-accent"
              }
            ].map((feature, index) => (
              <div key={index} className="card bg-base-100/20 backdrop-blur-sm border border-white/10 hover:scale-105 transition-all duration-300">
                <div className="card-body">
                  <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    {feature.icon}
                  </div>
                  <h3 className="card-title text-xl mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <div id="calculator" className="mb-24 relative z-10">
        
        <div className="space-y-16">
          {/* Loan Calculator */}
          <div className="relative">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-4 py-2 mb-6">
                <Calculator className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Interactive Calculator</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">Calculate Your Loan</h3>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                See exactly how much you can borrow and what your monthly payments will be. 
                Transparent calculations with no hidden fees.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <LoanCalculator />
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  Real-time Calculations
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-primary" />
                  Transparent Rates
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-secondary" />
                  Transparent Pricing
                </div>
              </div>
            </div>
          </div>

          {/* Company Lookup */}
          <div id="employer-search" className="relative">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-secondary/10 backdrop-blur-sm border border-secondary/20 rounded-full px-4 py-2 mb-6">
                <Users className="h-4 w-4 text-secondary" />
                <span className="text-sm font-medium">Employer Search</span>
              </div>
              <h3 className="text-3xl font-bold mb-4">Find Your Employer</h3>
              <p className="text-gray-300 max-w-2xl mx-auto text-lg">
                Check if your employer is already partnered with Buffr for seamless loan applications 
                and automated salary deduction.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <CompanyLookup />
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-success" />
                  Verified Partners
                </div>
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-2 text-primary" />
                  Secure Verification
                </div>
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-secondary" />
                  Instant Results
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {/* Bottom CTA */}
      <section id="loan-application" className="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="card bg-base-100/20 backdrop-blur-sm border border-white/10 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary to-secondary"></div>
            </div>
            
            <div className="card-body relative z-10">
              <div className="badge badge-success badge-lg mb-8">
                <CheckCircle className="h-4 w-4 mr-2" />
                Ready to Get Started?
              </div>
              
              <h2 className="text-4xl font-bold mb-6">
                Ready for Fast, Fair, and
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Responsible Lending?
                </span>
              </h2>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Get the cash you need with transparent 15% interest + third-party fees. No credit bureau checks. 
                Automated salary deduction. Apply in minutes.
              </p>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <button className="btn btn-primary btn-lg w-full sm:w-auto" onClick={() => window.location.href = '/auth/signup'}>
                    Apply Now - 15% Interest + Fees
                    <ArrowRight className="ml-2 h-6 w-6" />
                  </button>
                  
                  <div className="text-gray-300 text-sm">or</div>
                  
                  <div className="w-full sm:w-auto">
                    <GoogleSignupButton
                      variant="outline"
                      className="btn-lg w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20"
                      onSuccess={() => {
                        window.location.href = '/dashboard';
                      }}
                      onError={(error) => {
                        console.error('Google sign-up error:', error);
                        // You could show a toast notification here
                      }}
                    />
                  </div>
                </div>
                
                <div className="text-sm text-gray-400">
                  ✓ NAMFISA Licensed ✓ No Credit Bureau Checks ✓ Automated Salary Deduction ✓ Apply in Minutes
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center items-center gap-6 mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center text-sm text-gray-400">
                  <Shield className="h-4 w-4 mr-2 text-success" />
                  NAMFISA Licensed
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2 text-primary" />
                  CC/2024/09322
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <CheckCircle className="h-4 w-4 mr-2 text-secondary" />
                  Responsible Lending
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200/30 backdrop-blur-sm border-t border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
                BuffrLend
              </div>
              <p className="text-gray-300 max-w-md">
                Buffr Financial Services CC - NAMFISA Licensed micro-lender 
                providing transparent, responsible lending to private sector employees.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Personal Loans</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Loan Calculator</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rates & Terms</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 BuffrLend. All rights reserved.
            </div>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
