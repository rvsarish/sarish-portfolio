import { useState } from 'react';

const steps = [
  {
    title: 'Frame the impact',
    short: 'Define what should happen, what actually happened, and who or what is affected.',
    principle: 'Impact before investigation',
    heading: 'Start with the problem, not a suspect.',
    description: 'A clear problem statement creates a boundary around the investigation. It keeps an interesting technical detail from becoming a distraction.',
    questions: ['What is the expected outcome?', 'What is the observed outcome?', 'Is this one case or a repeatable pattern?'],
  },
  {
    title: 'Map the path',
    short: 'Follow the request through entry points, services, dependencies, and handoffs.',
    principle: 'Context before conclusions',
    heading: 'See the system before judging the component.',
    description: 'A symptom can appear in one place and originate somewhere else. Mapping the journey shows where behavior changes and which signals matter next.',
    questions: ['Where does the request begin and end?', 'Which decisions or dependencies shape its path?', 'Where does expected behavior diverge?'],
  },
  {
    title: 'Test the evidence',
    short: 'Rank plausible explanations and use the smallest useful test to confirm or eliminate them.',
    principle: 'Evidence before action',
    heading: 'Turn clues into testable hypotheses.',
    description: 'Logs, timelines, response states, and reproducibility are most useful when they answer a specific question. A good hypothesis can be disproved.',
    questions: ['What do I believe is happening, and why?', 'Which signal would prove me wrong?', 'What is the smallest safe test?'],
  },
  {
    title: 'Act and validate',
    short: 'Choose a deliberate next step, then verify the outcome across the complete path.',
    principle: 'Validation before closure',
    heading: 'A change is not an outcome.',
    description: 'The next action should match the evidence and its risk. Resolution means more than making an error disappear: the expected experience must work again.',
    questions: ['What action addresses the evidence?', 'How will I verify the complete journey?', 'What should I watch after the change?'],
  },
  {
    title: 'Feed learning back',
    short: 'Carry the lesson into clearer signals, documentation, and future reliability work.',
    principle: 'Learning beyond resolution',
    heading: 'Make the next investigation clearer.',
    description: 'Every explained behavior can improve the next response. The lesson might become a better signal, a clearer runbook, or a reliability improvement.',
    questions: ['What made this difficult to understand?', 'Which signal was missing or unclear?', 'What will help the next person respond better?'],
  },
];

export default function MentalMap() {
  const [activeStep, setActiveStep] = useState(0);
  const step = steps[activeStep];

  return (
    <section className="mental section" id="approach" aria-labelledby="mental-heading">
      <div className="section-index" data-reveal><span>04</span> THE PRECEDENCE MENTAL MAP</div>
      <div className="mental-intro" data-reveal>
        <h2 id="mental-heading">A clear order for<br /><em>unclear problems.</em></h2>
        <div>
          <p>Precedence means knowing what must come before what. This is the mental model I use to move from ambiguity to a dependable next step.</p>
          <span>IMPACT → PATH → EVIDENCE → ACTION → LEARNING</span>
        </div>
      </div>

      <div className="mental-framework" data-reveal>
        <div className="mental-framework-head"><span>WORKING MODEL / 01—05</span><span>SELECT A STEP TO EXAMINE THE THINKING</span></div>
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
        <div className="mental-principles">
          <span>CONTEXT BEFORE CONCLUSIONS</span><i />
          <span>EVIDENCE BEFORE ACTION</span><i />
          <span>VALIDATION BEFORE CLOSURE</span>
        </div>
      </div>
      <p className="mental-note" data-reveal>A working mental model—not a rigid runbook. Real investigations can loop back when new evidence changes the picture.</p>
    </section>
  );
}
