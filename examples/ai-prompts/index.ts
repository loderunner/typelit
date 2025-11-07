import { createType } from '../../src/typelit';
import {
  additionalInstructions,
  sampleArticle,
  samplePreferences as summaryPreferences,
  summarizationPrompt,
} from './content-summarization';
import {
  codeReviewPrompt,
  sampleCodeJunior,
  sampleCodeSenior,
  sampleReviewJunior,
  sampleReviewSenior,
  sampleUserJunior,
  sampleUserSenior,
  styleGuideNote,
} from './code-review';
import {
  dataAnalysisPrompt,
  formatFocusAreas,
  formatHypotheses,
  formatTimeRange,
  sampleDataset,
  sampleGoals,
  samplePreferences as analysisPreferences,
} from './data-analysis';
import {
  customerSupportPrompt,
  formatEscalation,
  formatKnownIssues,
  formatRecentUpdates,
  sampleCustomer,
  sampleCustomerBilling,
  sampleGuidelines,
  sampleGuidelinesFriendly,
  sampleProduct,
  sampleTicket,
  sampleTicketBilling,
} from './customer-support';

/**
 * AI Prompt Generation Examples
 *
 * This file demonstrates custom formatters for AI-specific use cases
 * and runs all the example prompts.
 */

// ============================================================================
// Custom Formatters for AI Prompts
// ============================================================================

/**
 * Format token count with appropriate scale
 */
export const typelitTokenCount = createType<number>({
  stringify: (tokens) => {
    if (tokens < 1000) return `${tokens} tokens`;
    if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K tokens`;
    return `${(tokens / 1000000).toFixed(2)}M tokens`;
  },
});

/**
 * Format model temperature parameter with description
 */
export const typelitTemperature = createType<number>({
  stringify: (temp) => {
    if (temp < 0 || temp > 2) return `${temp} (invalid range)`;
    if (temp <= 0.3) return `${temp} (very focused)`;
    if (temp <= 0.7) return `${temp} (balanced)`;
    if (temp <= 1.2) return `${temp} (creative)`;
    return `${temp} (highly creative)`;
  },
});

/**
 * Format markdown code blocks properly escaped for prompts
 */
export const typelitMarkdown = createType<string>({
  stringify: (markdown) => {
    // Ensure code blocks are properly formatted
    return markdown.trim();
  },
});

/**
 * Format numbers as percentages
 */
export const typelitPercentage = createType<number>({
  stringify: (value) => `${(value * 100).toFixed(1)}%`,
});

/**
 * Format currency values
 */
export const typelitCurrency = createType<number>({
  stringify: (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  },
});

// ============================================================================
// Run Examples
// ============================================================================

console.log('='.repeat(80));
console.log('AI PROMPT GENERATION EXAMPLES');
console.log('Demonstrating type-safe, reusable prompt templates');
console.log('='.repeat(80));
console.log();

// Example 1: Content Summarization
console.log('📄 EXAMPLE 1: CONTENT SUMMARIZATION');
console.log('-'.repeat(80));
const summaryPrompt = summarizationPrompt({
  article: sampleArticle,
  preferences: summaryPreferences,
  additionalInstructions,
});
console.log(summaryPrompt);
console.log();
console.log();

// Example 2: Code Review (Junior Developer)
console.log('👨‍💻 EXAMPLE 2: CODE REVIEW - JUNIOR DEVELOPER');
console.log('-'.repeat(80));
const juniorReviewPrompt = codeReviewPrompt({
  code: sampleCodeJunior,
  user: sampleUserJunior,
  review: sampleReviewJunior,
  styleGuideNote: styleGuideNote(sampleReviewJunior.styleGuide),
});
console.log(juniorReviewPrompt);
console.log();
console.log();

// Example 3: Code Review (Senior Developer)
console.log('👩‍💻 EXAMPLE 3: CODE REVIEW - SENIOR DEVELOPER');
console.log('-'.repeat(80));
const seniorReviewPrompt = codeReviewPrompt({
  code: sampleCodeSenior,
  user: sampleUserSenior,
  review: sampleReviewSenior,
  styleGuideNote: styleGuideNote(sampleReviewSenior.styleGuide),
});
console.log(seniorReviewPrompt);
console.log();
console.log();

// Example 4: Data Analysis
console.log('📊 EXAMPLE 4: DATA ANALYSIS');
console.log('-'.repeat(80));
const analysisPrompt = dataAnalysisPrompt({
  dataset: sampleDataset,
  goals: sampleGoals,
  preferences: analysisPreferences,
  timeRangeInfo: formatTimeRange(sampleDataset.timeRange),
  hypothesesInfo: formatHypotheses(sampleGoals.hypotheses),
  focusAreasInfo: formatFocusAreas(analysisPreferences.focusAreas),
});
console.log(analysisPrompt);
console.log();
console.log();

// Example 5: Customer Support (Technical Issue)
console.log('🎧 EXAMPLE 5: CUSTOMER SUPPORT - TECHNICAL ISSUE');
console.log('-'.repeat(80));
const supportPrompt = customerSupportPrompt({
  ticket: sampleTicket,
  customer: sampleCustomer,
  product: sampleProduct,
  guidelines: sampleGuidelines,
  knownIssuesInfo: formatKnownIssues(sampleProduct.knownIssues),
  recentUpdatesInfo: formatRecentUpdates(sampleProduct.recentUpdates),
  escalationInfo: formatEscalation(sampleGuidelines.escalationCriteria),
});
console.log(supportPrompt);
console.log();
console.log();

// Example 6: Customer Support (Billing Inquiry)
console.log('💳 EXAMPLE 6: CUSTOMER SUPPORT - BILLING INQUIRY');
console.log('-'.repeat(80));
const billingSupportPrompt = customerSupportPrompt({
  ticket: sampleTicketBilling,
  customer: sampleCustomerBilling,
  product: sampleProduct,
  guidelines: sampleGuidelinesFriendly,
  knownIssuesInfo: formatKnownIssues(sampleProduct.knownIssues),
  recentUpdatesInfo: formatRecentUpdates(sampleProduct.recentUpdates),
  escalationInfo: formatEscalation(sampleGuidelinesFriendly.escalationCriteria),
});
console.log(billingSupportPrompt);
console.log();
console.log();

console.log('='.repeat(80));
console.log('✅ All examples generated successfully!');
console.log('='.repeat(80));
console.log();
console.log('💡 KEY TAKEAWAYS:');
console.log('  • Type safety prevents missing or incorrect context data');
console.log('  • Nested paths enable rich, structured prompt templates');
console.log('  • Reusable templates ensure consistency across your application');
console.log('  • Refactoring is safe - TypeScript catches breaking changes');
console.log('  • Custom formatters adapt data for AI consumption');
console.log();
