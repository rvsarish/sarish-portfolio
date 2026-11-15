import { useState } from 'react';

const steps = [
  {
    title: 'Define the problem',
    principle: 'Facts before theories',
    description: 'I start with a specific example, its timestamps, and the difference between expected and actual behavior. I also check whether the issue can be reproduced safely.',
    questions: ['What should have happened?', 'What actually happened, and when?', 'Can I reproduce it safely?'],
  },
  {
    title: 'Trace the request',
    principle: 'Sequence before assumptions',
    description: 'I follow the request through services and handoffs, using timestamps and request or correlation identifiers to keep the sequence straight. The first mismatch tells me where to look more closely—not necessarily the root cause.',
    questions: ['Which services handled the request?', 'Where do timestamps or responses stop lining up?', 'What changed at that point?'],
  },
  {
    title: 'Check the evidence',
    principle: 'Test the explanation',
    description: 'I look for evidence that would disprove my current explanation, not just details that support it. Then I choose the smallest safe check that can separate the possibilities.',
    questions: ['Which evidence supports this theory?', 'What result would disprove it?', 'What is the smallest safe check?'],
  },
  {
    title: 'Act, then verify',
    principle: 'Match action to evidence and risk',
    description: 'The next step might be more analysis, a mitigation, or a small fix. I check the actual outcome against the original problem rather than assuming the action resolved it.',
    questions: ['What action fits the evidence and risk?', 'Is the original issue actually resolved?', 'What should I watch afterward?'],
  },
  {
    title: 'Record the lesson',
    principle: 'Leave useful context',
    description: 'I write down the explanation, the checks that mattered, and the alternatives I ruled out. The next person should not have to reconstruct the whole investigation.',
    questions: ['What did the evidence show?', 'Which checks mattered?', 'What should be documented or followed up?'],
  },
];

export default function MentalMap() {
  const [activeStep, setActiveStep] = useState(0);
  const step = steps[activeStep];

  return (
    <section className="mental section" id="approach" aria-labelledby="mental-heading">
      <div className="section-index" data-reveal><span>04</span> INVESTIGATION APPROACH</div>
      <div className="mental-intro" data-reveal>
        <h2 id="mental-heading">How I investigate an issue</h2>
        <div>
          <p>Five steps I use to move from a symptom to an explanation. New evidence can send the investigation back to an earlier step.</p>
        </div>
      </div>

      <div className="mental-framework" data-reveal>
        <div className="mental-framework-head"><span>WORKING MODEL / 01—05</span><span>SELECT A STEP FOR THE QUESTIONS I ASK</span></div>
        <ol className="mental-track">
          {steps.map((item, index) => (
            <li key={item.title} className={activeStep === index ? 'is-active' : ''}>
              <button type="button" aria-pressed={activeStep === index} onClick={() => setActiveStep(index)}>
                <span className="mental-node-top"><i>0{index + 1}</i><small>{index === 0 ? 'START HERE' : `AFTER 0${index}`}</small></span>
                <strong>{item.title}</strong>
              </button>
              {index < steps.length - 1 && <span className="mental-connector" aria-hidden="true"><i /></span>}
            </li>
          ))}
        </ol>

        <div className="mental-detail" key={activeStep} aria-live="polite">
          <div className="mental-detail-copy">
            <span className="mono-label">0{activeStep + 1} / {step.principle}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
          <div className="mental-questions">
            <span>QUESTIONS TO ASK</span>
            <ul>{step.questions.map((question) => <li key={question}>{question}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}
