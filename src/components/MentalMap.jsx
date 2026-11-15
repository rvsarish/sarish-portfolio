import { useState } from 'react';

const steps = [
  {
    title: 'Define the problem',
    short: 'Write down the expected result, the actual result, and whether the issue can be reproduced.',
    principle: 'Facts before theories',
    heading: 'Get the facts straight first.',
    description: 'I start with a specific example and its timestamps. Comparing expected and actual behavior gives the investigation a useful boundary.',
    questions: ['What should have happened?', 'What actually happened, and when?', 'Can I reproduce it?'],
  },
  {
    title: 'Trace the request',
    short: 'Follow the request through services and handoffs, using timestamps to keep the sequence straight.',
    principle: 'Sequence before assumptions',
    heading: 'Locate where the story changes.',
    description: 'I compare the request and response at each step. The first place the evidence stops matching the expected behavior is where I look more closely.',
    questions: ['Which services handled the request?', 'Where do the timestamps or responses stop lining up?', 'What changed at that point?'],
  },
  {
    title: 'Check the evidence',
    short: 'Use logs, responses, and reproducible examples to test each possible explanation.',
    principle: 'A theory needs a counter-test',
    heading: 'Give every theory a way to fail.',
    description: 'I look for evidence that would disprove my current explanation, not just details that support it. Then I choose the smallest safe check that can separate the possibilities.',
    questions: ['Which evidence supports this theory?', 'What result would disprove it?', 'What is the smallest safe check?'],
  },
  {
    title: 'Fix, then verify',
    short: 'Choose a change that fits the evidence and check the result through the full request path.',
    principle: 'Outcome before closure',
    heading: 'Check the outcome, not just the change.',
    description: 'The action should match the evidence and its risk. Afterward, I compare the final result with the original problem and watch for side effects.',
    questions: ['Does this change fit the evidence and risk?', 'Did the original issue actually resolve?', 'What else should I check after the change?'],
  },
  {
    title: 'Write down the lesson',
    short: 'Record the evidence, the explanation, and the checks that confirmed the result.',
    principle: 'Leave useful context',
    heading: 'Leave a better trail.',
    description: 'I note what happened, what ruled out the other explanations, and what would make a similar issue easier to investigate next time.',
    questions: ['What did the evidence show?', 'Which checks mattered?', 'What context should be easier to find next time?'],
  },
];

export default function MentalMap() {
  const [activeStep, setActiveStep] = useState(0);
  const step = steps[activeStep];

  return (
    <section className="mental section" id="approach" aria-labelledby="mental-heading">
      <div className="section-index" data-reveal><span>03</span> MENTAL MAP</div>
      <div className="mental-intro" data-reveal>
        <h2 id="mental-heading">How I investigate an issue</h2>
        <div>
          <p>A practical way to work from a symptom to an explanation, using evidence at each step.</p>
        </div>
      </div>

      <div className="mental-framework" data-reveal>
        <div className="mental-framework-head"><span>WORKING MODEL / 01—05</span><span>SELECT A STEP TO SEE THE DETAILS</span></div>
        <ol className="mental-track">
          {steps.map((item, index) => (
            <li key={item.title} className={activeStep === index ? 'is-active' : ''}>
              <button type="button" aria-pressed={activeStep === index} onClick={() => setActiveStep(index)}>
                <span className="mental-node-top"><i>0{index + 1}</i><small>{index === 0 ? 'START HERE' : `AFTER 0${index}`}</small></span>
                <strong>{item.title}</strong>
                <p>{item.short}</p>
              </button>
              {index < steps.length - 1 && <span className="mental-connector" aria-hidden="true"><i /></span>}
            </li>
          ))}
        </ol>

        <div className="mental-detail" key={activeStep} aria-live="polite">
          <div className="mental-detail-copy">
            <span className="mono-label">0{activeStep + 1} / {step.principle}</span>
            <h3>{step.heading}</h3>
            <p>{step.description}</p>
          </div>
          <div className="mental-questions">
            <span>QUESTIONS TO ASK</span>
            <ul>{step.questions.map((question) => <li key={question}>{question}</li>)}</ul>
          </div>
        </div>
      </div>
      <p className="mental-note" data-reveal>A working mental model—not a rigid runbook. Real investigations can loop back when new evidence changes the picture.</p>
    </section>
  );
}
