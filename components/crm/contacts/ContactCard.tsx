'use client';

import { useState } from 'react';
import { Contact } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ContactCardProps {
  contact: Contact;
  onEdit?: (contact: Contact) => void;
  onViewDetails?: (contact: Contact) => void;
  onLogInteraction?: (contact: Contact) => void;
}

export function ContactCard({ 
  contact, 
  onEdit, 
  onViewDetails, 
  onLogInteraction 
}: ContactCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getContactTypeColor = (type: string) => {
    const colors = {
      'individual': 'bg-blue-100 text-blue-800',
      'employer': 'bg-green-100 text-green-800',
      'partner': 'bg-purple-100 text-purple-800',
      'referral': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRelationshipStageColor = (stage: string) => {
    const colors = {
      'prospect': 'bg-yellow-100 text-yellow-800',
      'lead': 'bg-blue-100 text-blue-800',
      'customer': 'bg-green-100 text-green-800',
      'partner': 'bg-purple-100 text-purple-800',
      'inactive': 'bg-gray-100 text-gray-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">
              {contact.first_name} {contact.last_name}
            </h3>
            <Badge className={getContactTypeColor(contact.type)}>
              {contact.type}
            </Badge>
          </div>
          
          {contact.company_name && (
            <p className="text-sm text-gray-600 mb-1">
              {contact.company_name}
            </p>
          )}
          
          {contact.position && (
            <p className="text-sm text-gray-500 mb-2">
              {contact.position}
            </p>
          )}

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {contact.email && (
              <span>📧 {contact.email}</span>
            )}
            {contact.phone && (
              <span>📞 {contact.phone}</span>
            )}
          </div>

          {contact.relationship_stage && (
            <div className="mt-2">
              <Badge className={getRelationshipStageColor(contact.relationship_stage)}>
                {contact.relationship_stage}
              </Badge>
            </div>
          )}

          {showDetails && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              {contact.notes && (
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Notes:</strong> {contact.notes}
                </p>
              )}
              
              {contact.tags && contact.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {contact.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {contact.last_contact_date && (
                <p className="text-xs text-gray-500">
                  Last contact: {new Date(contact.last_contact_date).toLocaleDateString()}
                </p>
              )}

              {contact.next_follow_up && (
                <p className="text-xs text-blue-600">
                  Next follow-up: {new Date(contact.next_follow_up).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
          
          {onLogInteraction && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLogInteraction(contact)}
            >
              Log Interaction
            </Button>
          )}
          
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(contact)}
            >
              Edit
            </Button>
          )}
          
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(contact)}
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
