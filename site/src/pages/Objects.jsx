import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import QuizLevels from '../components/QuizLevels'

const OBJECT_GROUPS = [
  { group: 'G1',  name: 'Binary Input (Static)',           var: 'V1: packed bit, V2: with flags', note: 'Circuit breaker status, switch position, alarm state' },
  { group: 'G2',  name: 'Binary Input Change (Event)',     var: 'V1: no time, V2: absolute time',  note: 'Breaker trip event with timestamp — this is the good stuff' },
  { group: 'G10', name: 'Binary Output (Static)',          var: 'V1: packed bit, V2: with flags',  note: 'Output relay status — read-back what the output is actually doing' },
  { group: 'G12', name: 'Binary Output Command (CROB)',    var: 'V1: Control Relay Output Block',  note: 'The object you send to operate a breaker or relay' },
  { group: 'G20', name: 'Counter (Static)',                var: 'V1-V8: various sizes/flags',      note: 'MWh meter, pulse accumulator, event counter' },
  { group: 'G22', name: 'Counter Change (Event)',          var: 'V1-V8: with/without timestamps',  note: 'Counter rollover or significant change event' },
  { group: 'G30', name: 'Analog Input (Static)',           var: 'V1: 32-bit int, V5: float',       note: 'Voltage, current, MW, MVAR — any measured value' },
  { group: 'G32', name: 'Analog Input Change (Event)',     var: 'V1-V8: with/without timestamps',  note: 'Deadband-triggered analog change event' },
  { group: 'G40', name: 'Analog Output Status (Static)',   var: 'V1-V4: setpoint readback',        note: 'Read back the current setpoint value' },
  { group: 'G41', name: 'Analog Output Command',           var: 'V1: 32-bit int, V3: float',       note: 'Send a setpoint — voltage setpoint, frequency setpoint, etc.' },
  { group: 'G50', name: 'Time and Date',                   var: 'V1: absolute UTC time',           note: 'Time sync object — master sends current UTC time to outstation' },
  { group: 'G60', name: 'Class Objects',                   var: 'V1: Class 0, V2: Class 1, etc.',  note: 'Request all data of a given class — shorthand for integrity poll' },
]

export default function Objects() {
  return (
    <ChapterLayout chapterId="objects" title="Data Objects & Groups" emoji="🗂️" prev="appLayer" next="fc">
      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">The Group/Variation System</h2>
        <p>
          DNP3 uses a structured object library where every data type is identified by a
          <strong> Group</strong> number and a <strong>Variation</strong> number. Group defines the
          <em> type</em> of data (Binary Input, Analog Input, Counter, etc.). Variation defines
          the <em>format</em> — how many bytes, whether it includes a timestamp, whether quality flags
          are included, and the data precision.
        </p>
        <p className="mt-3">
          This is dramatically more sophisticated than Modbus, where "holding register" is the only
          data type and you have to read the device's documentation to know what a register actually
          means. In DNP3, the data type is self-describing in the protocol.
        </p>
      </section>

      <Callout type="key" title="Static vs Event Objects">
        Every DNP3 data type has two flavors: <strong>Static</strong> (current value) and
        <strong> Event</strong> (a change from the previous value, with a timestamp).
        Group 30 = Analog Input static. Group 32 = Analog Input Event. When you do a Class 0 poll,
        you get static values. When you poll Class 1/2/3, you get events. When things change rapidly,
        you get a lot of events and very few static polls.
      </Callout>

      <FunFact index={8} />

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">The Core Object Groups</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-navy-700 text-white">
                <th className="text-left px-3 py-2 rounded-tl-xl">Group</th>
                <th className="text-left px-3 py-2">Object Type</th>
                <th className="text-left px-3 py-2">Key Variations</th>
                <th className="text-left px-3 py-2 rounded-tr-xl">Typical Use</th>
              </tr>
            </thead>
            <tbody>
              {OBJECT_GROUPS.map((row, i) => (
                <tr key={row.group} className={i % 2 === 0 ? 'bg-white/5/5' : ''}>
                  <td className="px-3 py-2 font-mono font-bold text-amber-400">{row.group}</td>
                  <td className="px-3 py-2 font-medium text-slate-300">{row.name}</td>
                  <td className="px-3 py-2 font-mono text-slate-500">{row.var}</td>
                  <td className="px-3 py-2 text-slate-400">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Object Headers and Qualifier Codes</h2>
        <p>
          Objects in a DNP3 APDU are grouped into <strong>object headers</strong>. Each header specifies
          what data follows using a Group, Variation, Qualifier Code, and optional index/count/range fields.
        </p>
        <div className="mt-4 bg-slate-800/30 rounded-xl border border-amber-900/30 p-4 font-mono text-sm">
          <div className="text-slate-400 mb-2">Object Header format:</div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-amber-500 text-white px-3 py-1 rounded-lg">Group (1 byte)</span>
            <span className="text-slate-400">+</span>
            <span className="bg-mcyan-500 text-white px-3 py-1 rounded-lg">Variation (1 byte)</span>
            <span className="text-slate-400">+</span>
            <span className="bg-mgreen-500 text-white px-3 py-1 rounded-lg">Qualifier (1 byte)</span>
            <span className="text-slate-400">+</span>
            <span className="bg-amber-500 text-white px-3 py-1 rounded-lg">Range/Count/Index</span>
          </div>
          <div className="mt-3 text-xs text-slate-400 space-y-1">
            <div><span className="text-amber-400 font-bold">Qualifier 0x00</span> — Start/Stop index (8-bit), read specific point range</div>
            <div><span className="text-amber-400 font-bold">Qualifier 0x06</span> — No range, all objects — read everything the device has</div>
            <div><span className="text-amber-400 font-bold">Qualifier 0x17</span> — Count of objects (8-bit), used in responses with event data</div>
            <div><span className="text-amber-400 font-bold">Qualifier 0x28</span> — Start/Stop index (16-bit), for devices with many points</div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Quality Flags</h2>
        <p>
          One of DNP3's most underappreciated features: <strong>quality flags</strong>. Most object
          variations include a flags byte that tells you the <em>quality</em> of the data, not just its value.
        </p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { flag: 'ONLINE', color: 'bg-mgreen-50 border-mgreen-200 text-mgreen-500', desc: 'Data is valid and the sensor is communicating' },
            { flag: 'RESTART', color: 'bg-orange-50 border-orange-200 text-orange-500', desc: 'Value was collected after a device restart — possibly unreliable' },
            { flag: 'COMM LOST', color: 'bg-mred-50 border-mred-200 text-mred-500', desc: 'Communication to this sensor is lost — value is stale' },
            { flag: 'REMOTE FORCED', color: 'bg-purple-500/10 border-purple-500/25 text-purple-500', desc: 'Value was forced remotely via DNP3 (for testing)' },
            { flag: 'LOCAL FORCED', color: 'bg-blue-50 border-blue-200 text-blue-500', desc: 'Value was forced locally at the device' },
            { flag: 'OVER RANGE', color: 'bg-amber-50 border-amber-200 text-amber-500', desc: 'Analog value exceeded sensor measurement range' },
          ].map((f) => (
            <div key={f.flag} className={`border rounded-xl p-3 ${f.color}`}>
              <div className="font-bold text-xs">{f.flag}</div>
              <div className="text-xs mt-1 text-slate-400">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <Callout type="pro" title="Never Trust a Value Without Checking Flags">
        Your SCADA historian is recording analog values with a COMM LOST flag — and your trending screen
        looks totally normal because nobody built quality flag awareness into the display. This happens
        constantly. DNP3 gives you quality data. Use it or you're wasting half the protocol's value.
      </Callout>

      <GifCard gifKey="dataModel" caption="Objects: organized, labeled, timestamped 📊" side="right" />

      <FunFact index={9} />

      <ChapterExercise exercise={DNP3_CHAPTER_EXERCISES.objects} />
      <QuizLevels chapterId="objects" />
    </ChapterLayout>
  )
}
