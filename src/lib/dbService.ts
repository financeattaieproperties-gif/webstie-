const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export const createLead = async (lead: {
  name: string;
  email: string;
  phone: string;
  message?: string;
  propertyId?: string;
  propertyName?: string;
}) => {
  const response = await fetch(`${API_BASE}/submit-lead.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...lead,
      title: lead.propertyName || 'General Inquiry',
      stage: 'New',
      source: 'Website',
      status: 'Pending',
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to submit inquiry');
  }
  return response.json();
};
