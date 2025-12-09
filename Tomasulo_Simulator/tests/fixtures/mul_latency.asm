// Long latency MUL test
// Tests that MUL takes 12 cycles and dependent instructions wait
// Memory: Mem[0] = 2, Mem[4] = 3
// Expected: R1 = 2, R2 = 3, R3 = 6 (MUL result), R4 = 9 (ADD depends on MUL)

LOAD R1, 0(R0)
LOAD R2, 4(R0)
MUL R3, R1, R2
ADD R4, R3, R2
STORE R4, 8(R0)
