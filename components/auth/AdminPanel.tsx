/**
 * Admin Panel Component for Buffr Applications
 * 
 * This component provides admin functionality for user management,
 * role assignment, and system administration.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/lib/contexts/auth-context';
import { UserProfile, UserRole } from '@/lib/auth/types';
import { formatDisplayName, getRoleDisplayName, getRoleColor, formatDateTime } from '@/lib/auth/utils';
import { Loader2, Users, Shield, Settings, Plus, Search, Mail, Phone, Building } from 'lucide-react';

interface AdminPanelProps {
  className?: string;
}

interface UserListProps {
  users: UserProfile[];
  onPromote: (userId: string) => void;
  onDemote: (userId: string) => void;
  loading: boolean;
}

function UserList({ users, onPromote, onDemote, loading }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'all'>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as UserRole | 'all')}
          className="px-3 py-2 border border-input bg-background rounded-md"
        >
          <option value="all">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
          <option value="super_admin">Super Admins</option>
        </select>
      </div>

      {/* Users List */}
      <div className="space-y-2">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user.first_name[0]}{user.last_name[0]}
                  </span>
                </div>
                <div>
                  <div className="font-medium">{formatDisplayName(user)}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Phone className="h-3 w-3" />
                      {user.phone}
                    </div>
                  )}
                  {user.company_name && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Building className="h-3 w-3" />
                      {user.company_name}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getRoleColor(user.role)}>
                  {getRoleDisplayName(user.role)}
                </Badge>
                <div className="text-xs text-muted-foreground">
                  {formatDateTime(user.created_at)}
                </div>
                {user.role === 'user' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onPromote(user.id)}
                  >
                    Promote
                  </Button>
                )}
                {(user.role === 'admin' || user.role === 'super_admin') && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onDemote(user.id)}
                  >
                    Demote
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found matching your criteria.
        </div>
      )}
    </div>
  );
}

function CreateAdminForm({ onCreateAdmin }: { onCreateAdmin: (data: Record<string, string>) => void }) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'admin' as UserRole
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onCreateAdmin(formData);
      setFormData({ email: '', firstName: '', lastName: '', role: 'admin' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Admin User
        </CardTitle>
        <CardDescription>
          Create a new admin user with @buffr.ai email domain
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@buffr.ai"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Must be a @buffr.ai email address
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as UserRole }))}
              className="w-full px-3 py-2 border border-input bg-background rounded-md"
              disabled={isSubmitting}
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Admin User'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export function AdminPanel({ className = "" }: AdminPanelProps) {
  const { 
    user, 
    isAdmin, 
    adminLevel, 
    canAccessAdminPanel, 
    // canManageUsers,
    // canManageSuperAdmins,
    // createAdminUser,
    // promoteToAdmin,
    // demoteFromAdmin
  } = useAuth();

  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin && canAccessAdminPanel) {
      loadUsers();
    }
  }, [isAdmin, canAccessAdminPanel]);

  // Check if user has admin access
  if (!isAdmin || !canAccessAdminPanel) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You don&apos;t have permission to access the admin panel.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleCreateAdmin = async (_data: Record<string, string>) => {
    try {
      // const result = await createAdminUser(data.email, data.firstName, data.lastName, data.role);
      const result = { error: 'Not implemented' };
      if (!result.error) {
        // Refresh users list
        await loadUsers();
      }
    } catch (error) {
      console.error('Failed to create admin user:', error);
    }
  };

  const handlePromoteUser = async (_userId: string) => {
    try {
      // const result = await promoteToAdmin(userId);
      const result = { error: 'Not implemented' };
      if (!result.error) {
        // Refresh users list
        await loadUsers();
      }
    } catch (error) {
      console.error('Failed to promote user:', error);
    }
  };

  const handleDemoteUser = async (_userId: string) => {
    try {
      // const result = await demoteFromAdmin(userId);
      const result = { error: 'Not implemented' };
      if (!result.error) {
        // Refresh users list
        await loadUsers();
      }
    } catch (error) {
      console.error('Failed to demote user:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      // This would typically fetch from an API endpoint
      // For now, we'll use a placeholder
      setUsers([]);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Admin Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Admin Panel
              </CardTitle>
              <CardDescription>
                Welcome, {user?.first_name}. You have {adminLevel} privileges.
              </CardDescription>
            </div>
            <Badge variant="outline" className={getRoleColor(user?.role || 'user')}>
              {getRoleDisplayName(user?.role || 'user')}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Admin Tabs */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          {adminLevel === 'super_admin' && (
            <TabsTrigger value="create-admin" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Admin
            </TabsTrigger>
          )}
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          {isAdmin ? (
            <UserList
              users={users}
              onPromote={handlePromoteUser}
              onDemote={handleDemoteUser}
              loading={loading}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Permission</h3>
                <p className="text-muted-foreground">
                  You don&apos;t have permission to manage users.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {adminLevel === 'super_admin' && (
          <TabsContent value="create-admin">
            <CreateAdminForm onCreateAdmin={handleCreateAdmin} />
          </TabsContent>
        )}

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>
                Configure admin panel settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Admin Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {formatDisplayName(user!)}</div>
                    <div><strong>Email:</strong> {user?.email}</div>
                    <div><strong>Role:</strong> {getRoleDisplayName(user?.role || 'user')}</div>
                    <div><strong>Admin Level:</strong> {adminLevel}</div>
                    <div><strong>Last Login:</strong> {user?.last_login_at ? formatDateTime(user.last_login_at) : 'Never'}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
