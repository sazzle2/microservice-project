"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var app = express();
var utils_js_1 = require("./utils.js");
var mongodb_1 = require("mongodb");
// TODO questions:
//! questions about design, global database
// how to look inside database inside container
app.use(express.json());
app.use(cors());
var files = [];
var badfiles = [];
function connectDB() {
    return __awaiter(this, void 0, void 0, function () {
        var uri, mongo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    uri = process.env.DATABASE_URL;
                    if (uri === undefined) {
                        throw Error('DATABASE_URL environment variable is not specified');
                    }
                    mongo = new mongodb_1.MongoClient(uri);
                    return [4 /*yield*/, mongo.connect()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Promise.resolve(mongo)];
                case 2: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function initDB(mongo) {
    return __awaiter(this, void 0, void 0, function () {
        var analytics;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    analytics = mongo.db().collection('analytics');
                    return [4 /*yield*/, analytics.insertOne({
                            key: 'analytics', numFiles: 0, readability: {}, badfiles: []
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, analytics];
            }
        });
    });
}
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var mongo, analytics;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connectDB()];
                case 1:
                    mongo = _a.sent();
                    return [4 /*yield*/, initDB(mongo)];
                case 2:
                    analytics = _a.sent();
                    setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var _this = this;
                        return __generator(this, function (_a) {
                            /* Promise.all([
                                axios.post('http://event-bus:4012/events', {
                                    type: 'ShootFileAnalytics'
                                }),
                                axios.post('http://event-bus:4012/events', {
                                    type: 'ShootWordAnalytics'
                                })
                            ]); */
                            analytics = mongo.db().collection('analytics');
                            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                                var indexes;
                                return __generator(this, function (_a) {
                                    indexes = (0, utils_js_1.processFiles)(files);
                                    analytics.updateOne({ key: 'analytics' }, {
                                        $set: {
                                            numFiles: files.length,
                                            readability: (0, utils_js_1.condense)(indexes),
                                            badfiles: badfiles
                                        }
                                    });
                                    return [2 /*return*/];
                                });
                            }); }, 1000 * 60); // wait for ShootAnalytics events to get to other services, and for GetAnalytics events to come in. No rush, we'll wait one minute. This is a completely backend async service, not worried about responding to client quickly.
                            return [2 /*return*/];
                        });
                    }); }, 1000 * 60 * 60 * 24); // night job. Run once every 24 hours for data analytics to be presented to admin. 
                    // TODO: uncomment isAdmin
                    app.get('/analytics', /* isAdmin ,*/ function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                        var results;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, analytics.findOne({ key: 'analytics' })];
                                case 1:
                                    results = _a.sent();
                                    console.log(results);
                                    res.send(results);
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    app.post('/events', function (req, res) {
                        if (req.body.type === 'GetWordAnalytics') {
                            badfiles = req.body.data.files;
                        }
                        else if (req.body.type === 'GetFileAnalytics') {
                            files = req.body.data.files;
                        }
                    });
                    app.listen(4004, function () {
                        console.log('Running on 4004');
                    });
                    return [2 /*return*/];
            }
        });
    });
}
start();