import {
  buildSummarizationPrompt,
  sampleSummarizationRequest,
} from './content-summarization';
import {
  buildCodeReviewPrompt,
  sampleCodeReviewRequest,
} from './code-review';
import {
  buildCreativeWritingPrompt,
  sampleCreativeWritingRequest,
} from './creative-writing';
import {
  buildDataAnalysisPrompt,
  sampleDataAnalysisRequest,
} from './data-analysis';
import {
  buildCustomerSupportPrompt,
  sampleCustomerSupportRequest,
} from './customer-support';
import {
  buildComposedPrompt,
  sampleComposition,
} from './prompt-composition';
import {
  buildCodeReviewPromptNewWay,
  exampleContext,
} from './before-after';

console.log('='.repeat(80));
console.log('AI PROMPT GENERATION EXAMPLES');
console.log('='.repeat(80));

console.log('\n1. CONTENT SUMMARIZATION PROMPT');
console.log('-'.repeat(80));
console.log(buildSummarizationPrompt(sampleSummarizationRequest));

console.log('\n\n2. CODE REVIEW PROMPT');
console.log('-'.repeat(80));
console.log(buildCodeReviewPrompt(sampleCodeReviewRequest));

console.log('\n\n3. CREATIVE WRITING PROMPT');
console.log('-'.repeat(80));
console.log(buildCreativeWritingPrompt(sampleCreativeWritingRequest));

console.log('\n\n4. DATA ANALYSIS PROMPT');
console.log('-'.repeat(80));
console.log(buildDataAnalysisPrompt(sampleDataAnalysisRequest));

console.log('\n\n5. CUSTOMER SUPPORT PROMPT');
console.log('-'.repeat(80));
console.log(buildCustomerSupportPrompt(sampleCustomerSupportRequest));

console.log('\n\n6. PROMPT COMPOSITION EXAMPLE');
console.log('-'.repeat(80));
const composed = buildComposedPrompt(sampleComposition);
console.log('System Prompt:');
console.log(composed.system);
console.log('\nUser Prompt:');
console.log(composed.user);
console.log('\nModel Config:');
console.log(composed.config);

console.log('\n\n7. BEFORE/AFTER COMPARISON');
console.log('-'.repeat(80));
console.log('Type-safe prompt (new way):');
console.log(buildCodeReviewPromptNewWay(exampleContext));
