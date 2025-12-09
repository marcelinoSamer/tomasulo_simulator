// Multiple operations test
// Memory: Mem[0] = 10, Mem[4] = 3
// Expected: R1 = 10, R2 = 3, R3 = 13, R4 = 7, R5 = ~(13 & 7)

LOAD R1, 0(R0)
LOAD R2, 4(R0)
ADD R3, R1, R2
SUB R4, R1, R2
NAND R5, R3, R4
STORE R5, 8(R0)
