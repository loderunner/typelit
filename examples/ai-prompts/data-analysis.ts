import { typelit } from '../../src/typelit';

import {
  modelSettingsInstruction,
  outputFormatInstruction,
  toneInstruction,
  typelitJSON,
  typelitTokenCount,
} from './building-blocks';

type DatasetDescriptor = {
  name: string;
  refreshCadence: 'hourly' | 'daily' | 'weekly';
  schema: Array<{ column: string; type: string; notes?: string }>;
  sampleRows: Array<Record<string, string | number | boolean>>;
  knownIssues: string[];
};

type DataAnalysisInput = {
  dataset: DatasetDescriptor;
  analysis: {
    goals: string[];
    segmentationFields: string[];
    outputFormatContract: {
      chartTypes: Array<'line' | 'bar' | 'table' | 'markdown'>;
      summaryParagraphs: number;
      deliverableAudience: 'executive' | 'analyst' | 'engineer';
    };
    followUpQuestions?: string[];
  };
  user: {
    name: string;
    role: 'product-manager' | 'data-scientist' | 'marketing-lead';
  };
  preferences: {
    tone: 'technical' | 'conversational';
    detailLevel: 'key-points' | 'deep-dive';
    outputFormat: {
      includeSQL: boolean;
      includeChartConfig: boolean;
      includeNarrativeSummary: boolean;
    };
  };
  model: {
    temperature: number;
    maxTokens: number;
  };
  chaining?: {
    previousSummary?: string;
    previousTicketId?: string;
  };
};

const dataAnalysisSystemPrompt = typelit`
You are a data analyst assisting ${typelit.string('user', 'name')} (${typelit.string('user', 'role')}) in exploring the ${typelit.string('dataset', 'name')} dataset.

${toneInstruction}
${modelSettingsInstruction}

Respect data caveats and never fabricate values absent from the dataset.
`;

const dataAnalysisUserPrompt = typelit`
Primary goals:
${typelit.json('analysis', 'goals')}

Segment the analysis on:
${typelit.json('analysis', 'segmentationFields')}

Dataset metadata:
- Refresh cadence: ${typelit.string('dataset', 'refreshCadence')}
- Known issues: ${typelit.json('dataset', 'knownIssues')}
- Schema: ${typelitJSON('dataset', 'schema')}
- Sample rows: ${typelitJSON('dataset', 'sampleRows')}

Chained context:
${typelit.string('supplemental', 'chainIntroduction')}

Requested deliverable contract:
${typelitJSON('analysis', 'outputFormatContract')}

Wrap up within ${typelitTokenCount('model', 'maxTokens')} and keep SQL under ${typelitTokenCount('supplemental', 'sqlBudget')}.

${outputFormatInstruction}

Follow-up questions from stakeholders:
${typelit.string('supplemental', 'followUpBlock')}
`;

/**
 * Builds a data analysis prompt that can optionally chain from previous outputs.
 */
export function buildDataAnalysisPrompt(input: DataAnalysisInput) {
  const chainIntroduction =
    input.chaining?.previousSummary ??
    'No prior analysis provided; treat this as a fresh investigation.';

  const followUpBlock =
    input.analysis.followUpQuestions &&
    input.analysis.followUpQuestions.length > 0
      ? input.analysis.followUpQuestions
          .map((question) => `- ${question}`)
          .join('\n')
      : 'Stakeholders did not request specific follow-up questions.';

  const supplemental = {
    chainIntroduction,
    followUpBlock,
    sqlBudget: Math.floor(input.model.maxTokens / 3),
  };

  return {
    system: dataAnalysisSystemPrompt({ ...input, supplemental }),
    user: dataAnalysisUserPrompt({ ...input, supplemental }),
  };
}

/**
 * Example data analysis payload tying into the summarization example.
 */
export const sampleDataAnalysisInput: DataAnalysisInput = {
  dataset: {
    name: 'billing_events',
    refreshCadence: 'hourly',
    schema: [
      { column: 'event_id', type: 'uuid' },
      { column: 'account_id', type: 'uuid' },
      {
        column: 'event_type',
        type: 'enum',
        notes: 'invoice_sent | payment_failed | payment_succeeded',
      },
      { column: 'amount_cents', type: 'integer', notes: 'always positive' },
      { column: 'occurred_at', type: 'timestamptz' },
      { column: 'metadata', type: 'jsonb' },
    ],
    sampleRows: [
      {
        event_id: 'evt_001',
        account_id: 'acct_993',
        event_type: 'payment_failed',
        amount_cents: 2599,
        occurred_at: '2025-10-02T14:03:22Z',
        metadata: true,
      },
      {
        event_id: 'evt_002',
        account_id: 'acct_221',
        event_type: 'invoice_sent',
        amount_cents: 10999,
        occurred_at: '2025-10-02T15:44:10Z',
        metadata: false,
      },
    ],
    knownIssues: [
      'Metadata column mixes booleans and objects.',
      'Invoice retries occasionally duplicate payment_succeeded events.',
    ],
  },
  analysis: {
    goals: [
      'Identify accounts with repeated payment failures after the billing overhaul.',
      'Quantify dwell time between invoice_sent and payment_succeeded events.',
    ],
    segmentationFields: ['account_id', 'event_type'],
    outputFormatContract: {
      chartTypes: ['table', 'line'],
      summaryParagraphs: 2,
      deliverableAudience: 'product-manager',
    },
    followUpQuestions: [
      'Highlight any accounts affected by the proration changes described in the product summary.',
      'Flag if we need to notify support about accounts nearing churn thresholds.',
    ],
  },
  user: {
    name: 'Priya Patel',
    role: 'product-manager',
  },
  preferences: {
    tone: 'technical',
    detailLevel: 'deep-dive',
    outputFormat: {
      includeSQL: true,
      includeChartConfig: true,
      includeNarrativeSummary: true,
    },
  },
  model: {
    temperature: 0.25,
    maxTokens: 900,
  },
  chaining: {
    previousSummary:
      'Previous article summary noted a spike in dunning emails after the billing overhaul; investigate correlation to payment events.',
    previousTicketId: 'Q4-BILLING-42',
  },
};
