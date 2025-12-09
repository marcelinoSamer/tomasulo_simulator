export const FU_CONFIG = {
    LOAD: { rsCount: 2, latency: 6 },
    STORE: { rsCount: 1, latency: 6 },
    BEQ: { rsCount: 2, latency: 1 },
    CALL: { rsCount: 1, latency: 1 },
    RET: { rsCount: 1, latency: 1 },
    ADD: { rsCount: 4, latency: 2 },
    SUB: { rsCount: 4, latency: 2 },
    NAND: { rsCount: 2, latency: 1 },
    MUL: { rsCount: 1, latency: 12 },
} as const;
