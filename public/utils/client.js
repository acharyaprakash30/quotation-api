"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getKeys = void 0;
const client_1 = require("@prisma/client");
const prisma = global.prisma || new client_1.PrismaClient();
if (process.env.NODE_ENV === 'development')
    global.prisma = prisma;
const getKeys = (keys) => keys.reduce((obj, k) => (Object.assign(Object.assign({}, obj), { [k]: true })), {});
exports.getKeys = getKeys;
exports.default = prisma;
