"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffBetweenDatesInMs = void 0;
const diffBetweenDatesInMs = (date1, date2) => {
    const date1_ = new Date(date1);
    const date2_ = new Date(date2);
    return (date1_.getTime() - date2_.getTime()).toPrecision(4);
};
exports.diffBetweenDatesInMs = diffBetweenDatesInMs;
