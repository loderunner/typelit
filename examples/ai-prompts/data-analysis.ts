import { typelit } from '../../src/typelit';
import { typelitTokenCount } from './prompt-utils';

/**
 * Data Analysis Prompt Example
 *
 * Demonstrates:
 * - Dataset description formatting
 * - Analysis goals specification
 * - Output format requirements
 * - Structured JSON output instructions
 */

type DataAnalysisRequest = {
  dataset: {
    description: string;
    size: string;
    columns: string[];
    dataTypes: Record<string, string>;
  };
  analysis: {
    goals: string[];
    questions: string[];
    timeframe?: string;
  };
  output: {
    format: 'json' | 'markdown' | 'plain';
    includeVisualizations: boolean;
    detailLevel: 'summary' | 'detailed' | 'comprehensive';
  };
  context?: {
    domain: string;
    previousFindings?: string[];
  };
};

export const dataAnalysisPrompt = typelit`
You are an expert data analyst.

## Dataset Information
Description: ${typelit.string('request', 'dataset', 'description')}
Size: ${typelit.string('request', 'dataset', 'size')}
Columns: ${typelit.json('request', 'dataset', 'columns')}
Data Types: ${typelit.json('request', 'dataset', 'dataTypes')}

## Analysis Goals
Primary Goals: ${typelit.json('request', 'analysis', 'goals')}
Key Questions: ${typelit.json('request', 'analysis', 'questions')}
${typelit.string('timeframeContext')}

## Context
${typelit.string('domainContext')}
${typelit.string('previousFindingsContext')}

## Output Requirements
Format: ${typelit.string('request', 'output', 'format')}
Detail Level: ${typelit.string('request', 'output', 'detailLevel')}
${typelit.string('visualizationInstruction')}

Provide a ${typelit.string('request', 'output', 'detailLevel')} analysis addressing all goals and questions.
${typelit.string('formatInstruction')}
`;

// Helper function to build the full prompt with conditional parts
export const buildDataAnalysisPrompt = (request: DataAnalysisRequest) => {
  const timeframeContext = request.analysis.timeframe
    ? `Timeframe: ${request.analysis.timeframe}`
    : '';
  const domainContext = request.context?.domain
    ? `Domain: ${request.context.domain}`
    : '';
  const previousFindingsContext = request.context?.previousFindings
    ? `Previous Findings: ${JSON.stringify(request.context.previousFindings, null, 2)}`
    : '';
  const visualizationInstruction = request.output.includeVisualizations
    ? 'Include visualization recommendations and descriptions.'
    : 'Focus on numerical and textual analysis only.';
  const formatInstruction = request.output.format === 'json'
    ? 'Structure your response as valid JSON with clear sections.'
    : '';

  return dataAnalysisPrompt({
    request,
    timeframeContext,
    domainContext,
    previousFindingsContext,
    visualizationInstruction,
    formatInstruction,
  });
};

export const sampleDataAnalysisRequest: DataAnalysisRequest = {
  dataset: {
    description: 'E-commerce transaction data from Q4 2024',
    size: '50,000 transactions',
    columns: ['transaction_id', 'customer_id', 'product_id', 'amount', 'timestamp', 'payment_method', 'region'],
    dataTypes: {
      transaction_id: 'string',
      customer_id: 'string',
      product_id: 'string',
      amount: 'number',
      timestamp: 'datetime',
      payment_method: 'string',
      region: 'string',
    },
  },
  analysis: {
    goals: [
      'Identify purchasing patterns',
      'Analyze regional sales differences',
      'Evaluate payment method preferences',
    ],
    questions: [
      'What are the peak purchasing hours?',
      'Which regions have the highest average transaction value?',
      'How does payment method correlate with transaction amount?',
    ],
    timeframe: 'Q4 2024 (October - December)',
  },
  output: {
    format: 'json',
    includeVisualizations: true,
    detailLevel: 'detailed',
  },
  context: {
    domain: 'e-commerce',
    previousFindings: [
      'Mobile payments increased 30% in Q3',
      'West Coast region shows highest customer retention',
    ],
  },
};
