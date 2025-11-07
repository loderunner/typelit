import { typelit } from '../../src/typelit';

/**
 * Customer Support Response Generator Example
 *
 * Demonstrates:
 * - Ticket details with nested information
 * - Company tone and brand voice
 * - Product context integration
 * - Escalation handling
 */

type CustomerSupportRequest = {
  ticket: {
    id: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    subject: string;
    description: string;
    customerHistory?: {
      previousTickets: number;
      satisfactionScore?: number;
    };
  };
  company: {
    name: string;
    tone: 'professional' | 'casual' | 'friendly' | 'empathetic';
    values: string[];
  };
  product: {
    name: string;
    version?: string;
    knownIssues?: string[];
    documentationUrl?: string;
  };
  response: {
    includeNextSteps: boolean;
    offerEscalation: boolean;
    maxLength?: number;
  };
};

export const customerSupportPrompt = typelit`
You are a customer support agent for ${typelit.string('request', 'company', 'name')}.

## Company Values & Tone
${typelit.json('request', 'company', 'values')}
Tone: ${typelit.string('request', 'company', 'tone')}

## Ticket Information
Ticket ID: ${typelit.string('request', 'ticket', 'id')}
Priority: ${typelit.string('request', 'ticket', 'priority')}
Category: ${typelit.string('request', 'ticket', 'category')}
Subject: ${typelit.string('request', 'ticket', 'subject')}

Customer Description:
${typelit.string('request', 'ticket', 'description')}

${typelit.string('customerHistoryContext')}

## Product Context
Product: ${typelit.string('request', 'product', 'name')}
${typelit.string('versionContext')}
${typelit.string('knownIssuesContext')}
${typelit.string('documentationContext')}

## Response Requirements
${typelit.string('nextStepsInstruction')}
${typelit.string('escalationInstruction')}

Write a ${typelit.string('request', 'company', 'tone')} response that:
1. Acknowledges the customer's issue
2. Shows empathy and understanding
3. Provides helpful information or solutions
4. Aligns with company values
${typelit.string('priorityInstruction')}
`;

// Helper function to build the full prompt with conditional parts
export const buildCustomerSupportPrompt = (request: CustomerSupportRequest) => {
  const customerHistoryContext = request.ticket.customerHistory
    ? `Customer History: ${request.ticket.customerHistory.previousTickets} previous tickets${
        request.ticket.customerHistory.satisfactionScore
          ? `, Satisfaction Score: ${request.ticket.customerHistory.satisfactionScore}/10`
          : ''
      }`
    : '';
  const versionContext = request.product.version
    ? `Version: ${request.product.version}`
    : '';
  const knownIssuesContext = request.product.knownIssues
    ? `Known Issues: ${JSON.stringify(request.product.knownIssues, null, 2)}`
    : '';
  const documentationContext = request.product.documentationUrl
    ? `Documentation: ${request.product.documentationUrl}`
    : '';
  const nextStepsInstruction = request.response.includeNextSteps
    ? 'Include clear next steps for the customer.'
    : '';
  const escalationInstruction = request.response.offerEscalation
    ? 'Offer to escalate if the issue persists.'
    : '';
  const priorityInstruction = request.ticket.priority === 'urgent'
    ? '5. Emphasizes urgency and immediate attention'
    : '';

  return customerSupportPrompt({
    request,
    customerHistoryContext,
    versionContext,
    knownIssuesContext,
    documentationContext,
    nextStepsInstruction,
    escalationInstruction,
    priorityInstruction,
  });
};

export const sampleCustomerSupportRequest: CustomerSupportRequest = {
  ticket: {
    id: 'CS-2024-08472',
    priority: 'high',
    category: 'technical issue',
    subject: 'Unable to sync data after latest update',
    description: `Hi, I updated to version 2.3.1 yesterday and now my data won't sync. 
    I've tried restarting the app multiple times and checking my internet connection. 
    This is blocking my work and I have a deadline tomorrow. Please help!`,
    customerHistory: {
      previousTickets: 2,
      satisfactionScore: 8,
    },
  },
  company: {
    name: 'CloudSync Pro',
    tone: 'empathetic',
    values: ['customer-first', 'transparency', 'rapid resolution'],
  },
  product: {
    name: 'CloudSync Pro Desktop',
    version: '2.3.1',
    knownIssues: [
      'Sync fails for files larger than 500MB',
      'Windows Defender may flag sync process',
    ],
    documentationUrl: 'https://docs.cloudsyncpro.com/troubleshooting',
  },
  response: {
    includeNextSteps: true,
    offerEscalation: true,
  },
};
