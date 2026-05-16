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

const COMMON_ISSUES = [
  {
    issue: 'No response to polls',
    causes: ['Wrong destination address', 'Baud rate/serial settings mismatch', 'Physical layer failure (cable, connector)', 'Device restarted and link layer needs reset'],
    fix: 'Start with loopback test. Verify serial parameters match exactly. Check physical connections. Send Reset Link (FC=0x00 at data link layer) to reinitialize.'
  },
  {
    issue: 'CRC errors',
    causes: ['EMI/noise on serial cable', 'Cable too long for baud rate', 'Loose connectors', 'Wrong CRC implementation (Modbus CRC instead of DNP3 CRC)'],
    fix: 'Check termination, shielding, and cable routing. Verify CRC-16/DNP polynomial. Lower baud rate if running long cables. Use an oscilloscope to check signal integrity.'
  },
  {
    issue: 'Timeout on every poll',
    causes: ['Response timeout too short for link latency', 'Device processing time exceeds master timeout', 'Fragmented response — master not sending confirms', 'Wrong application sequence number'],
    fix: 'Increase master response timeout. Implement Application Confirm if not doing so. Check application sequence numbers. Verify device profile for max response size.'
  },
  {
    issue: 'Events missing or incomplete',
    causes: ['Class not assigned to points on outstation', 'Unsolicited not enabled', 'Event buffer overflow (IIN2.3)', 'Master not reading event classes in polling'],
    fix: 'Check outstation configuration — which points are assigned to which class. Enable unsolicited. Monitor IIN2.3. Add Class 1/2/3 reads to poll schedule.'
  },
  {
    issue: 'Authentication failures (SA)',
    causes: ['SA version mismatch (v2 vs v5)', 'Shared key mismatch', 'Clock skew too large for replay protection', 'User number mismatch'],
    fix: 'Verify SA version compatibility. Re-provision keys. Synchronize clocks. Check user numbers match on both sides. Use diagnostic logging from both devices.'
  },
]

export default function Troubleshoot() {
  return (
    <ChapterLayout chapterId="troubleshoot" title="Troubleshooting DNP3" emoji="🔍" prev="security" next="lab">
      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">DNP3 Was Designed to Be Diagnosable</h2>
        <p>
          DNP3 was designed by utility engineers who knew that substations are remote, field techs are
          expensive to dispatch, and you need to diagnose problems without being on-site.
          The IIN bits, quality flags, and event timestamps are all diagnostic tools built into the protocol.
        </p>
        <p className="mt-3">
          A good DNP3 troubleshooter reads IIN bits obsessively, watches event buffers, monitors
          sequence numbers, and captures traffic with Wireshark. A bad one guesses and reboots things.
          Be the good one.
        </p>
      </section>

      <Callout type="key" title="The DNP3 Diagnostic Checklist">
        Before you do anything else: (1) Is IIN1.6 set? Device restarted. (2) Is IIN1.4 set? Clock not synced.
        (3) Is IIN2.3 set? Event buffer overflowed — you missed events. (4) Is IIN2.0 set? You're sending a
        function code the device doesn't support. (5) Are all your values showing COMM LOST flag?
        Device isn't talking to its sensors. Start here every time.
      </Callout>

      <FunFact index={7} />

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Common Problems and Fixes</h2>
        <div className="space-y-4">
          {COMMON_ISSUES.map((item) => (
            <div key={item.issue} className="bg-slate-800/40 border border-amber-900/30 rounded-2xl overflow-hidden">
              <div className="bg-red-950/30 border-b border-red-900/40 px-4 py-3">
                <div className="font-bold text-red-500 text-sm">Problem: {item.issue}</div>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Possible Causes</div>
                  <ul className="space-y-1">
                    {item.causes.map((c, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                        <span className="text-red-400 font-bold flex-shrink-0">→</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Fix</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.fix}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Wireshark DNP3 Dissector</h2>
        <p>
          Wireshark has supported DNP3 decoding since version 1.4. It decodes every layer:
          data link frame, transport header, application APDU, and object data. For DNP3 over TCP,
          the default port is <strong>20000</strong>.
        </p>
        <div className="mt-4 bg-slate-900/60 text-green-400 rounded-xl p-4 font-mono text-xs space-y-1">
          <div className="text-slate-400"># Wireshark capture filters for DNP3:</div>
          <div>tcp.port == 20000                    <span className="text-slate-400"># DNP3 over TCP</span></div>
          <div>dnp3                                  <span className="text-slate-400"># All DNP3 frames (requires decode)</span></div>
          <div>dnp3.iin.restart == 1                 <span className="text-slate-400"># Filter for device restart events</span></div>
          <div>dnp3.al.func == 0x82                  <span className="text-slate-400"># Unsolicited responses only</span></div>
          <div>dnp3.al.iin.buffer_overflow == 1      <span className="text-slate-400"># Event buffer overflow flag</span></div>
          <div className="mt-2 text-slate-400"># For serial DNP3: use a serial-to-USB adapter</div>
          <div className="text-slate-400"># and capture with the Serial Monitor plugin or a protocol analyzer</div>
        </div>
      </section>

      <AnalogyCard analogy={ANALOGIES[4]} />

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Interpreting Malformed Frames</h2>
        <p>
          When Wireshark shows a DNP3 frame as "malformed" or you see CRC errors, the frame is corrupt.
          The question is: corrupt at what point?
        </p>
        <div className="mt-4 space-y-2 text-sm">
          {[
            { symptom: 'CRC error on header only', cause: 'Bit error in first 10 bytes — usually physical layer noise on the wire' },
            { symptom: 'CRC error on data block 2+', cause: 'Frame started correctly but noise hit the data payload mid-frame' },
            { symptom: 'Length byte wrong', cause: 'Framing lost — parser found 0x0564 in random noise, not a real frame' },
            { symptom: 'Valid CRC but wrong sequence', cause: 'Duplicate frame retransmit, or sequence counter desynchronized' },
          ].map((row, i) => (
            <div key={i} className="flex gap-4 bg-slate-800/40 rounded-xl px-4 py-3 border border-amber-900/20">
              <span className="font-semibold text-red-500 min-w-48 flex-shrink-0 text-xs">{row.symptom}</span>
              <span className="text-slate-400 text-xs">{row.cause}</span>
            </div>
          ))}
        </div>
      </section>

      <GifCard gifKey="error" caption="Malformed frame? CRC mismatch? Time to Wireshark 🦈" side="right" />

      <FunFact index={8} />

      <ChapterExercise exercise={DNP3_CHAPTER_EXERCISES.troubleshoot} />
      <QuizLevels chapterId="troubleshoot" />
    </ChapterLayout>
  )
}
