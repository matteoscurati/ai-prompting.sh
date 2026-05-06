export type Example = {
  label: string;
  before: string;
  after: string;
  scoreBefore: number;
  scoreAfter: number;
};

export const EXAMPLES: Example[] = [
  {
    label: 'Writing — vague request',
    before: 'help me write something good',
    after: `<role>Senior editor focused on clarity, rhythm, and audience fit.</role>
<objective>Write something good</objective>
<context>
[ASSUMPTION: no additional context provided;
the model should flag any load-bearing assumptions]
</context>
<task>help me write something good</task>
<constraints>
- Explicitly distinguish facts, inferences, and assumptions.
- If critical information is missing, declare it rather than inventing.
</constraints>
<output_format>
Flowing prose; 60-90 word paragraphs;
no bullets unless a real list.
</output_format>`,
    scoreBefore: 30,
    scoreAfter: 68
  },
  {
    label: 'Coding — under-specified task',
    before: 'fix the bug in the auth flow',
    after: `<role>Senior software engineer.</role>
<objective>Locate and fix the failing branch in the auth flow.</objective>
<context>
[ASSUMPTION: repo follows standard Express/Node layout;
test command is "npm test"; failing test name is unspecified]
</context>
<task>
1. Reproduce the failure.
2. Identify the smallest code change that resolves it.
3. Add a regression test.
</task>
<constraints>
- Do not refactor unrelated code.
- Match existing code style and lint rules.
- No new runtime dependencies.
</constraints>
<output_format>
Unified diff + 2-3 sentence rationale + the new test.
</output_format>`,
    scoreBefore: 28,
    scoreAfter: 79
  },
  {
    label: 'Research — missing scope',
    before: 'research llm prompt techniques',
    after: `<role>Research analyst.</role>
<objective>Survey current LLM prompting techniques with citations.</objective>
<context>
[ASSUMPTION: scope = production-grade techniques as of 2026;
audience = senior AI engineer]
</context>
<task>
1. Identify the 5-7 most-cited techniques.
2. For each: 1-paragraph summary + 1-2 references.
3. Flag any technique whose evidence is anecdotal.
</task>
<constraints>
- Cite sources with a URL or DOI.
- Distinguish facts from inferences.
- Do not invent references.
</constraints>
<output_format>
Markdown table: technique | summary | sources | confidence.
</output_format>`,
    scoreBefore: 32,
    scoreAfter: 81
  },
  {
    label: 'Agentic — tool use',
    before: 'use the database tools to find inactive users',
    after: `<role>Data analyst with read-only DB access.</role>
<objective>List users inactive for >= 90 days.</objective>
<context>
[ASSUMPTION: schema includes users.last_login_at;
"inactive" = no login in the last 90 days]
</context>
<task>
1. Query users where last_login_at < now() - 90 days.
2. Return id, email, last_login_at, signup source.
3. Limit to 1000 rows; offer to extend if needed.
</task>
<constraints>
- Read-only queries only.
- Mask emails in the visible output (a***@example.com).
- If the schema differs, ask before guessing.
</constraints>
<output_format>
CSV with header row; total count summarized at the end.
</output_format>`,
    scoreBefore: 35,
    scoreAfter: 82
  }
];
