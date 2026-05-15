import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import AnalogyCard from '../components/AnalogyCard'
import QuizLevels from '../components/QuizLevels'
import { ANALOGIES } from '../data/chapters'

const TABLE_PROTOCOLS = [
  { name: 'Modbus RTU/TCP', origin: 'Modicon, 1979', useCase: 'Legacy PLCs, simple sensors, manufacturing', events: 'No — polling only', timestamps: 'No' },
  { name: 'DNP3',           origin: 'Westronic, 1993', useCase: 'Electric utilities, water SCADA, substations', events: 'Yes — Class 1/2/3', timestamps: '48-bit ms UTC' },
  { name: 'IEC 60870-5',    origin: 'IEC, 1990s',      useCase: 'European utilities, telecontrol', events: 'Yes', timestamps: 'Yes' },
  { name: 'IEC 61850',      origin: 'IEC, 2003',       useCase: 'Modern substations, protection relays', events: 'Yes (GOOSE)', timestamps: 'Microsecond' },
]

export default function Intro() {
  return (
    <ChapterLayout chapterId="intro" title="DNP3 Overview" emoji="📡" next="layers">
      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">What Is DNP3?</h2>
        <p>
          DNP3 (Distributed Network Protocol 3) is a set of communications protocols used between
          components in process automation systems. It was developed in 1993 by <strong>Westronic Inc.</strong> for
          the electric utility industry — specifically to give utilities a better way to communicate with
          substations over unreliable, slow serial links.
        </p>
        <p className="mt-3">
          DNP3 was based on the <strong>IEC 60870-5</strong> standard, a European telecontrol protocol, but
          extended it significantly — adding event buffering, quality flags, timestamps, and eventually
          Secure Authentication. Think of it as IEC 60870-5 that went to grad school in North America.
        </p>
      </section>

      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex-1">
          <Callout type="key" title="DNP3 in One Sentence">
            A <strong>Master</strong> polls an <strong>Outstation</strong> (they stopped calling them slaves — progress!),
            but the outstation can also push <strong>unsolicited reports</strong> when events occur, complete with
            <strong> timestamps</strong> down to the millisecond. It's what Modbus would be if it cared about time.
          </Callout>
        </div>
        <GifCard gifKey="welcome" caption="When you finally understand event-driven SCADA 🧠" />
      </div>

      <FunFact index={0} />

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Where Is DNP3 Used?</h2>
        <p>
          DNP3 is the dominant protocol in <strong>North American electric utility SCADA</strong>.
          If you work at a utility, water authority, or oil & gas company and your SCADA talks to field
          RTUs, there is a very high probability those RTUs speak DNP3.
        </p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Electric Utilities', emoji: '⚡', desc: 'Substation RTUs, breaker status, meter data' },
            { label: 'Water Treatment', emoji: '💧', desc: 'Pump stations, tank levels, chlorine dosing' },
            { label: 'Oil & Gas', emoji: '🛢️', desc: 'Pipeline monitoring, compressor stations' },
            { label: 'Transportation', emoji: '🚦', desc: 'Traffic signals, rail, traffic management' },
          ].map((item) => (
            <div key={item.label} className="bg-slate-800/30 rounded-xl p-4 text-center border border-amber-900/30">
              <div className="text-3xl mb-2">{item.emoji}</div>
              <div className="font-semibold text-amber-400 text-sm">{item.label}</div>
              <div className="text-xs text-slate-400 mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">DNP3 vs The Competition</h2>
        <p className="mb-4 text-slate-400 text-sm">Why use DNP3 instead of Modbus, IEC 60870-5, or IEC 61850?</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-navy-700 text-white">
                <th className="text-left px-4 py-3 rounded-tl-xl">Protocol</th>
                <th className="text-left px-4 py-3">Origin</th>
                <th className="text-left px-4 py-3">Primary Use</th>
                <th className="text-left px-4 py-3">Events?</th>
                <th className="text-left px-4 py-3 rounded-tr-xl">Timestamps?</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_PROTOCOLS.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white/5/5' : ''}>
                  <td className="px-4 py-3 font-semibold text-amber-400">{row.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 font-mono">{row.origin}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{row.useCase}</td>
                  <td className="px-4 py-3 text-xs">{row.events}</td>
                  <td className="px-4 py-3 text-xs">{row.timestamps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <Callout type="warning" title="DNP3 is NOT Modbus with timestamps">
        DNP3 has a fundamentally different architecture. The data model, addressing, framing, CRC polynomial,
        and communication pattern are all different. If you approach DNP3 with Modbus muscle memory,
        you will suffer. Start fresh.
      </Callout>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Key Terminology</h2>
        <div className="space-y-3">
          {[
            { term: 'Master',      def: 'The controlling device — initiates polls, issues controls. Usually the SCADA server or EMS.' },
            { term: 'Outstation',  def: 'The field device — RTU, IED, or intelligent relay. Responds to polls and sends unsolicited reports.' },
            { term: 'APDU',        def: 'Application Protocol Data Unit — the top-level payload containing function code and data objects.' },
            { term: 'TPDU',        def: 'Transport Protocol Data Unit — fragments large APDUs into chunks for the data link layer.' },
            { term: 'LPDU',        def: 'Link Protocol Data Unit — the actual frame on the wire, with 0x0564 start bytes and CRC-16/DNP.' },
            { term: 'IIN',         def: 'Internal Indications — 16-bit flag field in every response reporting the outstation\'s health.' },
            { term: 'Group/Var',   def: 'The DNP3 object system — Group specifies data type, Variation specifies format/precision.' },
            { term: 'Class 0/1/2/3', def: 'Data classification — Class 0 = static values, Class 1/2/3 = event buffers by priority.' },
          ].map((item, i) => (
            <div key={i} className="flex gap-3 text-sm">
              <span className="font-bold text-amber-400 min-w-28 flex-shrink-0">{item.term}</span>
              <span className="text-slate-400">{item.def}</span>
            </div>
          ))}
        </div>
      </section>

      <AnalogyCard analogy={ANALOGIES[0]} />

      <GifCard gifKey="thinking" caption="You, realizing DNP3 has timestamps and Modbus doesn't" side="left" />

      <FunFact index={1} />

      <QuizLevels chapterId="intro" />
    </ChapterLayout>
  )
}
