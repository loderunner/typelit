import { typelit } from '../../src/typelit';

/**
 * Data Analysis Prompt Example
 *
 * Demonstrates:
 * - Structured data descriptions with type safety
 * - Analysis goals and output format specifications
 * - Statistical context and preferences
 */

type AnalysisType =
  | 'descriptive'
  | 'diagnostic'
  | 'predictive'
  | 'prescriptive';
type OutputFormat = 'narrative' | 'structured' | 'visual-descriptions' | 'code';
type StatisticalDepth = 'basic' | 'intermediate' | 'advanced';

type Dataset = {
  name: string;
  description: string;
  size: {
    rows: number;
    columns: number;
  };
  columns: ColumnDescription[];
  timeRange?: {
    start: Date;
    end: Date;
  };
};

type ColumnDescription = {
  name: string;
  type: string;
  description: string;
  sampleValues?: string[];
};

type AnalysisGoals = {
  primaryQuestion: string;
  secondaryQuestions: string[];
  hypotheses?: string[];
  businessContext: string;
};

type AnalysisPreferences = {
  type: AnalysisType;
  statisticalDepth: StatisticalDepth;
  outputFormat: OutputFormat;
  includeVisualizationSuggestions: boolean;
  focusAreas?: string[];
};

export const dataAnalysisPrompt = typelit`You are an expert data analyst providing insights and analysis recommendations.

DATASET INFORMATION
Name: ${typelit.string('dataset', 'name')}
Description: ${typelit.string('dataset', 'description')}
Size: ${typelit.number('dataset', 'size', 'rows')} rows × ${typelit.number('dataset', 'size', 'columns')} columns

${typelit.string('timeRangeInfo')}

Column Definitions:
${typelit.json('dataset', 'columns')}

ANALYSIS OBJECTIVES
Primary Question: ${typelit.string('goals', 'primaryQuestion')}

Secondary Questions:
${typelit.json('goals', 'secondaryQuestions')}

${typelit.string('hypothesesInfo')}

Business Context: ${typelit.string('goals', 'businessContext')}

ANALYSIS REQUIREMENTS
- Analysis Type: ${typelit.string('preferences', 'type')}
- Statistical Depth: ${typelit.string('preferences', 'statisticalDepth')}
- Output Format: ${typelit.string('preferences', 'outputFormat')}
- Include Visualization Suggestions: ${typelit.boolean('preferences', 'includeVisualizationSuggestions')}
${typelit.string('focusAreasInfo')}

---

Please provide:
1. Recommended analytical approach and methodology
2. Specific statistical tests or models to apply
3. Potential insights or patterns to investigate
4. Data quality considerations and preprocessing steps
5. Interpretation guidelines for the results
6. Actionable recommendations based on expected findings

Ensure your analysis plan is rigorous, practical, and aligned with the business context.`;

// Helper functions for optional fields
export const formatTimeRange = (timeRange?: { start: Date; end: Date }) =>
  timeRange
    ? `Time Range: ${timeRange.start.toLocaleDateString()} to ${timeRange.end.toLocaleDateString()}`
    : '';

export const formatHypotheses = (hypotheses?: string[]) =>
  hypotheses && hypotheses.length > 0
    ? `\nHypotheses to Test:\n${JSON.stringify(hypotheses, null, 2)}`
    : '';

export const formatFocusAreas = (focusAreas?: string[]) =>
  focusAreas && focusAreas.length > 0
    ? `\nSpecific Focus Areas:\n${JSON.stringify(focusAreas, null, 2)}`
    : '';

// Sample data - E-commerce customer behavior analysis
export const sampleDataset: Dataset = {
  name: 'E-commerce Customer Transactions Q1-Q3 2024',
  description:
    'Transaction-level data including customer demographics, purchase history, and engagement metrics',
  size: {
    rows: 125000,
    columns: 18,
  },
  columns: [
    {
      name: 'customer_id',
      type: 'string',
      description: 'Unique customer identifier',
    },
    {
      name: 'transaction_date',
      type: 'datetime',
      description: 'Date and time of transaction',
    },
    {
      name: 'transaction_amount',
      type: 'float',
      description: 'Total purchase amount in USD',
      sampleValues: ['24.99', '156.50', '89.00'],
    },
    {
      name: 'product_category',
      type: 'string',
      description: 'Primary category of purchased items',
      sampleValues: ['Electronics', 'Home & Garden', 'Fashion'],
    },
    {
      name: 'customer_age_group',
      type: 'string',
      description: 'Age bracket of customer',
      sampleValues: ['18-24', '25-34', '35-44', '45-54', '55+'],
    },
    {
      name: 'customer_segment',
      type: 'string',
      description: 'Marketing segment classification',
      sampleValues: ['High-Value', 'Regular', 'Occasional', 'First-Time'],
    },
    {
      name: 'marketing_channel',
      type: 'string',
      description: 'Acquisition or engagement channel',
      sampleValues: ['Email', 'Social Media', 'Direct', 'Paid Search'],
    },
    {
      name: 'days_since_last_purchase',
      type: 'integer',
      description: 'Days between this and previous purchase',
    },
  ],
  timeRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-09-30'),
  },
};

export const sampleGoals: AnalysisGoals = {
  primaryQuestion:
    'What factors most significantly influence customer lifetime value and repeat purchase behavior?',
  secondaryQuestions: [
    'Are there distinct customer segments with different purchasing patterns?',
    'Which marketing channels drive the highest-value customers?',
    'What is the optimal time to re-engage customers who haven\'t purchased recently?',
    'How does seasonality affect different customer segments?',
  ],
  hypotheses: [
    'High-value customers are more influenced by email marketing than social media',
    'Time between purchases decreases after the third transaction',
    'Customers acquired through paid search have lower lifetime value than organic channels',
  ],
  businessContext:
    'The marketing team needs to optimize budget allocation across channels and develop targeted retention strategies. Current customer retention rate is 35% annually, with a goal to increase to 45%.',
};

export const samplePreferences: AnalysisPreferences = {
  type: 'predictive',
  statisticalDepth: 'advanced',
  outputFormat: 'structured',
  includeVisualizationSuggestions: true,
  focusAreas: [
    'Customer segmentation',
    'Churn prediction',
    'Channel attribution',
  ],
};

// Example usage
// const prompt = dataAnalysisPrompt({
//   dataset: sampleDataset,
//   goals: sampleGoals,
//   preferences: samplePreferences,
//   timeRangeInfo: formatTimeRange(sampleDataset.timeRange),
//   hypothesesInfo: formatHypotheses(sampleGoals.hypotheses),
//   focusAreasInfo: formatFocusAreas(samplePreferences.focusAreas),
// });
