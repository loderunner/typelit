import { typelit } from '../../src/typelit';

/**
 * Customer Support Response Generator Example
 *
 * Demonstrates:
 * - Company tone and brand voice consistency
 * - Product context and knowledge base integration
 * - Priority and urgency handling
 * - Multi-level context nesting
 */

type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
type TicketCategory =
  | 'technical'
  | 'billing'
  | 'feature-request'
  | 'bug-report'
  | 'general-inquiry';
type CompanyTone = 'professional' | 'friendly' | 'casual' | 'empathetic' | 'formal';

type CustomerTicket = {
  id: string;
  subject: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  customerHistory: {
    accountAge: string;
    previousTickets: number;
    lifetimeValue: number;
    currentPlan: string;
  };
};

type CustomerInfo = {
  name: string;
  email: string;
  preferredLanguage: string;
  timezone: string;
};

type ProductContext = {
  name: string;
  relevantFeatures: string[];
  knownIssues?: string[];
  recentUpdates?: string[];
  documentationLinks: string[];
};

type CompanyGuidelines = {
  tone: CompanyTone;
  brandVoice: string[];
  doNotSay: string[];
  alwaysInclude: string[];
  escalationCriteria?: string[];
};

export const customerSupportPrompt = typelit`You are a customer support specialist crafting a response to a customer ticket.

TICKET INFORMATION
Ticket ID: ${typelit.string('ticket', 'id')}
Subject: ${typelit.string('ticket', 'subject')}
Category: ${typelit.string('ticket', 'category')}
Priority: ${typelit.string('ticket', 'priority')}

Customer Issue:
${typelit.string('ticket', 'description')}

CUSTOMER PROFILE
Name: ${typelit.string('customer', 'name')}
Email: ${typelit.string('customer', 'email')}
Preferred Language: ${typelit.string('customer', 'preferredLanguage')}
Timezone: ${typelit.string('customer', 'timezone')}

Customer History:
- Account Age: ${typelit.string('ticket', 'customerHistory', 'accountAge')}
- Previous Tickets: ${typelit.number('ticket', 'customerHistory', 'previousTickets')}
- Lifetime Value: $${typelit.number('ticket', 'customerHistory', 'lifetimeValue')}
- Current Plan: ${typelit.string('ticket', 'customerHistory', 'currentPlan')}

PRODUCT CONTEXT
Product: ${typelit.string('product', 'name')}

Relevant Features:
${typelit.json('product', 'relevantFeatures')}

${typelit.string('knownIssuesInfo')}

${typelit.string('recentUpdatesInfo')}

Documentation Resources:
${typelit.json('product', 'documentationLinks')}

RESPONSE GUIDELINES
Company Tone: ${typelit.string('guidelines', 'tone')}

Brand Voice Principles:
${typelit.json('guidelines', 'brandVoice')}

Do NOT say:
${typelit.json('guidelines', 'doNotSay')}

Always Include:
${typelit.json('guidelines', 'alwaysInclude')}

${typelit.string('escalationInfo')}

---

Please compose a customer support response that:
1. Acknowledges the customer's issue with appropriate empathy
2. Provides a clear, actionable solution or next steps
3. Maintains the specified tone and brand voice
4. References relevant documentation or resources
5. Sets appropriate expectations for resolution
6. Includes any necessary follow-up information

The response should make the customer feel heard, supported, and confident in the solution.`;

// Helper functions for optional fields
export const formatKnownIssues = (knownIssues?: string[]) =>
  knownIssues && knownIssues.length > 0
    ? `\nKnown Issues:\n${JSON.stringify(knownIssues, null, 2)}`
    : '';

export const formatRecentUpdates = (recentUpdates?: string[]) =>
  recentUpdates && recentUpdates.length > 0
    ? `\nRecent Updates:\n${JSON.stringify(recentUpdates, null, 2)}`
    : '';

export const formatEscalation = (escalationCriteria?: string[]) =>
  escalationCriteria && escalationCriteria.length > 0
    ? `\nEscalation Criteria:\n${JSON.stringify(escalationCriteria, null, 2)}`
    : '';

// Sample data - Technical support scenario
export const sampleTicket: CustomerTicket = {
  id: 'TICKET-2847',
  subject: 'Unable to export data from dashboard',
  description: `I've been trying to export my analytics data for the past hour, but every time I click the "Export to CSV" button, nothing happens. I need this data for a presentation tomorrow morning. 

I'm using Chrome on macOS. The dashboard loads fine, and I can see all my data, but the export just doesn't work. I've tried refreshing the page and even logging out and back in. Very frustrating!

This is the second time this month I've had issues with exports. Last time I had to reach out to support too.`,
  category: 'technical',
  priority: 'high',
  customerHistory: {
    accountAge: '2 years, 3 months',
    previousTickets: 5,
    lifetimeValue: 4800,
    currentPlan: 'Professional',
  },
};

export const sampleCustomer: CustomerInfo = {
  name: 'Jessica Martinez',
  email: 'jessica.martinez@techcorp.com',
  preferredLanguage: 'English',
  timezone: 'America/Los_Angeles (PST)',
};

export const sampleProduct: ProductContext = {
  name: 'Analytics Dashboard Pro',
  relevantFeatures: [
    'CSV Export',
    'PDF Export',
    'Scheduled Reports',
    'Data Filtering',
  ],
  knownIssues: [
    'Export button may not respond if dataset exceeds 100,000 rows without filtering',
    'Browser popup blockers can prevent download dialogs',
  ],
  recentUpdates: [
    'Added support for exporting filtered views (released 2 days ago)',
    'Fixed export timeout for large datasets (released 1 week ago)',
  ],
  documentationLinks: [
    'https://docs.example.com/exports/csv-format',
    'https://docs.example.com/exports/troubleshooting',
    'https://docs.example.com/exports/large-datasets',
  ],
};

export const sampleGuidelines: CompanyGuidelines = {
  tone: 'empathetic',
  brandVoice: [
    'Be genuinely helpful and solution-oriented',
    'Use clear, jargon-free language when possible',
    'Show personality while remaining professional',
    'Acknowledge frustration without being defensive',
  ],
  doNotSay: [
    '"Unfortunately" (sounds negative)',
    '"It should work" (dismissive)',
    '"You did it wrong" (blaming)',
    '"That\'s not possible" (unless absolutely true)',
  ],
  alwaysInclude: [
    'Personalized greeting using customer name',
    'Acknowledgment of the issue impact',
    'Clear next steps or solution',
    'Timeline for resolution',
    'Offer of additional assistance',
  ],
  escalationCriteria: [
    'Customer mentions legal action or regulatory complaints',
    'Issue affects multiple users or is a potential security concern',
    'Customer has enterprise plan with SLA requirements',
    'Request for refund or cancellation',
  ],
};

// Sample data - Billing inquiry scenario
export const sampleTicketBilling: CustomerTicket = {
  id: 'TICKET-2891',
  subject: 'Question about recent charge',
  description: `Hi, I noticed a charge of $199 on my credit card today, but I thought I was on the $99/month plan. Can you help me understand what this charge is for?

I've been very happy with the service, just want to make sure this is correct.`,
  category: 'billing',
  priority: 'medium',
  customerHistory: {
    accountAge: '6 months',
    previousTickets: 1,
    lifetimeValue: 594,
    currentPlan: 'Professional',
  },
};

export const sampleCustomerBilling: CustomerInfo = {
  name: 'Robert Chen',
  email: 'robert.chen@startup.io',
  preferredLanguage: 'English',
  timezone: 'America/New_York (EST)',
};

export const sampleGuidelinesFriendly: CompanyGuidelines = {
  tone: 'friendly',
  brandVoice: [
    'Conversational and warm',
    'Proactive and helpful',
    'Transparent about pricing and policies',
    'Builds trust through clarity',
  ],
  doNotSay: [
    '"You should have read the terms" (blaming)',
    '"There\'s nothing we can do" (inflexible)',
    'Anything that sounds like fine print justification',
  ],
  alwaysInclude: [
    'Clear explanation of the charge',
    'Reference to any plan changes or upgrades',
    'Offer to review account details',
    'Assistance with any adjustments if needed',
  ],
};

// Example usage
// const prompt = customerSupportPrompt({
//   ticket: sampleTicket,
//   customer: sampleCustomer,
//   product: sampleProduct,
//   guidelines: sampleGuidelines,
//   knownIssuesInfo: formatKnownIssues(sampleProduct.knownIssues),
//   recentUpdatesInfo: formatRecentUpdates(sampleProduct.recentUpdates),
//   escalationInfo: formatEscalation(sampleGuidelines.escalationCriteria),
// });
