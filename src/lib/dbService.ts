import { db } from './firebase';
import { ref, push, get, child } from 'firebase/database';

export const createLead = async (lead: any) => {
  const leadsRef = ref(db, 'leads');
  const enrichedLead = {
    ...lead,
    title: lead.propertyName || 'General Inquiry',
    ownerId: 'website',
    stage: 'New',
    source: 'Website',
    status: 'Pending',
    stageHistory: [{ stage: 'New', changedAt: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
    timestamp: Date.now()
  };
  await push(leadsRef, enrichedLead);
};
