import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import AnalogyCard from '../components/AnalogyCard'
import QuizLevels from '../components/QuizLevels'
import ChapterExercise from '../components/ChapterExercise'
import { ANALOGIES } from '../data/chapters'
import { DNP3_CHAPTER_EXERCISES } from '../data/chapterExercises'

export default function Unsolicited() {
  return (
    <ChapterLayout chapterId="unsol" title="Unsolicited Responses" emoji="📣" prev="fc" next="security">
      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Event-Driven Reporting</h2>
        <p>
          In Modbus, the master polls every device in round-robin order. The fastest you can detect
          an event is one poll cycle. For a system with 200 devices and 100ms polls, that's 20 seconds
          to detect a breaker trip. In a utility substation, a breaker trip needs to be reported
          in <em>milliseconds</em>.
        </p>
        <p className="mt-3">
          DNP3's answer: <strong>Unsolicited Responses</strong>. When an event occurs at the outstation,
          the outstation sends a report to the master immediately — without being polled. The master
          responds with an Application Confirm (FC=0x00) to acknowledge receipt.
          If no confirm arrives, the outstation retries.
        </p>
      </section>

      <div className="bg-slate-800/30 rounded-2xl border border-amber-900/30 p-5 my-6">
        <div className="font-semibold text-amber-400 mb-4">Unsolicited Response Lifecycle</div>
        <div className="flex flex-col gap-2 text-sm">
          {[
            { step: '1', actor: 'Outstation', action: 'Breaker trips → creates Class 1 event in buffer', color: 'bg-amber-500/100' },
            { step: '2', actor: 'Outstation', action: 'Sends Unsolicited Response (FC=0x82) with event data', color: 'bg-amber-500/100' },
            { step: '3', actor: 'Master',     action: 'Receives unsolicited response, parses event', color: 'bg-amber-600' },
            { step: '4', actor: 'Master',     action: 'Sends Application Confirm (FC=0x00)', color: 'bg-amber-600' },
            { step: '5', actor: 'Outstation', action: 'Receives confirm → clears event from buffer', color: 'bg-green-700' },
          ].map((s) => (
            <div key={s.step} className="flex items-center gap-3">
              <div className={`${s.color} text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0`}>
                {s.step}
              </div>
              <div className="text-xs text-amber-400 font-semibold w-20 flex-shrink-0">{s.actor}</div>
              <div className="text-slate-300 text-xs">{s.action}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl p-3 text-xs text-orange-300 flex gap-2" style={{ background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>If the master does NOT send a Confirm within the timeout, the outstation retransmits. Repeatedly.</span>
          Configure your confirm timeout appropriately or your link drowns in retransmits.
        </div>
      </div>

      <FunFact index={0} />

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Class 0, Class 1, Class 2, Class 3</h2>
        <p>
          DNP3 classifies all outstation data into four classes. The class system is how you tell
          the protocol what's important and how often to report it.
        </p>
        <div className="mt-4 space-y-3">
          {[
            { cls: 'Class 0', color: 'border-slate-700 bg-slate-800/60', title: 'Static Data', desc: 'Current values of all data points — no events, no timestamps. This is a snapshot. Read with a full "Integrity Poll" (read all Class 0 data) after device restarts.' },
            { cls: 'Class 1', color: 'border-red-900/60 bg-red-950/40', title: 'High Priority Events', desc: 'Critical events — breaker trips, protection operations, major alarms. Polled first. Reported immediately in unsolicited responses.' },
            { cls: 'Class 2', color: 'border-amber-900/60 bg-amber-950/40', title: 'Medium Priority Events', desc: 'Important but less critical — voltage exceedances, equipment status changes, non-critical alarms.' },
            { cls: 'Class 3', color: 'border-green-900/60 bg-green-950/40', title: 'Low Priority Events', desc: 'Routine changes — counter updates, slow-moving analog changes, informational events. Polled last.' },
          ].map((c) => (
            <div key={c.cls} className={`border rounded-xl p-4 ${c.color}`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-amber-400">{c.cls}</span>
                <span className="text-slate-400 text-sm">— {c.title}</span>
              </div>
              <p className="text-sm text-slate-300 ml-7">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Callout type="field" title="Event Buffer Overflow — Silent Data Loss">
        Each class has a fixed-size event buffer. When the buffer fills up (more events than the master
        is consuming), the oldest events are dropped. The outstation sets IIN2.3 (Event Buffer Overflow)
        to tell you this happened. If your master doesn't check IIN bits, you'll never know events were
        dropped. Your sequence-of-events log will have gaps. Your post-incident analysis will be missing data.
        Buffer overflow is not an error condition — it's a normal consequence of slow masters or fast events.
        Design accordingly.
      </Callout>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Enable and Disable Unsolicited</h2>
        <p>
          Unsolicited responses don't just happen automatically. The master must explicitly
          <strong> enable</strong> them using FC=0x14 (Enable Unsolicited Responses) with the
          specific classes it wants (Class 1, 2, and/or 3).
        </p>
        <p className="mt-3">
          A well-behaved master startup sequence looks like this:
        </p>
        <div className="mt-3 bg-slate-900/60 text-green-400 rounded-xl p-4 font-mono text-xs space-y-1">
          <div className="text-slate-400"># Startup sequence for a new DNP3 master session:</div>
          <div>1. Disable Unsolicited (FC=0x15) — stop any existing unsolicited stream</div>
          <div>2. Integrity Poll — read all Class 0 data (get current state snapshot)</div>
          <div>3. Time Sync — write current UTC time to outstation (G50V1)</div>
          <div>4. Enable Unsolicited (FC=0x14) — enable Class 1, 2, 3 event reporting</div>
          <div>5. Normal operation — poll for events, process unsolicited reports</div>
          <div className="text-slate-400 mt-1"># Skip any of these steps and enjoy debugging session mysteries</div>
        </div>
      </section>

      <AnalogyCard analogy={ANALOGIES[1]} />

      <GifCard gifKey="nerd" caption="Your outstation, reporting events as they happen 📣" side="left"
      />

      <FunFact index={4} />

      <ChapterExercise exercise={DNP3_CHAPTER_EXERCISES.unsol} />
      <QuizLevels chapterId="unsol" />
    </ChapterLayout>
  )
}
