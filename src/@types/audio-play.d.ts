/* eslint-disable @typescript-eslint/no-explicit-any */
type PlayPauseFunc = () => PlayPauseFunc
declare function playSnd(audio: any): PlayPauseFunc
export = playSnd;
