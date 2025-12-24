"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="1e5a7ba9-7cce-5f20-b563-bcfd23982778")}catch(e){}}();

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandler = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = require("fs/promises");
class EventHandler {
    client;
    directory;
    constructor(client, directory) {
        this.client = client;
        this.directory = directory;
        this.load();
    }
    async load() {
        console.log('📥 Loading Events');
        const eventFiles = (await (0, promises_1.readdir)(this.directory)).filter(file => (file.endsWith('.ts') || file.endsWith('.js')) && file !== 'base.ts');
        let loadedCount = 0;
        for (const file of eventFiles) {
            const filePath = path_1.default.join(this.directory, file);
            const eventModule = await Promise.resolve(`${filePath}`).then(s => __importStar(require(s)));
            const eventClass = eventModule.default;
            const event = new eventClass(this.client);
            if (event.once) {
                this.client.once(event.name, (...args) => event.handle(...args));
            }
            else {
                this.client.on(event.name, (...args) => event.handle(...args));
            }
            console.info(`\tℹ️ Loaded ${event.name} ${event.once ? '(once)' : '(on)'} event.`);
            loadedCount++;
        }
        console.log('✅ Events Loaded:', loadedCount);
    }
}
exports.EventHandler = EventHandler;
//# sourceMappingURL=EventHandler.js.map
//# debugId=1e5a7ba9-7cce-5f20-b563-bcfd23982778
