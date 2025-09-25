'use client';

// Icons will be imported when needed

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { CRMLayout } from '@/components/layout/crm-layout';
import { ContactCard } from '@/components/crm/contacts/ContactCard';
import { Contact, ContactInsert } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setError('Failed to fetch contacts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || contact.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleAddContact = async (contactData: ContactInsert) => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert([contactData])
        .select()
        .single();

      if (error) throw error;
      
      setContacts(prev => [data, ...prev]);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding contact:', error);
      setError('Failed to add contact. Please try again.');
    }
  };

  const handleEditContact = async (contact: Contact) => {
    // Edit contact in database
    console.log('Edit contact:', contact);
  };

  const handleViewDetails = async (contact: Contact) => {
    // Navigate to contact details page
    console.log('View details:', contact);
  };

  const handleLogInteraction = async (contact: Contact) => {
    // Open interaction logging modal
    console.log('Log interaction:', contact);
  };

  const getContactTypeStats = () => {
    const stats = contacts.reduce((acc, contact) => {
      acc[contact.type] = (acc[contact.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return stats;
  };

  const stats = getContactTypeStats();

  return (
    <CRMLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
            <p className="text-gray-600">Manage your contacts and relationships</p>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            Add Contact
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-medium">👥</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-medium">🏢</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Employers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.employer || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-sm font-medium">🤝</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Partners</p>
                <p className="text-2xl font-bold text-gray-900">{stats.partner || 0}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <span className="text-orange-600 text-sm font-medium">👤</span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Individuals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.individual || 0}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="individual">Individual</option>
              <option value="employer">Employer</option>
              <option value="partner">Partner</option>
              <option value="referral">Referral</option>
            </select>
          </div>
        </Card>

        {/* Contacts List */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading contacts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onEdit={handleEditContact}
                onViewDetails={handleViewDetails}
                onLogInteraction={handleLogInteraction}
              />
            ))}
          </div>
        )}

        {filteredContacts.length === 0 && !loading && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No contacts found</p>
            <Button 
              className="mt-4" 
              onClick={() => setShowAddForm(true)}
            >
              Add Your First Contact
            </Button>
          </Card>
        )}

        {/* Add Contact Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md p-6">
              <h3 className="text-lg font-semibold mb-4">Add New Contact</h3>
              <ContactForm
                onSubmit={handleAddContact}
                onCancel={() => setShowAddForm(false)}
              />
            </Card>
          </div>
        )}
      </div>
    </CRMLayout>
  );
}

// Simple contact form component
function ContactForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (data: ContactInsert) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<ContactInsert>({
    type: 'individual',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    position: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <Input
            value={formData.first_name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <Input
            value={formData.last_name || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Type
        </label>
        <select 
          value={formData.type} 
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="individual">Individual</option>
          <option value="employer">Employer</option>
          <option value="partner">Partner</option>
          <option value="referral">Referral</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <Input
          value={formData.phone || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
        />
      </div>

      {formData.type === 'employer' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <Input
              value={formData.company_name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <Input
              value={formData.position || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={formData.notes || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        />
      </div>

      <div className="flex space-x-3">
        <Button type="submit" className="flex-1">
          Add Contact
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </form>
  );
}
