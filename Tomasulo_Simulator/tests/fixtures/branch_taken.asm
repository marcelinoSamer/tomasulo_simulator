// Branch always taken test (BEQ with same register)
// This should skip the speculative ADD and SUB after BEQ
// Expected: R1 = 10, R2 should NOT be modified (stays 0)

LOAD R1, 0(R0)
BEQ R1, R1, SKIP
ADD R2, R1, R1
SUB R3, R1, R1
SKIP:
STORE R1, 4(R0)
