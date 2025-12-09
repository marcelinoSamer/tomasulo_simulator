// Data hazard test - RAW dependency chain
// Memory: Mem[0] = 1
// Expected: R1 = 1, R2 = 2, R3 = 4, R4 = 8

LOAD R1, 0(R0)
ADD R2, R1, R1
ADD R3, R2, R2
ADD R4, R3, R3
STORE R4, 4(R0)
