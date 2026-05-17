import React from 'react'
import ChapterLayout from '../components/ChapterLayout'
import Callout from '../components/Callout'
import FunFact from '../components/FunFact'
import GifCard from '../components/GifCard'
import QuizLevels from '../components/QuizLevels'
import ChapterExercise from '../components/ChapterExercise'
import { DNP3_CHAPTER_EXERCISES } from '../data/chapterExercises'

export default function Security() {
  return (
    <ChapterLayout chapterId="security" title="DNP3 Secure Authentication" emoji="🔒" prev="unsol" next="troubleshoot">
      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Why DNP3 Needed Security</h2>
        <p>
          The original DNP3 protocol had zero security. None. Zip. Any device on the network could send
          any command to any outstation and it would execute. This was acceptable in 1993 when substations
          were air-gapped and the only way in was physical access.
        </p>
        <p className="mt-3">
          Then came Internet-connected SCADA. And Stuxnet. And the Ukraine power grid attacks of 2015 and 2016.
          And a lot of people realized that "don't connect it to the internet" was not a sufficient security strategy
          when every vendor wanted remote access and every IT department wanted IP connectivity.
        </p>
        <p className="mt-3">
          The answer was <strong>DNP3 Secure Authentication (SA)</strong>, standardized in
          <strong> IEC 62351-5</strong> and incorporated into the <strong>IEEE 1815-2012</strong> standard
          as an optional extension. It adds cryptographic authentication to the existing DNP3 protocol
          without requiring a complete replacement.
        </p>
      </section>

      <Callout type="warning" title="SA is Optional But Not Optional">
        DNP3 SA is technically optional in the standard. In practice, if your utility falls under NERC CIP
        (which covers most North American bulk electric system assets), authentication for interactive
        remote access is <em>required</em> under CIP-005 and CIP-007. "We didn't implement SA" is not
        a NERC CIP compliance position. It's a findings report.
      </Callout>

      <FunFact index={5} />

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">SA v2 vs SA v5 — Pick One (They Don't Talk to Each Other)</h2>
        <p>
          There are two versions of DNP3 Secure Authentication in widespread deployment:
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/30 border border-amber-900/30 rounded-xl p-4">
            <div className="font-bold text-amber-400 mb-2">SA Version 2</div>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Published ~2007 (before IEEE 1815)</li>
              <li>• Uses HMAC-SHA1 or HMAC-MD5</li>
              <li>• Pre-shared symmetric keys only</li>
              <li>• Widely deployed in legacy RTUs</li>
              <li>• Vulnerable to known issues in MD5/SHA1</li>
              <li>• Still in field at many utilities</li>
            </ul>
          </div>
          <div className="rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div className="font-bold text-amber-400 mb-2">SA Version 5 (Current)</div>
            <ul className="text-xs text-slate-400 space-y-1">
              <li>• Defined in IEEE 1815-2012</li>
              <li>• HMAC-SHA256 (minimum), HMAC-SHA3 supported</li>
              <li>• Supports asymmetric key exchange (certificate-based)</li>
              <li>• Aggressive Mode for performance</li>
              <li>• Better replay protection</li>
              <li>• Required for new installations at most utilities</li>
            </ul>
          </div>
        </div>
        <Callout type="field" title="SA v2 and SA v5 Are NOT Interoperable">
          If your master runs SA v5 and your outstation only supports SA v2 (or vice versa), they will
          not authenticate. The session will fail with cryptographic errors. Both devices will log
          something unhelpful. You will spend days troubleshooting before finding the version mismatch.
          Check version compatibility BEFORE commissioning. Every time.
        </Callout>
      </section>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">How Authentication Works</h2>
        <p>
          DNP3 SA uses a <strong>challenge-response</strong> mechanism. The verifier (usually the outstation
          for critical functions) challenges the requester (usually the master) to prove it knows the
          shared secret before executing a command.
        </p>
        <div className="mt-4 bg-slate-800/30 rounded-2xl border border-amber-900/30 p-5">
          <div className="font-semibold text-amber-400 mb-4">Challenge-Response Flow (SA v5)</div>
          <div className="space-y-3 text-xs">
            {[
              { step: '1', desc: 'Master sends a command (e.g., Select for a breaker operation)' },
              { step: '2', desc: 'Outstation responds with a Challenge: a random nonce value' },
              { step: '3', desc: 'Master computes HMAC-SHA256 over (nonce + command + sequence + user ID) using the shared key' },
              { step: '4', desc: 'Master sends the Reply containing the HMAC digest' },
              { step: '5', desc: 'Outstation independently computes the same HMAC and compares. Match = authenticated, proceed. No match = reject.' },
            ].map((s) => (
              <div key={s.step} className="flex gap-3">
                <div className="w-6 h-6 bg-amber-500/100 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">{s.step}</div>
                <div className="text-slate-300 pt-0.5">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-amber-400 mb-3">Aggressive Mode</h2>
        <p>
          Normal SA adds 2 round trips per authenticated command (challenge + reply before the command executes).
          For high-frequency operations, this overhead is unacceptable. Enter <strong>Aggressive Mode</strong>.
        </p>
        <p className="mt-3">
          In Aggressive Mode, the master doesn't wait for a challenge. It preemptively includes an HMAC
          in every request using the <em>expected</em> challenge value (based on sequence counters both
          sides maintain). If the HMAC is valid, the outstation executes immediately. If it's invalid,
          the outstation falls back to the full challenge-response exchange.
        </p>
      </section>

      <Callout type="key" title="Replay Protection">
        DNP3 SA includes a <strong>Message Authentication Code (MAC) Sequence Number</strong> that
        increments with each authenticated message. If an attacker captures and replays an authenticated
        command, the sequence number will be stale and the outstation will reject it. No replay attack
        gets through a properly configured SA session. This is critical for utility environments where
        an adversary might capture and replay a breaker close command.
      </Callout>

      <GifCard gifKey="warning" caption="Without SA, anyone on the network can operate your breakers 🔓" side="right"
        body="DNP3 without Secure Authentication carries no cryptographic verification. Any device on the RS-485 bus or TCP network can send a valid-looking OPERATE command. SAv5 adds a HMAC-based challenge-response to critical function codes — OPERATE, Direct Operate, Write Time — without encrypting the full session. The challenge must be answered correctly before the outstation executes any control."
      />

      <FunFact index={6} />

      <ChapterExercise exercise={DNP3_CHAPTER_EXERCISES.security} />
      <QuizLevels chapterId="security" />
    </ChapterLayout>
  )
}
