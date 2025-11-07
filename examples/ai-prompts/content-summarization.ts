import { typelit } from '../../src/typelit';

import {
  modelSettingsInstruction,
  outputFormatInstruction,
  toneInstruction,
  typelitTokenCount,
} from './building-blocks';

type SummarizationInput = {
  article: {
    title: string;
    author: string;
    domain: 'finance' | 'product' | 'security';
    url: string;
    keyTakeaways: string[];
    sections: Array<{
      heading: string;
      gist: string;
    }>;
    referenceExamples?: string[];
  };
  summary: {
    targetTokens: number;
    voice: 'executive' | 'technical' | 'casual';
  };
  user: {
    name: string;
    company: string;
  };
  preferences: {
    tone: 'concise' | 'detailed' | 'conversational';
    detailLevel: 'high-level' | 'key-points' | 'verbose';
    outputFormat: {
      summaryType: 'bullet-list' | 'narrative';
      includeCallToAction: boolean;
      includeFurtherReading: boolean;
    };
  };
  model: {
    temperature: number;
    maxTokens: number;
  };
};

const summarizationSystemPrompt = typelit`
You are an AI summarization assistant helping ${typelit.string('user', 'company')} stay informed about ${typelit.string('article', 'domain')} updates.

${toneInstruction}
${outputFormatInstruction}
${modelSettingsInstruction}

Only use the provided article context. Never fabricate data.
`;

const summarizationUserPrompt = typelit`
Summarize the article "${typelit.string('article', 'title')}" by ${typelit.string('article', 'author')} (${typelit.string('article', 'url')}).
Produce a ${typelit.string('summary', 'voice')} summary capped at ${typelitTokenCount('summary', 'targetTokens')}.

Key takeaways the user cares about:
${typelit.json('article', 'keyTakeaways')}

Article sections:
${typelit.json('article', 'sections')}

Reference examples from the user:
${typelit.string('supplemental', 'referenceExamples')}
`;

/**
 * Builds a two-turn conversation for summarizing structured articles.
 *
 * Validates optional reference examples and guarantees the prompt never ships
 * with missing sections.
 */
export function buildSummarizationPrompt(input: SummarizationInput) {
  const supplemental = {
    referenceExamples:
      input.article.referenceExamples
        ?.map((example) => `- ${example}`)
        .join('\n') ?? 'No reference examples supplied by the user.',
  };

  return {
    system: summarizationSystemPrompt({ ...input, supplemental }),
    user: summarizationUserPrompt({ ...input, supplemental }),
  };
}

/**
 * Example summarization payload mirroring a real SaaS change-log reader.
 */
export const sampleSummarizationInput: SummarizationInput = {
  article: {
    title: 'Quarterly Billing Overhaul',
    author: 'Dana Martins',
    domain: 'product',
    url: 'https://example.com/blog/quarterly-billing-overhaul',
    keyTakeaways: [
      'New proration engine for annual upgrades',
      'Self-service invoice exports in CSV and PDF',
      'Dunning emails now support locale-specific templates',
    ],
    sections: [
      {
        heading: 'Why we rebuilt billing',
        gist: 'Legacy billing forced manual adjustments and confused enterprise users.',
      },
      {
        heading: 'Proration, finally sane',
        gist: 'Usage-based add-ons reconcile hourly and monthly plans automatically.',
      },
      {
        heading: 'Global teams, localized invoices',
        gist: 'Templates render in six languages with compliant tax fields.',
      },
    ],
    referenceExamples: [
      'Focus on operational impact over marketing spin.',
      'Call out anything data teams should monitor post-launch.',
    ],
  },
  summary: {
    targetTokens: 280,
    voice: 'executive',
  },
  user: {
    name: 'Priya Patel',
    company: 'Northwind Insights',
  },
  preferences: {
    tone: 'concise',
    detailLevel: 'key-points',
    outputFormat: {
      summaryType: 'bullet-list',
      includeCallToAction: false,
      includeFurtherReading: true,
    },
  },
  model: {
    temperature: 0.2,
    maxTokens: 512,
  },
};
