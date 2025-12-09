Tomasulo Simulator — CSCE 3301 Project 2

Students:
- Name: Menna Zaid          ID: 900232367
- Name: Marcelino Sedhum    ID: 900231128

Deployed App:
https://tomasulosimulator.vercel.app/

Overview:
This repository contains a Tomasulo algorithm simulator implemented in TypeScript + React Vite.
This simulator implements the 4 stage backend of Tomasulo algorithm along with GUI (BONUS)
to make the algorithm verifiable visually

Quick Start (Tomasulo_Simulator folder):
- Install dev deps:   `npm install`
- Run tests:          `npm test`
- Run dev server:     `npm run dev`  (dev server runs at http://localhost:5174/ by default)

Release Notes
-------------
Implemented Features
- Core simulator: instruction issue, execute, write, commit pipeline with 1-cycle gaps except for execute (N cycle gap).
- Reservation Stations: allocation, operand tracking (Vj/Vk) and tags (Qj/Qk).
- Reorder Buffer (ROB): in-order commit, tracking of ready/committed values.
- Functional Units: configurable latencies; MUL implemented as long-latency unit.
- Memory: read/write via a `Memory` class with enforced 128KB limit (addresses 0..131071).
- Register File: architectural register file with R0 hardwired to 0.
- Assembly parser: two-pass parser with label resolution, supports comments using `//` and `#`.
- UI: React components for editing program, memory editor (with file upload), cycle controls,
  and tables for ROB, RS, register file, memory and instruction timeline.
- Tests: Jest + ts-jest + React Testing Library. Includes unit and integration tests under `Tomasulo_Simulator/tests`.

Assumptions
- Memory and register values are 16-bit (`& 0xffff`) across the simulator.
- Memory addresses are byte-addressed integers and must be within 0-->131071.
- The simulator is single-issue (IPC ≤ 1) and uses static branch handling with repair on misprediction.
- The UI presents architectural (committed) register values — speculative results appear only in RS/ROB.

Known Issues / Limitations (What does not work / caveats)
- Some corner cases in branch prediction or unusual instruction sequences may show differing cycle counts vs other simulators.
- The assembly parser supports a standard instruction subset: LOAD, STORE, ADD, SUB, NAND, MUL, BEQ, CALL, RET, ADDI, JUMP (as BEQ R0,R0,target), NOP.