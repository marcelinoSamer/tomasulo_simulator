// Simple load, add, store test
// Memory: Mem[0] = 5, Mem[4] = 3
// Expected: R1 = 5, R2 = 3, R3 = 8, Mem[8] = 8

LOAD R1, 0(R0)
LOAD R2, 4(R0)
ADD R3, R1, R2
STORE R3, 8(R0)
