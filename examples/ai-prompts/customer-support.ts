import { typelit } from '../../src/typelit';

import {
  modelSettingsInstruction,
  outputFormatInstruction,
  toneInstruction,
  typelitJSON,
} from './building-blocks';

type SupportInput = {
  ticket: {
    id: string;
    subject: string;
    description: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    reportedAtIso: string;
    environment: {
      appVersion: string;
      region: 'us-east' | 'eu-west' | 'ap-south';
    };
    stepsTried: string[];
    attachments?: string[];
  };
  customer: {
    name: string;
    company: string;
    planTier: 'starter' | 'growth' | 'enterprise';
    sentiment: 'frustrated' | 'neutral' | 'positive';
  };
  product: {
    name: string;
    surfaceArea: string;
    statusPage: string;
    knownIssues: string[];
  };
  preferences: {
    tone: 'empathetic' | 'concise' | 'technical';
    detailLevel: 'key-points' | 'deep-dive';
    outputFormat: {
      sections: Array<'greeting' | 'acknowledge' | 'resolution' | 'followUp'>;
      includeInternalNote: boolean;
      includeStatusLink: boolean;
    };
  };
  model: {
    temperature: number;
    maxTokens: number;
  };
  knowledgeBase?: {
    relevantArticles: Array<{
      id: string;
      title: string;
      summary: string;
    }>;
  };
};

const supportSystemPrompt = typelit`
You are a senior customer support specialist representing ${typelit.string('product', 'name')} for ${typelit.string('customer', 'company')}.

${toneInstruction}
${modelSettingsInstruction}
${outputFormatInstruction}
`;

const supportDeveloperPrompt = typelit`
Construct the reply with the following sections (keep order): ${typelitJSON('preferences', 'outputFormat', 'sections')}.
Link to the status page if ${typelit.json('preferences', 'outputFormat', 'includeStatusLink')} (URL: ${typelit.string('product', 'statusPage')}).
Include an internal note only if ${typelit.json('preferences', 'outputFormat', 'includeInternalNote')}.
`;

const supportUserPrompt = typelit`
Ticket #${typelit.string('ticket', 'id')} (${typelit.string('ticket', 'priority')}) reported at ${typelit.string('ticket', 'reportedAtIso')}.
Customer sentiment: ${typelit.string('customer', 'sentiment')}

Subject: ${typelit.string('ticket', 'subject')}
Description:
${typelit.string('ticket', 'description')}

Steps already tried: ${typelit.json('ticket', 'stepsTried')}
Environment: ${typelit.json('ticket', 'environment')}

Attachments provided:
${typelit.string('supplemental', 'attachmentsBlock')}

Relevant knowledge base articles:
${typelit.string('supplemental', 'knowledgeBaseBlock')}

Known product issues for this surface area:
${typelit.json('product', 'knownIssues')}
`;

/**
 * Creates a three-message conversation (system/developer/user) for customer support.
 */
export function buildCustomerSupportConversation(input: SupportInput) {
  const attachmentsBlock =
    input.ticket.attachments && input.ticket.attachments.length > 0
      ? input.ticket.attachments.map((path) => `- ${path}`).join('\n')
      : 'No attachments.';

  const knowledgeBaseBlock =
    input.knowledgeBase && input.knowledgeBase.relevantArticles.length > 0
      ? input.knowledgeBase.relevantArticles
          .map(
            (article) =>
              `- ${article.title} (${article.id}): ${article.summary}`,
          )
          .join('\n')
      : 'No matching knowledge base entries. Use troubleshooting playbooks.';

  const supplemental = {
    attachmentsBlock,
    knowledgeBaseBlock,
  };

  return [
    {
      role: 'system',
      content: supportSystemPrompt({ ...input, supplemental }),
    },
    {
      role: 'developer',
      content: supportDeveloperPrompt({ ...input, supplemental }),
    },
    { role: 'user', content: supportUserPrompt({ ...input, supplemental }) },
  ] as const;
}

/**
 * Example support payload emphasising tone safety and tooling cues.
 */
export const sampleSupportInput: SupportInput = {
  ticket: {
    id: 'CS-48219',
    subject: 'Live dashboard stuck loading after new release',
    description:
      'Since yesterday’s deployment our exec dashboard never renders. Spinner just loops. I tried refreshing and clearing cache.',
    priority: 'high',
    reportedAtIso: '2025-11-06T08:23:11Z',
    environment: {
      appVersion: '2025.11.0',
      region: 'eu-west',
    },
    stepsTried: [
      'Cleared browser cache',
      'Switched to incognito',
      'Tried on Safari',
    ],
    attachments: ['https://cdn.example.com/screenshots/cs-48219.gif'],
  },
  customer: {
    name: 'Sasha Degas',
    company: 'Orbital Freight',
    planTier: 'enterprise',
    sentiment: 'frustrated',
  },
  product: {
    name: 'Telemetry Cloud',
    surfaceArea: 'Live executive dashboard',
    statusPage: 'https://status.telemetrycloud.com',
    knownIssues: [
      'Cached widget configurations may mismatch after release rollouts.',
      'Legacy browsers need the WebGL beta toggle enabled.',
    ],
  },
  preferences: {
    tone: 'empathetic',
    detailLevel: 'key-points',
    outputFormat: {
      sections: ['greeting', 'acknowledge', 'resolution', 'followUp'],
      includeInternalNote: true,
      includeStatusLink: true,
    },
  },
  model: {
    temperature: 0.3,
    maxTokens: 600,
  },
  knowledgeBase: {
    relevantArticles: [
      {
        id: 'KB-1022',
        title: 'Dashboard fails to load after cached config update',
        summary:
          'Guide for clearing stale config from our edge cache with CLI snippet.',
      },
    ],
  },
};
