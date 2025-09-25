'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  FileText, 
  CreditCard, 
  History, 
  Shield, 
  Settings,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
}

const navigationItems: NavigationItem[] = [
  {
    name: 'Dashboard',
    href: '/protected/dashboard',
    icon: Home,
    roles: ['user', 'admin', 'super_admin']
  },
  {
    name: 'Apply for Loan',
    href: '/protected/loan-application',
    icon: FileText,
    roles: ['user']
  },
  {
    name: 'Loan History',
    href: '/protected/loan-history',
    icon: History,
    roles: ['user', 'admin', 'super_admin']
  },
  {
    name: 'Payments',
    href: '/protected/payments',
    icon: CreditCard,
    roles: ['user', 'admin', 'super_admin']
  },
  {
    name: 'KYC Verification',
    href: '/protected/kyc-verification',
    icon: Shield,
    roles: ['user', 'admin', 'super_admin']
  },
  {
    name: 'Documents',
    href: '/protected/documents',
    icon: FileText,
    roles: ['user', 'admin', 'super_admin']
  },
  {
    name: 'Help & Support',
    href: '/protected/help',
    icon: Settings,
    roles: ['user', 'admin', 'super_admin']
  }
];

const adminNavigationItems: NavigationItem[] = [
  {
    name: 'Admin Dashboard',
    href: '/protected/admin',
    icon: Settings,
    roles: ['admin', 'super_admin']
  },
  {
    name: 'CRM',
    href: '/protected/admin/crm',
    icon: User,
    roles: ['admin', 'super_admin']
  },
  {
    name: 'KYC Management',
    href: '/protected/admin/kyc',
    icon: Shield,
    roles: ['admin', 'super_admin']
  },
  {
    name: 'Verification',
    href: '/protected/admin/verification',
    icon: Shield,
    roles: ['admin', 'super_admin']
  }
];

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, signOut, isRole } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getFilteredNavigationItems = () => {
    if (!user) return [];
    
    const userRole = user.role || 'user';
    return navigationItems.filter(item => 
      !item.roles || item.roles.includes(userRole)
    );
  };

  const getFilteredAdminItems = () => {
    if (!user) return [];
    
    const userRole = user.role || 'user';
    return adminNavigationItems.filter(item => 
      !item.roles || item.roles.includes(userRole)
    );
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/protected/dashboard" className="text-xl font-bold text-blue-600">
                BuffrLend
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {getFilteredNavigationItems().map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.href)
                        ? 'border-blue-500 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
              
              {/* Admin navigation */}
              {isRole('admin') && (
                <>
                  <div className="border-l border-gray-300 mx-4"></div>
                  {getFilteredAdminItems().map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 ${
                          isActive(item.href)
                            ? 'border-blue-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {item.name}
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* User menu */}
          <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700">
                {user.first_name} {user.last_name}
              </span>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {user.role}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 bg-white border-t">
            {getFilteredNavigationItems().map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
                    isActive(item.href)
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </div>
                </Link>
              );
            })}
            
            {/* Admin mobile navigation */}
            {isRole('admin') && (
              <>
                <div className="border-t border-gray-200 my-2"></div>
                <div className="pl-3 pr-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Admin
                </div>
                {getFilteredAdminItems().map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block pl-6 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200 ${
                        isActive(item.href)
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center">
                        <Icon className="w-4 h-4 mr-3" />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </>
            )}
            
            {/* Mobile user info and sign out */}
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4">
                <User className="w-4 h-4 text-gray-500 mr-2" />
                <div className="text-base font-medium text-gray-800">
                  {user.first_name} {user.last_name}
                </div>
                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {user.role}
                </span>
              </div>
              <div className="mt-3 px-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
