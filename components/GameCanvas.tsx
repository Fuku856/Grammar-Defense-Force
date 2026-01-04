import React, { useRef, useEffect, useState } from 'react';
import { GameState, GameMode, Enemy, Particle, WordData, WordType } from '../types';
import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT, WORD_LIST, IMABARI_WORD_LIST, SPAWN_RATE_MS } from '../constants';
import { audioController } from '../utils/audio';

interface GameCanvasProps {
  gameState: GameState;
  gameMode: GameMode;
  setGameState: (state: GameState) => void;
  hp: number;
  setHp: (fn: (prev: number) => number) => void;
  score: number;
  setScore: (fn: (prev: number) => number) => void;
  isEnglishOnly: boolean;
  actionRef: React.MutableRefObject<((type: WordType) => void) | null>;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  gameMode,
  setGameState,
  hp,
  setHp,
  score,
  setScore,
  isEnglishOnly,
  actionRef,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Mutable game state refs to avoid closure staleness in game loop
  const enemiesRef = useRef<Enemy[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const lastSpawnTimeRef = useRef<number>(0);
  const frameIdRef = useRef<number>(0);
  const gameSpeedRef = useRef<number>(1);
  const lastWordTextRef = useRef<string | null>(null);

  // Track previous game state to detect transitions
  const prevGameStateRef = useRef<GameState>(gameState);

  // Countdown state: 4 (Ready delay), 3, 2, 1, 0 (START), null (Playing)
  const [countdown, setCountdown] = useState<number | null>(null);

  // Helper to spawn enemy
  const spawnEnemy = () => {
    // Select list based on mode
    const list = gameMode === GameMode.IMABARI ? IMABARI_WORD_LIST : WORD_LIST;
    
    let word: WordData;
    let attempts = 0;
    
    // Attempt to pick a word different from the last one
    do {
      word = list[Math.floor(Math.random() * list.length)];
      attempts++;
    } while (word.text === lastWordTextRef.current && list.length > 1 && attempts < 10);
    
    lastWordTextRef.current = word.text;
    
    // Add some margin to x so it doesn't spawn off-screen
    const margin = 80; // Increased margin for potentially longer words
    const x = Math.random() * (CANVAS_WIDTH - margin * 2) + margin;
    
    const newEnemy: Enemy = {
      id: Math.random().toString(36).substr(2, 9),
      x: x,
      y: -60,
      wordData: word,
      speed: (1.5 + Math.random() * 0.5) * gameSpeedRef.current,
      width: 140, // Base width, updated in render
      height: 40,
      isHit: false
    };
    enemiesRef.current.push(newEnemy);

    // Speak the English word
    audioController.speak(word.text);
  };

  // Helper to spawn explosion
  const spawnExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < 15; i++) {
      particlesRef.current.push({
        id: Math.random().toString(),
        x,
        y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 1.0,
        color: color,
        size: Math.random() * 4 + 2
      });
    }
  };

  // Attack logic exposed to parent
  useEffect(() => {
    actionRef.current = (type: WordType) => {
      // Prevent shooting during countdown
      if (gameState !== GameState.PLAYING || countdown !== null) return;

      audioController.playShoot();

      // Find lowest enemy
      let targetIndex = -1;
      let maxY = -1000;

      enemiesRef.current.forEach((enemy, index) => {
        if (enemy.y > maxY) {
          maxY = enemy.y;
          targetIndex = index;
        }
      });

      if (targetIndex !== -1) {
        const target = enemiesRef.current[targetIndex];
        
        // Draw laser effect immediately (visual only, quick hack via canvas context not strictly cleaner but efficient)
        // We will let the loop handle particles, but we can verify hit here
        if (target.wordData.type === type) {
          // Correct!
          spawnExplosion(target.x, target.y, COLORS.ACCENT_GREEN);
          audioController.playExplosion(); // Satisfaction boom
          setScore(s => s + 100);
          enemiesRef.current.splice(targetIndex, 1);
          
          // Gradually increase speed with every kill
          gameSpeedRef.current += 0.02;

        } else {
          // Wrong!
          audioController.playError();
          // Visual feedback for error?
          setHp(h => {
             const newHp = h - 1;
             if (newHp <= 0) {
               setGameState(GameState.GAME_OVER);
               audioController.playGameOverExplosion(); // BIG BOOM
             }
             return newHp;
          });
          // Push enemy back a bit or shake screen? 
          // Let's just spawn red particles at button location (bottom center roughly)
          spawnExplosion(CANVAS_WIDTH / 2, CANVAS_HEIGHT - 50, COLORS.ACCENT_RED);
        }
      }
    };
  }, [gameState, score, setScore, setHp, setGameState, actionRef, countdown]);

  // Helper to draw Imabari Background
  const drawImabariBackground = (ctx: CanvasRenderingContext2D) => {
    // 1. Sky (Deep Twilight Blue)
    const skyGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT * 0.6);
    skyGradient.addColorStop(0, '#000033');
    skyGradient.addColorStop(1, '#1A1A5E');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 2. Stars
    ctx.fillStyle = '#FFFFFF';
    // Use a fixed seed-like pattern for stars to avoid flickering, or just random static ones
    // Since this runs every frame, we should ideally cache it or use deterministic noise.
    // For simplicity, we just draw a few fixed stars.
    const stars = [[50,50], [120,80], [300,40], [400,100], [200,20], [80, 200]];
    stars.forEach(([x,y]) => ctx.fillRect(x,y,2,2));

    // 3. Islands (Green Silhouettes) on horizon
    ctx.fillStyle = '#004d00'; // Dark Green
    ctx.beginPath();
    ctx.moveTo(0, 450);
    ctx.lineTo(80, 380); // Mtn 1
    ctx.lineTo(160, 450);
    ctx.lineTo(240, 400); // Mtn 2
    ctx.lineTo(320, 450);
    ctx.lineTo(400, 350); // Mtn 3
    ctx.lineTo(480, 450);
    ctx.lineTo(480, 640);
    ctx.lineTo(0, 640);
    ctx.fill();

    // 4. Sea (Dark Blue)
    ctx.fillStyle = '#000066';
    ctx.fillRect(0, 450, CANVAS_WIDTH, CANVAS_HEIGHT - 450);
    // Waves
    ctx.fillStyle = '#000099';
    for(let i=0; i<10; i++) {
        ctx.fillRect((i*60 + (frameIdRef.current % 60)), 500, 40, 2);
        ctx.fillRect((i*60 - (frameIdRef.current % 60)) + 30, 550, 40, 2);
    }

    // 5. Shimanami Kaido Bridge (White/Grey)
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 4;
    
    // Towers
    ctx.beginPath();
    // Tower 1
    ctx.moveTo(140, 450);
    ctx.lineTo(140, 250);
    ctx.moveTo(160, 450);
    ctx.lineTo(160, 250);
    // Tower 1 top bar
    ctx.moveTo(130, 280);
    ctx.lineTo(170, 280);

    // Tower 2
    ctx.moveTo(320, 450);
    ctx.lineTo(320, 250);
    ctx.moveTo(340, 450);
    ctx.lineTo(340, 250);
    // Tower 2 top bar
    ctx.moveTo(310, 280);
    ctx.lineTo(350, 280);
    ctx.stroke();

    // Cables
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Main span
    ctx.moveTo(160, 250);
    ctx.quadraticCurveTo(240, 400, 320, 250);
    // Side spans
    ctx.moveTo(140, 250);
    ctx.lineTo(0, 350);
    ctx.moveTo(340, 250);
    ctx.lineTo(480, 350);
    ctx.stroke();

    // Road deck
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#444444';
    ctx.beginPath();
    ctx.moveTo(0, 380);
    ctx.lineTo(480, 380);
    ctx.stroke();
  };

  // Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fix High DPI
    // But we want pixelated, so we might want to stick to internal resolution
    // We will render at CANVAS_WIDTH/HEIGHT and let CSS scale it up
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    ctx.imageSmoothingEnabled = false;

    const render = (time: number) => {
      // Clear or Draw Background
      if (gameMode === GameMode.IMABARI) {
        drawImabariBackground(ctx);
        // Slightly darken background for readability
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
      } else {
        // Normal Black Background
        ctx.fillStyle = COLORS.BACKGROUND;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      if (gameState === GameState.PLAYING) {
        
        // === GAME LOGIC (Only runs if countdown is null/finished) ===
        if (countdown === null) {
          // Spawn
          if (time - lastSpawnTimeRef.current > SPAWN_RATE_MS / gameSpeedRef.current) {
            spawnEnemy();
            lastSpawnTimeRef.current = time;
          }

          // Update Enemies
          for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
            const enemy = enemiesRef.current[i];
            enemy.y += enemy.speed;

            // Hit bottom?
            if (enemy.y > CANVAS_HEIGHT) {
              enemiesRef.current.splice(i, 1);
              setHp(h => {
                const newHp = h - 1;
                if (newHp <= 0) {
                  setGameState(GameState.GAME_OVER);
                  audioController.playGameOverExplosion(); // BIG BOOM
                } else {
                  audioController.playMiss(); // Buzzer sound "Bu-buu"
                }
                return newHp;
              });
              spawnExplosion(enemy.x, CANVAS_HEIGHT - 20, COLORS.ACCENT_RED);
              continue;
            }
          }
        }

        // === DRAWING (Runs always) ===

        // Draw Enemies
        for (let i = enemiesRef.current.length - 1; i >= 0; i--) {
          const enemy = enemiesRef.current[i];
          const boxColor = COLORS.ACCENT_YELLOW;

          ctx.save();
          
          // Setup font to measure text width
          ctx.font = '24px "DotGothic16"';
          const textMetrics = ctx.measureText(enemy.wordData.text);
          const textWidth = textMetrics.width;
          
          // Dynamic box size
          const boxW = Math.max(160, textWidth + 40); // Minimum 160px, or text width + padding
          const boxH = isEnglishOnly ? 40 : 60;
          
          // Draw Box
          ctx.strokeStyle = boxColor;
          ctx.lineWidth = 2;
          ctx.fillStyle = '#000';
          // Center the box around text
          ctx.beginPath();
          ctx.rect(enemy.x - boxW/2, enemy.y - boxH/2, boxW, boxH);
          ctx.fill();
          ctx.stroke();

          // Draw Text
          ctx.fillStyle = COLORS.TEXT_MAIN;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          // English
          const textY = isEnglishOnly ? enemy.y : enemy.y - 10;
          ctx.fillText(enemy.wordData.text, enemy.x, textY);

          // Japanese
          if (!isEnglishOnly) {
             ctx.fillStyle = '#AAAAAA';
             ctx.font = '16px "DotGothic16"';
             ctx.fillText(enemy.wordData.jp, enemy.x, enemy.y + 15);
          }

          ctx.restore();
        }

        // Update & Draw Particles (Particles can move during countdown for effect)
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.05;

          if (p.life <= 0) {
            particlesRef.current.splice(i, 1);
            continue;
          }

          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life;
          ctx.fillRect(p.x, p.y, p.size, p.size);
          ctx.globalAlpha = 1.0;
        }

        // === COUNTDOWN OVERLAY ===
        if (countdown !== null) {
          ctx.save();
          ctx.fillStyle = 'rgba(0,0,0,0.5)';
          ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
          
          ctx.font = '80px "DotGothic16"';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          
          if (countdown === 4) {
             // Ready state (Optional: show READY?)
             ctx.fillStyle = COLORS.ACCENT_CYAN;
             ctx.fillText("READY?", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
          } else if (countdown > 0) {
             ctx.fillStyle = COLORS.ACCENT_YELLOW;
             ctx.fillText(countdown.toString(), CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
             
             // Shadow
             ctx.fillStyle = 'rgba(255,255,255,0.3)';
             ctx.fillText(countdown.toString(), CANVAS_WIDTH / 2 + 4, CANVAS_HEIGHT / 2 + 4);
          } else {
             ctx.fillStyle = COLORS.ACCENT_GREEN;
             ctx.fillText("START!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
          }
          ctx.restore();
          
          // Keep lastSpawnTime updated so enemies don't spawn instantly after countdown
          lastSpawnTimeRef.current = time;
        }
      }

      frameIdRef.current = requestAnimationFrame(render);
    };

    frameIdRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frameIdRef.current);
    };
  }, [gameState, gameMode, isEnglishOnly, setHp, setGameState, countdown]);

  // Reset logic when entering playing state (Initial Setup & Retry)
  useEffect(() => {
    // Detect transition to PLAYING state from any other state
    if (gameState === GameState.PLAYING && prevGameStateRef.current !== GameState.PLAYING) {
       enemiesRef.current = [];
       particlesRef.current = [];
       gameSpeedRef.current = 1;
       
       // Important: Prevent immediate spawn race condition during the first few frames
       // before countdown state is fully processed.
       lastSpawnTimeRef.current = performance.now() + 5000;
       lastWordTextRef.current = null;
       
       // Start with Pre-Countdown state (4) to allow delay
       setCountdown(4);
    }
    
    // Cleanup on MENU
    if (gameState === GameState.MENU) {
        enemiesRef.current = [];
        particlesRef.current = [];
        setCountdown(null);
    }

    // Update previous state
    prevGameStateRef.current = gameState;
  }, [gameState]);

  // Countdown Timer Logic
  useEffect(() => {
    if (countdown === null) return;
    
    let timer: number;

    if (countdown === 4) {
      // "Ready" delay - silent
      timer = window.setTimeout(() => {
        setCountdown(3);
      }, 500); // 0.5s delay
    } else if (countdown > 0) {
      audioController.playCountdownBeep();
      timer = window.setTimeout(() => {
        setCountdown(c => (c !== null ? c - 1 : null));
      }, 1000);
    } else if (countdown === 0) {
      audioController.playCountdownGo();
      timer = window.setTimeout(() => {
        setCountdown(null); // End countdown
      }, 1000);
    }

    return () => window.clearTimeout(timer);
  }, [countdown]);

  return (
    <canvas 
      ref={canvasRef}
      className="w-full h-full object-contain pixelated"
    />
  );
};