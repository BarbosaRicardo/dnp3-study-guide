import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import AnalogyCard from '../components/AnalogyCard'
import QuizLevels from '../components/QuizLevels'
import ChapterExercise from '../components/ChapterExercise'
import { DNP3_CHAPTER_EXERCISES } from '../data/chapterExercises'
import { ANALOGIES } from '../data/chapters'

export default function AppLayer() {
  return (
    <ChapterLayout chapterId="appLayer" title="Application Layer" emoji="📦" prev="datalink" next="objects">
      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">The APDU: What You Actually Care About</h2>
        <p>
          The Application Layer is where the real work happens. The Application Protocol Data Unit (APDU)
          contains the <strong>Function Code</strong> (what to do), the <strong>data objects</strong>
          (what data), and on responses, the <strong>IIN bits</strong> (how the outstation is feeling).
        </p>
        <p className="mt-3">
          Application Layer messages can be large — much larger than a single Data Link frame can carry.
          That's why the Transport Layer exists. But from the Application Layer's perspective, it just
          sends and receives complete APDUs and lets the lower layers figure out the fragmentation details.
        </p>
      </section>

      {/* APDU structure */}
      <div className="bg-slate-900/60 rounded-2xl overflow-hidden my-6">
        <div className="text-amber-400 text-xs font-bold px-4 py-2 uppercase tracking-widest border-b border-white/10">
          APDU Structure (Request vs Response)
        </div>
        <div className="p-4 space-y-4">
          <div>
            <div className="text-xs text-slate-400 mb-2">Request (Master → Outstation):</div>
            <div className="flex rounded-xl overflow-hidden border border-white/20 text-white text-xs font-mono">
              <div className="frame-field bg-amber-500/100/80 border-r border-white/20">
                <div className="text-amber-400">App Ctrl</div>
                <div>AC</div>
                <div className="text-white/50">1 byte</div>
              </div>
              <div className="frame-field bg-amber-500/100/60 border-r border-white/20">
                <div className="text-amber-400">Func Code</div>
                <div>FC</div>
                <div className="text-white/50">1 byte</div>
              </div>
              <div className="frame-field bg-slate-600/60">
                <div className="text-amber-400">Objects</div>
                <div>Data</div>
                <div className="text-white/50">variable</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-400 mb-2">Response (Outstation → Master):</div>
            <div className="flex rounded-xl overflow-hidden border border-white/20 text-white text-xs font-mono">
              <div className="frame-field bg-amber-500/100/80 border-r border-white/20">
                <div className="text-amber-400">App Ctrl</div>
                <div>AC</div>
                <div className="text-white/50">1 byte</div>
              </div>
              <div className="frame-field bg-amber-500/100/60 border-r border-white/20">
                <div className="text-amber-400">Func Code</div>
                <div>FC=0x81</div>
                <div className="text-white/50">1 byte</div>
              </div>
              <div className="frame-field bg-morange-500/60 border-r border-white/20">
                <div className="text-amber-300">IIN1</div>
                <div>Flags</div>
                <div className="text-white/50">1 byte</div>
              </div>
              <div className="frame-field bg-morange-500/60 border-r border-white/20">
                <div className="text-amber-300">IIN2</div>
                <div>Flags</div>
                <div className="text-white/50">1 byte</div>
              </div>
              <div className="frame-field bg-slate-600/60">
                <div className="text-amber-400">Objects</div>
                <div>Data</div>
                <div className="text-white/50">variable</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Application Control Byte</h2>
        <p>
          The Application Control (AC) byte is the first byte of every APDU. It carries sequencing
          and fragmentation information:
        </p>
        <div className="mt-4 bg-slate-800/30 rounded-xl border border-amber-900/30 p-4 font-mono text-sm">
          <div className="text-slate-400 mb-2">AC byte: [FIR | FIN | CON | UNS | Seq (4 bits)]</div>
          <div className="space-y-2">
            <div className="flex gap-3"><span className="text-amber-400 font-bold w-8">FIR</span><span className="text-slate-300">First fragment — set if this is the first application fragment</span></div>
            <div className="flex gap-3"><span className="text-amber-400 font-bold w-8">FIN</span><span className="text-slate-300">Final fragment — set if this is the last application fragment</span></div>
            <div className="flex gap-3"><span className="text-amber-400 font-bold w-8">CON</span><span className="text-slate-300">Confirm required — master must send an explicit Application Confirm</span></div>
            <div className="flex gap-3"><span className="text-amber-400 font-bold w-8">UNS</span><span className="text-slate-300">Unsolicited response — this message was not triggered by a poll</span></div>
            <div className="flex gap-3"><span className="text-amber-400 font-bold w-8">Seq</span><span className="text-slate-300">Application sequence number (0–15) — matches requests to responses</span></div>
          </div>
        </div>
      </section>

      <FunFact index={6} />

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">IIN Bits — Read These Every Time</h2>
        <p>
          The <strong>Internal Indications (IIN)</strong> are 16 flag bits present in every response.
          They tell you what's happening inside the outstation right now. A good master implementation
          parses IIN on every response. A lazy one ignores them and wonders why things break.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/60 text-white">
                <th className="text-left px-3 py-2 rounded-tl-xl">Bit</th>
                <th className="text-left px-3 py-2">Name</th>
                <th className="text-left px-3 py-2 rounded-tr-xl">Meaning</th>
              </tr>
            </thead>
            <tbody>
              {[
                { bit: 'IIN1.0', name: 'Broadcast', meaning: 'Outstation received a broadcast message' },
                { bit: 'IIN1.1', name: 'Class 1 events', meaning: 'Outstation has Class 1 event data available (high priority)' },
                { bit: 'IIN1.2', name: 'Class 2 events', meaning: 'Outstation has Class 2 event data available' },
                { bit: 'IIN1.3', name: 'Class 3 events', meaning: 'Outstation has Class 3 event data available (low priority)' },
                { bit: 'IIN1.4', name: 'Time sync required', meaning: 'Outstation needs time synchronization — clock drift or first boot' },
                { bit: 'IIN1.5', name: 'Local control', meaning: 'Some outputs are under local (manual) control, ignoring DNP3' },
                { bit: 'IIN1.6', name: 'Device restart', meaning: '⚠️ Outstation just rebooted — all time-stamped events may be unreliable' },
                { bit: 'IIN1.7', name: 'Need time', meaning: 'Outstation requests time synchronization (same as 1.4 on some devices)' },
                { bit: 'IIN2.0', name: 'Function unsupported', meaning: 'Function code not supported by this device' },
                { bit: 'IIN2.1', name: 'Object unknown', meaning: 'Requested Group/Variation not supported' },
                { bit: 'IIN2.2', name: 'Parameter error', meaning: 'Request had invalid parameters' },
                { bit: 'IIN2.3', name: 'Event buffer overflow', meaning: '⚠️ Event buffer filled up — some events were discarded' },
                { bit: 'IIN2.5', name: 'Already executing', meaning: 'A previous operate is still in progress' },
                { bit: 'IIN2.6', name: 'Config corrupt', meaning: '🚨 Outstation configuration is corrupted — call the vendor' },
              ].map((row, i) => (
                <tr key={row.bit} className={i % 2 === 0 ? 'bg-white/5' : ''}>
                  <td className="px-3 py-2 font-mono font-bold text-amber-400">{row.bit}</td>
                  <td className="px-3 py-2 font-medium text-slate-300">{row.name}</td>
                  <td className="px-3 py-2 text-slate-400">{row.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout type="warning" title="IIN1.6 — Device Restart">
        When IIN1.6 (Device Restart) is set, the outstation has just rebooted. This means its event buffer
        is empty, its time might be wrong, and any 'sequence of events' data before the restart is gone.
        The master should: (1) read and clear IIN1.6 by sending a Write IIN1.6=0, (2) sync the time,
        (3) do a full integrity poll (read all Class 0 data). If you don't do this after a restart,
        you'll miss the first several seconds of events post-reboot.
      </Callout>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Fragmentation and Confirm Mechanism</h2>
        <p>
          When a response is too large to fit in a single application fragment (which happens constantly
          for large poll responses), the outstation sends multiple fragments. The master can request
          confirmation of each fragment by setting the <strong>CON bit</strong>.
        </p>
        <p className="mt-3">
          The <strong>Application Confirm</strong> (FC=0x00) is the master's acknowledgment that it
          received a fragment. If the outstation doesn't receive a confirm within its timeout, it retransmits.
          If you misconfigure confirm timeouts — or forget to implement confirms in your master — the
          outstation will retry indefinitely and may eventually stop responding altogether.
        </p>
      </section>

      <AnalogyCard analogy={ANALOGIES[2]} />

      <GifCard gifKey="network" caption="Fragmentation in action — your APDU in pieces" side="left"
      />

      <FunFact index={7} />

      <ChapterExercise exercise={DNP3_CHAPTER_EXERCISES.appLayer} />
      <QuizLevels chapterId="appLayer" />
    </ChapterLayout>
  )
}
