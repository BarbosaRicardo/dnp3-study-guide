import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import AnalogyCard from '../components/AnalogyCard'
import QuizLevels from '../components/QuizLevels'
import { ANALOGIES } from '../data/chapters'

const FUNCTION_CODES = [
  { fc: '0x00 (0)',  name: 'Confirm',            dir: 'Master → Out', desc: 'Acknowledge receipt of a response or unsolicited message' },
  { fc: '0x01 (1)',  name: 'Read',               dir: 'Master → Out', desc: 'Request data from the outstation. Most common request type.' },
  { fc: '0x02 (2)',  name: 'Write',              dir: 'Master → Out', desc: 'Write data to the outstation. Used for time sync, IIN clear, unsolicited enable.' },
  { fc: '0x03 (3)',  name: 'Select',             dir: 'Master → Out', desc: 'First step of Select-Before-Operate. "I intend to operate this control."' },
  { fc: '0x04 (4)',  name: 'Operate',            dir: 'Master → Out', desc: 'Second step of SBO. Execute the previously selected control.' },
  { fc: '0x05 (5)',  name: 'Direct Operate',     dir: 'Master → Out', desc: 'Single-step operate. No Select required. Use with care.' },
  { fc: '0x06 (6)',  name: 'Direct Operate NR',  dir: 'Master → Out', desc: 'Direct Operate, No Response required. Fire-and-forget.' },
  { fc: '0x07 (7)',  name: 'Freeze',             dir: 'Master → Out', desc: 'Capture current counter values into a frozen snapshot.' },
  { fc: '0x0D (13)', name: 'Cold Restart',       dir: 'Master → Out', desc: '⚠️ Full device restart. Clears event buffer. Use with extreme caution.' },
  { fc: '0x0E (14)', name: 'Warm Restart',       dir: 'Master → Out', desc: 'Soft restart. Less disruptive than Cold Restart.' },
  { fc: '0x14 (20)', name: 'Enable Unsolicited', dir: 'Master → Out', desc: 'Tell outstation to start sending unsolicited responses for specified classes.' },
  { fc: '0x15 (21)', name: 'Disable Unsolicited',dir: 'Master → Out', desc: 'Stop unsolicited responses. Useful during configuration or diagnostics.' },
  { fc: '0x81 (129)','name': 'Response',          dir: 'Out → Master', desc: 'Normal response to a master request. Contains IIN bits + requested data.' },
  { fc: '0x82 (130)','name': 'Unsolicited Resp',  dir: 'Out → Master', desc: 'Spontaneous report from outstation. Sent when events occur, not when polled.' },
]

export default function FunctionCodes() {
  return (
    <ChapterLayout chapterId="fc" title="Function Codes" emoji="⚙️" prev="objects" next="unsol">
      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Function Codes: The Verbs of DNP3</h2>
        <p>
          The <strong>Function Code</strong> (FC) is the 1-byte value in every APDU that says
          <em> what to do</em>. Read, Write, Operate, Confirm, Restart — these are all function codes.
          Every request has a FC. Every response has a FC. The response FC tells you whether it's a
          normal solicited response (0x81) or an unsolicited push (0x82).
        </p>
        <p className="mt-3">
          DNP3 was designed for utilities, so it includes control function codes that Modbus only handles
          awkwardly. The <strong>Select-Before-Operate</strong> sequence (FC=0x03 followed by FC=0x04)
          is a safety interlock baked directly into the protocol — not a convention, not a best practice,
          but a first-class protocol operation.
        </p>
      </section>

      <div className="overflow-x-auto my-6">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-navy-700 text-white">
              <th className="text-left px-3 py-2 rounded-tl-xl">FC</th>
              <th className="text-left px-3 py-2">Name</th>
              <th className="text-left px-3 py-2">Direction</th>
              <th className="text-left px-3 py-2 rounded-tr-xl">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {FUNCTION_CODES.map((row, i) => (
              <tr key={row.fc} className={i % 2 === 0 ? 'bg-white/5/5' : ''}>
                <td className="px-3 py-2 font-mono font-bold text-amber-400 whitespace-nowrap">{row.fc}</td>
                <td className="px-3 py-2 font-semibold text-slate-300 whitespace-nowrap">{row.name}</td>
                <td className="px-3 py-2 text-slate-400 whitespace-nowrap text-xs">{row.dir}</td>
                <td className="px-3 py-2 text-slate-400">{row.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FunFact index={10} />

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Select-Before-Operate (SBO)</h2>
        <p>
          SBO is DNP3's two-step safety mechanism for critical control operations. It's not optional
          for utility applications — NERC CIP and most utility operating procedures require it for
          switching operations on energized equipment.
        </p>
        <div className="mt-4 bg-slate-800/30 rounded-2xl border border-amber-900/30 p-5">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">1</div>
                <div>
                  <div className="font-semibold text-amber-400">Select (FC=0x03)</div>
                  <div className="text-xs text-slate-400 mt-1">Master sends: "I intend to open Breaker 3A." Outstation validates and responds with the same control block echoed back. If everything matches, outstation arms and starts a countdown timer (typically 5–30 seconds).</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-mcyan-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">2</div>
                <div>
                  <div className="font-semibold text-amber-400">Operate (FC=0x04)</div>
                  <div className="text-xs text-slate-400 mt-1">Master sends: "Operate the control I just selected." Outstation verifies the operate matches the select, verifies the timer hasn't expired, and executes. If any check fails, the operate is rejected.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Callout type="warning" title="SBO Timeout">
        If the Operate doesn't arrive within the SBO timeout window, the outstation cancels the armed
        operation. You'll get a Status=TIMEOUT error on the operate response. This protects against
        the scenario where a Select is sent but the operator has second thoughts (or a network hiccup
        delays the Operate). The window is configurable — usually 5 to 30 seconds depending on vendor.
      </Callout>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Direct Operate vs SBO</h2>
        <p>
          <strong>Direct Operate (FC=0x05)</strong> skips the Select step entirely. One message,
          immediate execution. It's faster but has no built-in second-confirmation step.
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl p-4" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' }}>
            <div className="font-semibold text-green-300 mb-2">When to use Direct Operate</div>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• Low-risk controls (non-critical loads)</li>
              <li>• Automated closed-loop control (setpoint changes)</li>
              <li>• Testing environments</li>
              <li>• Analog output setpoints where SBO overhead isn't warranted</li>
            </ul>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div className="font-semibold text-red-300 mb-2">When SBO is required</div>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• Energized switching operations</li>
              <li>• Breaker operations on transmission or distribution equipment</li>
              <li>• Any operation covered by NERC CIP or utility operating procedures</li>
              <li>• When an accidental operate would cause outages or safety hazards</li>
            </ul>
          </div>
        </div>
      </section>

      <AnalogyCard analogy={ANALOGIES[3]} />

      <GifCard gifKey="checkmark" caption="Select... Operate... Execute ✅" side="right" />

      <FunFact index={11} />

      <ChapterExercise exercise={DNP3_CHAPTER_EXERCISES.fc} />
      <QuizLevels chapterId="fc" />
    </ChapterLayout>
  )
}
