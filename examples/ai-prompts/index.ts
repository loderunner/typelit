import { buildCodeReviewPrompt, sampleCodeReviewInput } from './code-review';
import {
  buildSummarizationPrompt,
  sampleSummarizationInput,
} from './content-summarization';
import {
  buildCreativeWritingPrompt,
  sampleCreativeWritingInput,
} from './creative-writing';
import {
  buildCustomerSupportConversation,
  sampleSupportInput,
} from './customer-support';
import {
  buildDataAnalysisPrompt,
  sampleDataAnalysisInput,
} from './data-analysis';

type ScenarioName =
  | 'summarization'
  | 'code-review'
  | 'creative-writing'
  | 'data-analysis'
  | 'customer-support'
  | 'all';

function printDivider(label: string) {
  const line = '='.repeat(16);
  console.log(`${line} ${label.toUpperCase()} ${line}`);
}

function runSummarization() {
  printDivider('summarization');
  const prompt = buildSummarizationPrompt(sampleSummarizationInput);
  console.log('[SYSTEM]');
  console.log(prompt.system);
  console.log('[USER]');
  console.log(prompt.user);
}

function runCodeReview() {
  printDivider('code review – intermediate developer');
  const prompt = buildCodeReviewPrompt(sampleCodeReviewInput);
  console.log('[SYSTEM]');
  console.log(prompt.system);
  console.log('[USER]');
  console.log(prompt.user);

  printDivider('code review – junior developer variant');
  const juniorPrompt = buildCodeReviewPrompt({
    ...sampleCodeReviewInput,
    user: { ...sampleCodeReviewInput.user, experienceLevel: 'junior' },
  });
  console.log('[SYSTEM]');
  console.log(juniorPrompt.system);
  console.log('[USER]');
  console.log(juniorPrompt.user);
}

function runCreativeWriting() {
  printDivider('creative writing');
  const prompt = buildCreativeWritingPrompt(sampleCreativeWritingInput);
  console.log('[SYSTEM]');
  console.log(prompt.system);
  console.log('[USER]');
  console.log(prompt.user);
}

function runDataAnalysis() {
  printDivider('data analysis');
  const prompt = buildDataAnalysisPrompt(sampleDataAnalysisInput);
  console.log('[SYSTEM]');
  console.log(prompt.system);
  console.log('[USER]');
  console.log(prompt.user);
}

function runCustomerSupport() {
  printDivider('customer support conversation');
  const conversation = buildCustomerSupportConversation(sampleSupportInput);
  for (const message of conversation) {
    console.log(`[${message.role.toUpperCase()}]`);
    console.log(message.content);
  }
}

const scenarios: Record<Exclude<ScenarioName, 'all'>, () => void> = {
  summarization: runSummarization,
  'code-review': runCodeReview,
  'creative-writing': runCreativeWriting,
  'data-analysis': runDataAnalysis,
  'customer-support': runCustomerSupport,
};

const requestedScenario =
  (process.argv[2] as ScenarioName | undefined) ?? 'all';

if (requestedScenario === 'all') {
  const keys = Object.keys(scenarios) as Array<keyof typeof scenarios>;
  for (const key of keys) {
    scenarios[key]();
    console.log('\n');
  }
} else if (requestedScenario in scenarios) {
  scenarios[requestedScenario as keyof typeof scenarios]();
} else {
  console.error(
    `Unknown scenario "${requestedScenario}". Expected one of: ${Object.keys(scenarios).join(', ')}, or "all".`,
  );
  process.exitCode = 1;
}
