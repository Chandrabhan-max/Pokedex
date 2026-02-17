import { motion, AnimatePresence, Variants } from "framer-motion";
import type { Pokemon } from "../types/pokemon";
import { checkAdvantage, TRAINER_RANKING } from "../hooks/useBattleEngine";


const HealthBar = ({ currentHP, maxHP, name }: { currentHP: number, maxHP: number, name: string }) => {
  const percentage = Math.max(0, Math.min(100, (currentHP / maxHP) * 100));
  const barColor = percentage > 50 ? "bg-green-500" : percentage > 20 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="w-full mt-4 flex flex-col gap-1">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white drop-shadow-md">
        <span>{name} HP</span><span>{Math.floor(currentHP)} / {maxHP}</span>
      </div>
      <div className="h-3 w-full bg-gray-900 rounded-full border-2 border-black overflow-hidden shadow-inner relative">
        <motion.div className={`h-full ${barColor}`} animate={{ width: `${percentage}%` }} transition={{ duration: 0.3 }} />
      </div>
    </div>
  );
};

const FloatingDamage = ({ damage, triggerKey, isP1 }: { damage: number | string | null, triggerKey: number, isP1: boolean }) => {
  const isHeal = typeof damage === 'string' && damage.includes('+');
  const isKO = damage === "K.O.";
  const isCrit = typeof damage === 'string' && damage.includes('CRIT');
  let color = isHeal ? '#4ade80' : isCrit ? '#991b1b' : '#ef4444'; 
  const positionClass = isP1 ? "left-0 md:-left-8" : "right-0 md:-right-8";
  const xAnim = isP1 ? -50 : 50; 
  return (
    <AnimatePresence>
      {(damage !== 0 && damage !== null) && (
        <motion.div key={triggerKey} initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
          animate={{ opacity: isKO ? [0, 1, 1, 1] : [0, 1, 1, 0], y: isKO ? [0, -60, -80, -80] : [0, -60, -80, -120], x: isKO ? [0, xAnim * 0.5, xAnim, xAnim] : [0, xAnim * 0.5, xAnim, xAnim * 1.5], scale: isKO ? [0.5, 1.5, 1.5, 1.5] : [0.5, isCrit ? 1.4 : 1.2, isCrit ? 1.4 : 1.2, 0.8] }}
          exit={{ opacity: 0 }} transition={{ duration: 0.9, times: [0, 0.2, 0.7, 1], ease: "easeOut" }}
          className={`absolute top-1/4 ${positionClass} z-50 ${isCrit ? "font-['Montserrat'] font-[900] tracking-widest" : "font-black tracking-tighter"} text-5xl md:text-6xl italic drop-shadow-[0_4px_4px_rgba(0,0,0,1)]`}
          style={{ color, textShadow: isCrit ? '4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 0 0 25px #ef4444' : '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000' }}
        >
          {typeof damage === 'number' ? `-${damage}` : damage}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const SpeechBubble = ({ text, isP1 }: { text: string, isP1: boolean }) => (
  <motion.div initial={{ opacity: 0, scale: 0.8, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 20 }}
    className={`absolute z-50 bottom-[95%] md:bottom-full mb-4 ${isP1 ? 'left-4 md:-left-4' : 'right-4 md:-right-4'} bg-white text-black px-5 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-[4px] w-max max-w-[220px]`}
    style={{ borderRadius: isP1 ? '24px 24px 24px 4px' : '24px 24px 4px 24px', borderColor: isP1 ? '#ef4444' : '#3b82f6' }}
  >
    <p className="font-black text-sm md:text-[15px] italic leading-tight uppercase tracking-tight text-center">"{text}"</p>
    <div className={`absolute -bottom-3 ${isP1 ? 'left-0' : 'right-0'} w-4 h-6 bg-white border-b-[4px] ${isP1 ? 'border-l-[4px] border-red-500' : 'border-r-[4px] border-blue-500'}`} style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)', transform: isP1 ? 'none' : 'scaleX(-1)' }} />
  </motion.div>
);

export const BattleLog = ({ message }: { message: string }) => (
  <motion.div key={message} initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 1.1, filter: "blur(5px)" }} transition={{ type: "spring", bounce: 0.6, duration: 0.4 
  }} className="absolute top-[30%] inset-x-0 w-full z-[100] pointer-events-none flex justify-center overflow-hidden">
    <div className="relative bg-gradient-to-r from-transparent via-black/95 to-transparent py-4 md:py-6 w-full flex justify-center items-center shadow-[0_0_50px_rgba(0,0,0,0.8)] border-y-2 border-white/10">
      <p className="text-white font-[1000] text-3xl md:text-5xl uppercase italic tracking-tighter drop-shadow-[0_5px_5px_rgba(0,0,0,1)] z-10 text-center px-4" style={{ textShadow: '4px 4px 0px rgba(239, 68, 68, 0.9), -3px -3px 0px rgba(59, 130, 246, 0.9)' }}>{message}</p>
    </div>
  </motion.div>
);

export const arenaShakeVariants: Variants = {
  heavy: { x: [-15, 15, -15, 15, -10, 10, 0], y: [10, -10, 10, -10, 5, -5, 0], transition: { duration: 0.4 } },
  idle: { x: 0, y: 0 }
};

const pulseVariants: Variants = {
  pulse: { scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8], transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const } }
};

type Props = {
  engine: any;
  arena: any;
  trainerOne: any;
  trainerTwo: any;
  playerOnePoke: Pokemon | null;
  playerTwoPoke: Pokemon | null;
  p1SelectUI?: React.ReactNode;
  p2SelectUI?: React.ReactNode;
  centerActionUI?: React.ReactNode;
  bottomActionUI?: React.ReactNode;
  onTrainerOneChange?: () => void;
  onTrainerTwoChange?: () => void;
};

export default function BattleArena({ engine, arena, trainerOne, trainerTwo, playerOnePoke, playerTwoPoke, p1SelectUI, p2SelectUI, centerActionUI, bottomActionUI, onTrainerOneChange, onTrainerTwoChange }: Props) {
  const { isBattling, isFinished, winner, p1HP, p1MaxHP, p2HP, p2MaxHP, combatLog, attackingSlot, defendingSlot, gatheringPowerSlot, activeGlow, floatingDamageP1, floatingDamageP2, p1CheersLeft, p2CheersLeft, handleCheer, getPowerLevel } = engine;

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center min-h-0 mt-4">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-8 md:gap-4 mb-2 flex-1 min-h-0">
          
          <div className="w-full md:w-1/4 flex flex-col items-center justify-center h-full">
              <div className="h-[200px] lg:h-[300px] w-full flex items-center justify-center relative">
                <AnimatePresence>
                  {isBattling && combatLog.side === "p1" && <SpeechBubble text={combatLog.text} isP1={true} />}
                </AnimatePresence>
                <img src={trainerOne?.image} className={`w-full max-h-full object-contain drop-shadow-2xl transition-transform ${trainerOne?.name === "N" || trainerOne?.name === "Blue (Gary Oak)" ? "scale-[1.3]" : "scale-100"}`} alt="T1" />
              </div>
              <div className="flex flex-col items-center gap-2 w-full mt-4 text-center bg-black/40 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                  <h3 className="text-xl font-black italic uppercase text-red-500 tracking-tighter drop-shadow-md">{trainerOne?.name}</h3>
                  {isFinished && winner?.id === playerOnePoke?.id && 
                  <span className="bg-gradient-to-br from-yellow-300 to-yellow-600 text-black px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-md animate-in zoom-in-75">Winner</span>}
                  {isFinished && winner?.id !== playerOnePoke?.id && playerOnePoke && 
                  <span className="bg-gradient-to-br from-red-700 to-red-900 text-white px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-md animate-in zoom-in-75">Loser</span>}
                </div>
                <p className="text-white font-black text-lg uppercase tracking-tighter italic">Rating: {TRAINER_RANKING[trainerOne?.name || ""]}/10</p>
                {!isBattling && !isFinished && onTrainerOneChange && (
                  <button onClick={onTrainerOneChange} 
                  className="mt-2 px-6 py-2 bg-yellow-400 text-black rounded-full font-black text-[10px] uppercase shadow-lg hover:bg-yellow-500 transition-all border-b-4 border-yellow-600 active:translate-y-0.5 active:border-b-0">Change Trainer</button>
                )}
              </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-4 self-center h-full w-full">
              <div className="flex items-center justify-center gap-6 relative w-full">
                  {[playerOnePoke, playerTwoPoke].map((poke, idx) => {
                      const isP1 = idx === 0; const slot = isP1 ? "p1" : "p2";
                      const opponentPoke = isP1 ? playerTwoPoke : playerOnePoke;
                      const hasTypeAdvantage = poke && opponentPoke ? checkAdvantage(poke.types, opponentPoke.types) : false;
                      const isLoser = isFinished && winner !== poke;
                      
                      return (
                        <div key={idx} className="flex flex-col items-center gap-4 relative z-10">
                            {(isBattling || isFinished) && poke && <HealthBar name={poke.name} currentHP={isP1 ? p1HP : p2HP} maxHP={isP1 ? p1MaxHP : p2MaxHP} />}

                            <motion.div 
                              animate={{ boxShadow: activeGlow === slot ? `0px 0px 80px 30px rgba(${isP1?'250,204,21':'239,68,68'}, 0.8), inset 0px 0px 40px rgba(255,255,255,0.4)` : "0px 10px 30px rgba(0,0,0,0.5)", borderColor: activeGlow === slot ? (isP1?"#fef08a":"#f87171") : "#1f2937", backgroundColor: activeGlow === slot ? `rgba(${isP1?'250,204,21':'239,68,68'}, 0.3)` : "rgba(17,24,39,0.9)" }} transition={{ duration: 0.05 }}
                              className={`relative p-6 rounded-[3rem] backdrop-blur-md border-[6px] shadow-2xl flex flex-col items-center justify-center ${isFinished ? "min-w-[280px] h-[380px]" : "min-w-[220px] h-[300px]"}`} style={{ transition: "min-width 0.5s, height 0.5s" }}
                            >
                                {poke ? (
                                    <>
                                        <FloatingDamage damage={isP1 ? floatingDamageP1.val : floatingDamageP2.val} triggerKey={isP1 ? floatingDamageP1.key : floatingDamageP2.key} isP1={isP1} />
                                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col gap-1 items-center">
                                          {!isBattling && !isFinished && poke.types.includes(arena.buff || "") && (
                                              <motion.div variants={pulseVariants} animate="pulse" className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-yellow-400/50 shadow-lg w-max whitespace-nowrap text-center">
                                                <p className="text-[8px] font-black uppercase text-yellow-400 tracking-widest">Arena Boost</p><p className="text-[7px] font-bold text-white leading-tight uppercase mt-0.5">Matching type: <span className="text-green-400">+200 BP</span></p>
                                              </motion.div>
                                          )}
                                          {!isBattling && !isFinished && hasTypeAdvantage && (
                                              <motion.div variants={pulseVariants} animate="pulse" className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-red-500/50 shadow-lg w-max whitespace-nowrap text-center mt-1">
                                                <p className="text-[8px] font-black uppercase text-red-400 tracking-widest">Type Advantage</p><p className="text-[7px] font-bold text-white leading-tight uppercase mt-0.5">Effective: <span className="text-green-400">1.5x ATK</span></p>
                                              </motion.div>
                                          )}
                                        </div>
                                        <div className="flex-1 flex flex-col items-center justify-center w-full mt-4 relative z-20">
                                            <AnimatePresence>
                                              {gatheringPowerSlot === slot && (
                                                <motion.div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                                  {[...Array(4)].map((_, i) => <motion.div key={i} className="absolute w-48 h-48 rounded-full border-[6px] border-red-500/60 shadow-[0_0_40px_rgba(239,68,68,0.8)] mix-blend-screen" initial={{ scale: 2, opacity: 0 }} animate={{ scale: 0.2, opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2, ease: "easeIn" }} />)}
                                                </motion.div>
                                              )}
                                            </AnimatePresence>
                                            <motion.img animate={{ 
                                              x: attackingSlot===slot ? (isP1?50:-50) : defendingSlot===slot ? (isP1?-15:15) : 0, y: isLoser ? 30 : 0, 
                                              scale: attackingSlot===slot ? 1.25 : 1, rotate: defendingSlot===slot ? [0,-5,5,-5,0] : gatheringPowerSlot===slot ? [-2,2,-2,2,0] : 0, 
                                              opacity: isLoser ? 0.5 : 1, filter: defendingSlot===slot ? "brightness(2) contrast(2) drop-shadow(0 0 20px white)" : gatheringPowerSlot===slot ? "brightness(1.5) contrast(1.5) drop-shadow(0 0 60px red) drop-shadow(0 0 100px #ef4444)" : isLoser ? "grayscale(100%) brightness(50%) blur(1px) drop-shadow(0 0 0 transparent)" : "brightness(1) contrast(1) drop-shadow(0 4px 6px rgba(0,0,0,0.5))" 
                                              }} transition={gatheringPowerSlot===slot ? { repeat: Infinity, duration: 0.2 } : { duration: 0.15 }} src={poke.image} className="w-32 h-32 mx-auto object-contain z-20 relative" />
                                            <h2 className="text-xl font-black text-center mt-3 capitalize italic text-white drop-shadow-md">{poke.name}</h2>
                                            <div className="flex justify-center flex-wrap gap-1.5 mt-1.5 mb-2 relative z-20">{poke.types.map(t => <span key={t} className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-md bg-black/40 border border-white/20 text-white/90 shadow-sm backdrop-blur-md">{t}</span>)}</div>  
                                            
                                            {!isBattling && !isFinished && (isP1 ? p1SelectUI : p2SelectUI)}

                                            {isBattling && (
                                              <button disabled={isP1 ? p1CheersLeft === 0 : p2CheersLeft === 0} onClick={() => handleCheer(slot)} 
                                              className={`mt-3 px-6 py-2 rounded-full font-black text-[12px] uppercase transition-all z-50 relative ${(isP1 ? p1CheersLeft === 0 : p2CheersLeft === 0) ? "bg-gray-600 text-gray-400 cursor-not-allowed border-b-[3px] border-gray-800" : "bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.6)] hover:bg-green-400 active:scale-95 border-b-[3px] border-green-700 active:border-b-0 active:translate-y-[3px]"}`}>
                                                👏 Cheer! ({(isP1 ? p1CheersLeft : p2CheersLeft)})
                                              </button>
                                            )}
                                        </div>
                                        {isFinished && (
                                          <div className="w-full mt-2 bg-black/60 p-4 rounded-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-500">
                                            <div className="space-y-2">{poke.stats.map(s => <div key={s.name}><div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/90 mb-1"><span>{s.name}</span><span className="text-yellow-400">{s.value}</span></div><div 
                                            className="h-2 bg-white/20 rounded-full overflow-hidden shadow-inner">
                                              <motion.div initial={{ width: 0 }} animate={{ width: isFinished ? `${(s.value / 150) * 100}%` : 0 }} 
                                              className="h-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]" /></div></div>)}</div>
                                            <div className="mt-3 pt-2 text-center text-xl font-black text-yellow-400 italic border-t border-white/20">TOTAL: {getPowerLevel(poke)}</div>
                                          </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-4 h-[200px]">{isP1 ? p1SelectUI : p2SelectUI}</div>
                                )}
                            </motion.div>
                        </div>
                      )
                  })}
                  <h2 className={`absolute left-[50%] -translate-x-[50%] -translate-y-[50%] text-5xl font-black italic text-yellow-400 drop-shadow-[0_4px_20px_rgba(0,0,0,1)] z-50 pointer-events-none transition-all duration-500 ${isFinished ? "top-[35%]" : "top-[50%]"}`} style={{ animationDuration: '3s' }}>V/S</h2>
              </div>
              {centerActionUI}
          </div>

          <div className="w-full md:w-1/4 flex flex-col items-center justify-center h-full">
             <div className="h-[200px] lg:h-[300px] w-full flex items-center justify-center relative">
              <AnimatePresence>{isBattling && combatLog.side === "p2" && <SpeechBubble text={combatLog.text} isP1={false} />}</AnimatePresence>
                <img src={trainerTwo?.image} className={`w-full max-h-full object-contain drop-shadow-2xl transition-transform ${trainerTwo?.name === "N" || trainerTwo?.name === "Blue (Gary Oak)" ? "scale-[1.5]" : "scale-100"}`} alt="T2" />
              </div>
              <div className="flex flex-col items-center gap-2 w-full mt-4 text-center bg-black/40 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-2xl">
                <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                  <h3 className="text-xl font-black italic uppercase text-blue-500 text-center tracking-tighter leading-none drop-shadow-md">{trainerTwo?.name}</h3>
                  {isFinished && winner?.id === playerTwoPoke?.id && <span className="bg-gradient-to-br from-yellow-300 to-yellow-600 text-black px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-md animate-in zoom-in-75">Winner</span>}
                  {isFinished && winner?.id !== playerTwoPoke?.id && playerTwoPoke && <span className="bg-gradient-to-br from-red-700 to-red-900 text-white px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest shadow-md animate-in zoom-in-75">Loser</span>}
                </div>
                <p className="text-white font-black text-lg uppercase tracking-tighter italic">Rating: {TRAINER_RANKING[trainerTwo?.name || ""]}/10</p>
                {!isBattling && !isFinished && onTrainerTwoChange && (
                  <button onClick={onTrainerTwoChange} className="mt-2 px-6 py-2 bg-yellow-400 text-black rounded-full font-black text-[10px] uppercase shadow-lg hover:bg-yellow-500 transition-all border-b-4 border-yellow-600 active:translate-y-0.5 active:border-b-0">Change Trainer</button>
                )}
              </div>
          </div>
      </div>
      {bottomActionUI}
    </div>
  );
}