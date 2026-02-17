import { useState, useRef, useCallback } from "react";
import type { Pokemon } from "../types/pokemon";

import ash from "../assets/characters/ash.png";
import misty from "../assets/characters/misty.png";
import red from "../assets/characters/red.png";
import cynthia from "../assets/characters/cynthia.png";
import gary from "../assets/characters/gary.png"; 
import leon from "../assets/characters/leon.png";
import lance from "../assets/characters/lance.png";
import steven from "../assets/characters/steven.png";
import n_trainer from "../assets/characters/n.png";
import iris from "../assets/characters/iris.png";

import standardArena from "../assets/arena/standardArena.png";
import jungleBasin from "../assets/arena/jungleBasin.png";
import whirlpoolIsland from "../assets/arena/whirlpoolIsland.png";
import volcanicPit from "../assets/arena/volcanicPit.png";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const TYPE_CHART: Record<string, string[]> = {
  fire: ['grass', 'bug', 'ice', 'steel'], water: ['fire', 'ground', 'rock'], grass: ['water', 'ground', 'rock'],
  electric: ['water', 'flying'], rock: ['fire', 'ice', 'flying', 'bug'], ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
  psychic: ['fighting', 'poison'], ice: ['grass', 'ground', 'flying', 'dragon'], dragon: ['dragon'],
  fairy: ['fighting', 'dragon', 'dark'], fighting: ['normal', 'ice', 'rock', 'dark', 'steel'], flying: ['grass', 'fighting', 'bug'],
  poison: ['grass', 'fairy'], bug: ['grass', 'psychic', 'dark'], ghost: ['psychic', 'ghost'], dark: ['psychic', 'ghost'],
  steel: ['ice', 'rock', 'fairy'], normal: []
};

export const checkAdvantage = (atkTypes: string[], defTypes: string[]) => {
  return atkTypes.some(t1 => defTypes.some(t2 => TYPE_CHART[t1]?.includes(t2)));
};

export const TRAINER_RANKING: Record<string, number> = {
  "Red": 9.7, "Cynthia": 9.4, "Ash Ketchum": 9.1, "Leon": 8.8,
  "Steven Stone": 8.7, "Lance": 8.4, "N": 8.3, "Blue (Gary Oak)": 8.1,
  "Iris": 7.9, "Misty": 7.7
};

export const CHARACTERS = [
  { name: "Red", image: red }, { name: "Cynthia", image: cynthia },
  { name: "Ash Ketchum", image: ash }, { name: "Leon", image: leon },
  { name: "Steven Stone", image: steven }, { name: "Lance", image: lance },
  { name: "N", image: n_trainer }, { name: "Blue (Gary Oak)", image: gary },
  { name: "Iris", image: iris }, { name: "Misty", image: misty },
];

export const ARENAS = [
  { id: "normal", name: "Standard Arena", image: standardArena, buff: null },
  { id: "grass", name: "Jungle Basin", image: jungleBasin, buff: "grass" },
  { id: "water", name: "Whirlpool Island", image: whirlpoolIsland, buff: "water" },
  { id: "fire", name: "Volcanic Pit", image: volcanicPit, buff: "fire" },
];

export const calculatePowerLevel = (poke: Pokemon | null, arenaBuff: string | null) => {
  if (!poke) return 0;
  const base = poke.stats.reduce((acc, s) => acc + s.value, 0);
  return poke.types.includes(arenaBuff || "") ? base + 200 : base; 
};

export const playRetroSound = (type: 'attack' | 'hit' | 'victory' | 'heal' | 'eliminate') => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContext(); const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    
    if (type === 'attack') {
      osc.type = 'square'; osc.frequency.setValueAtTime(400, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.05, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.1);
    } else if (type === 'hit') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'heal') {
      osc.type = 'sine'; osc.frequency.setValueAtTime(600, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.05, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.2);
    } else if (type === 'victory') {
      osc.type = 'square'; const notes = [440, 554, 659, 880];
      notes.forEach((freq, i) => {
        const oscNode = ctx.createOscillator(); const gainNode = ctx.createGain(); oscNode.type = 'square'; oscNode.frequency.value = freq;
        oscNode.connect(gainNode); gainNode.connect(ctx.destination); gainNode.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.15); gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.3);
        oscNode.start(ctx.currentTime + i * 0.15); oscNode.stop(ctx.currentTime + i * 0.15 + 0.3);
      });
    } else if (type === 'eliminate') {
      osc.type = 'sawtooth'; osc.frequency.setValueAtTime(200, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(20, ctx.currentTime + 1.5);
      gain.gain.setValueAtTime(0.1, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 1.5);
    }
  } catch (e) { console.error("Audio blocked", e); }
};

export function useBattleEngine(arenaBuff: string | null) {
  const [isBattling, setIsBattling] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [winner, setWinner] = useState<Pokemon | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  
  const [p1HP, setP1HP] = useState(0);
  const [p1MaxHP, setP1MaxHP] = useState(0);
  const [p2HP, setP2HP] = useState(0);
  const [p2MaxHP, setP2MaxHP] = useState(0);
  const p1HpRef = useRef(0);
  const p2HpRef = useRef(0);
  
  const [combatLog, setCombatLog] = useState<{text: string, side: "p1" | "p2" | "center"}>({ text: "", side: "center" });
  const [attackingSlot, setAttackingSlot] = useState<"p1" | "p2" | null>(null);
  const [defendingSlot, setDefendingSlot] = useState<"p1" | "p2" | null>(null);
  const [gatheringPowerSlot, setGatheringPowerSlot] = useState<"p1" | "p2" | null>(null);
  const [activeGlow, setActiveGlow] = useState<"p1" | "p2" | null>(null);
  
  const [floatingDamageP1, setFloatingDamageP1] = useState<{ val: number | string, key: number }>({ val: 0, key: 0 });
  const [floatingDamageP2, setFloatingDamageP2] = useState<{ val: number | string, key: number }>({ val: 0, key: 0 });
  
  const [p1CheersLeft, setP1CheersLeft] = useState(5);
  const [p2CheersLeft, setP2CheersLeft] = useState(5); 

  const getPowerLevel = useCallback((poke: Pokemon | null) => {
    return calculatePowerLevel(poke, arenaBuff);
  }, [arenaBuff]);

  const initPokemon = useCallback((p1: Pokemon | null, p2: Pokemon | null) => {
    if (p1) { const pow = getPowerLevel(p1) * 2; setP1HP(pow); setP1MaxHP(pow); p1HpRef.current = pow; }
    if (p2) { const pow = getPowerLevel(p2) * 2; setP2HP(pow); setP2MaxHP(pow); p2HpRef.current = pow; }
  }, [getPowerLevel]);

  const resetBattle = useCallback(() => {
    setIsBattling(false); setIsFinished(false); setIsShaking(false); setWinner(null);
    setCombatLog({ text: "", side: "center" }); setAttackingSlot(null); setDefendingSlot(null);
    setActiveGlow(null); setGatheringPowerSlot(null);
    setFloatingDamageP1({ val: 0, key: 0 }); setFloatingDamageP2({ val: 0, key: 0 });
    setP1CheersLeft(5); setP2CheersLeft(5);
  }, []);

  const handleCheer = (slot: "p1" | "p2") => {
    const healAmount = 35; 
    if (slot === "p1") {
      if (p1CheersLeft <= 0) return; setP1CheersLeft(p => p - 1); playRetroSound("heal");
      setP1HP(prev => { const n = prev + healAmount; p1HpRef.current = n; return n; });
      setFloatingDamageP1({ val: `+${healAmount} HP`, key: Math.random() });
    } else {
      if (p2CheersLeft <= 0) return; setP2CheersLeft(p => p - 1); playRetroSound("heal");
      setP2HP(prev => { const n = prev + healAmount; p2HpRef.current = n; return n; });
      setFloatingDamageP2({ val: `+${healAmount} HP`, key: Math.random() });
    }
  };

  const getDynamicAttackText = (attacker: Pokemon, defender: Pokemon, isCrit: boolean) => {
    const highestStat = attacker.stats.reduce((max, stat) => stat.value > max.value ? stat : max, attacker.stats[0]);
    const statName = highestStat.name.replace('-', ' ');
    if (isCrit) return `Finish this! ${attacker.name}, full power ${statName}!!`;
    const attacks = [`${attacker.name}, use your ${statName}!`, `Hit ${defender.name} with everything you've got!`, `Show them your ${statName}, ${attacker.name}!`, `Don't hold back! Attack now!`];
    return attacks[Math.floor(Math.random() * attacks.length)];
  };

  const runBattleSequence = async (p1: Pokemon, p2: Pokemon, t1Name: string, t2Name: string) => {
    setIsBattling(true); setIsFinished(false); setP1CheersLeft(5); setP2CheersLeft(5); setGatheringPowerSlot(null);
    
    const p1HasAdv = checkAdvantage(p1.types, p2.types);
    const p2HasAdv = checkAdvantage(p2.types, p1.types);
    const p1EffectivePower = getPowerLevel(p1) * (p1HasAdv ? 1.5 : 1);
    const p2EffectivePower = getPowerLevel(p2) * (p2HasAdv ? 1.5 : 1);
    
    let finalWinner: Pokemon;
    if (p1.id === p2.id) {
        finalWinner = (TRAINER_RANKING[t1Name] || 0) > (TRAINER_RANKING[t2Name] || 0) ? p1 : p2;
    } else {
        finalWinner = p1EffectivePower > p2EffectivePower ? p1 : p2;
    }
    const winnerSlot = finalWinner === p1 ? "p1" : "p2";
    
    setCombatLog({ text: "The battle begins!", side: "center" });
    await sleep(1500); setCombatLog({ text: "", side: "center" }); await sleep(300); 

    const loserMaxHP = winnerSlot === "p1" ? (getPowerLevel(p2)*2) : (getPowerLevel(p1)*2);
    const damagePerHit = Math.floor(loserMaxHP / 5.5); 
    const turnOrder = ["p1", "p2", "p1", "p2", "p1", "p2", "p1", "p2"];

    for (let i = 0; i < turnOrder.length; i++) {
      const attackerSlot = turnOrder[i];
      const defenderSlot = attackerSlot === "p1" ? "p2" : "p1";
      const attacker = attackerSlot === "p1" ? p1 : p2;
      const defender = attackerSlot === "p1" ? p2 : p1;
      const isCrit = Math.random() < 0.15;
      
      setCombatLog({ text: getDynamicAttackText(attacker, defender, isCrit), side: attackerSlot as "p1" | "p2" });
      await sleep(1800); setCombatLog({ text: "", side: "center" }); await sleep(300); 
      
      setAttackingSlot(attackerSlot as "p1" | "p2"); setActiveGlow(attackerSlot as "p1" | "p2"); playRetroSound("attack");
      await sleep(200); 
      
      setAttackingSlot(null); setDefendingSlot(defenderSlot as "p1" | "p2"); setActiveGlow(defenderSlot as "p1" | "p2"); playRetroSound("hit");
      
      let dmg = damagePerHit + Math.floor(Math.random() * 15);
      if (isCrit) { dmg = dmg * 2; setIsShaking(true); setTimeout(() => setIsShaking(false), 400); }

      if (defenderSlot === "p1") {
        setP1HP(prev => { const n = Math.max(10, prev - dmg); p1HpRef.current = n; return n; }); 
        setFloatingDamageP1({ val: isCrit ? `CRIT! -${dmg}` : dmg, key: Math.random() });
      } else {
        setP2HP(prev => { const n = Math.max(10, prev - dmg); p2HpRef.current = n; return n; });
        setFloatingDamageP2({ val: isCrit ? `CRIT! -${dmg}` : dmg, key: Math.random() });
      }
      
      await sleep(400); setDefendingSlot(null); setActiveGlow(null); await sleep(400); 
    }

    let actualFinalWinner = p1HpRef.current > p2HpRef.current ? p1 : p2;
    if (p1HpRef.current === p2HpRef.current) actualFinalWinner = Math.random() > 0.5 ? p1 : p2; 
    
    const actualWinnerSlot = actualFinalWinner === p1 ? "p1" : "p2";
    const actualLoserSlot = actualWinnerSlot === "p1" ? "p2" : "p1";
    
    setCombatLog({ text: `Gather your ultimate power, ${actualFinalWinner.name}!`, side: actualWinnerSlot });
    setGatheringPowerSlot(actualWinnerSlot); await sleep(2000); setCombatLog({ text: "", side: "center" }); await sleep(300); 
    setCombatLog({ text: `End it now, ${actualFinalWinner.name}!!`, side: actualWinnerSlot });
    await sleep(1200); setCombatLog({ text: "", side: "center" }); await sleep(200); 
    
    setGatheringPowerSlot(null); setAttackingSlot(actualWinnerSlot); setActiveGlow(actualWinnerSlot); playRetroSound("attack");
    await sleep(200); 
    
    setAttackingSlot(null); setDefendingSlot(actualLoserSlot); setActiveGlow(actualLoserSlot); playRetroSound("hit");
    setIsShaking(true); setTimeout(() => setIsShaking(false), 500);

    if (actualLoserSlot === "p1") {
      setFloatingDamageP1({ val: "K.O.", key: Math.random() }); setFloatingDamageP2({ val: 0, key: 0 }); setP1HP(0); p1HpRef.current = 0;
    } else {
      setFloatingDamageP2({ val: "K.O.", key: Math.random() }); setFloatingDamageP1({ val: 0, key: 0 }); setP2HP(0); p2HpRef.current = 0;
    }
    
    await sleep(1000);
    setDefendingSlot(null); setActiveGlow(actualWinnerSlot); setWinner(actualFinalWinner); 
    playRetroSound("victory");
    setIsFinished(true); setIsBattling(false); 
  };

  return {
    isBattling, isFinished, winner, isShaking, p1HP, p1MaxHP, p2HP, p2MaxHP,
    combatLog, attackingSlot, defendingSlot, gatheringPowerSlot, activeGlow,
    floatingDamageP1, floatingDamageP2, p1CheersLeft, p2CheersLeft,
    getPowerLevel, initPokemon, resetBattle, handleCheer, runBattleSequence
  };
}