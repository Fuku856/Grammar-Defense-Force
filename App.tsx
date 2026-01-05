import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { RetroButton } from './components/RetroButton';
import { GameState, GameMode, WordType } from './types';
import { INITIAL_HP, COLORS } from './constants';
import { audioController } from './utils/audio';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [gameMode, setGameMode] = useState<GameMode>(GameMode.NORMAL);
  const [hp, setHp] = useState(INITIAL_HP);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('gdf_highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [isEnglishOnly, setIsEnglishOnly] = useState(false);
  
  // Reference to the shoot action in GameCanvas
  const shootActionRef = useRef<((type: WordType) => void) | null>(null);

  // Resume Audio Context on first interaction
  useEffect(() => {
    const handleInteraction = () => {
      audioController.resume();
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  // BGM Management
  useEffect(() => {
    if (gameState === GameState.MENU) {
      audioController.playMenuBGM();
    } else {
      audioController.stopBGM();
    }
    // Cleanup on unmount
    return () => {
      audioController.stopBGM();
    };
  }, [gameState]);

  // Update High Score when Game Over
  useEffect(() => {
    if (gameState === GameState.GAME_OVER) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('gdf_highscore', score.toString());
      }
    }
  }, [gameState, score, highScore]);

  const startGame = useCallback((mode: GameMode = GameMode.NORMAL) => {
    audioController.resume();
    audioController.stopBGM(); // Explicit stop before start sound
    audioController.playStart();
    setGameMode(mode);
    setHp(INITIAL_HP);
    setScore(0);
    setGameState(GameState.PLAYING);
  }, []);

  const handleShoot = (type: WordType) => {
    if (shootActionRef.current) {
      shootActionRef.current(type);
    }
  };

  const toggleLanguage = () => {
    audioController.resume(); // Ensure context is awake
    audioController.playHit();
    setIsEnglishOnly(prev => !prev);
  };

  return (
    <div className="relative w-full h-[100dvh] bg-neutral-900 flex justify-center items-center overflow-hidden">
      {/* Retro Container */}
      <div className="relative w-full h-full max-w-md bg-black shadow-2xl flex flex-col border-x-4 border-gray-800">
        
        {/* Header / HUD */}
        <div className="h-14 md:h-16 bg-black border-b-4 border-white flex justify-between items-center px-4 shrink-0 z-20">
          <div className="flex flex-col">
             <span className="text-[#39FF14] text-[10px] md:text-xs uppercase tracking-widest">
               {gameState === GameState.MENU ? 'HI-SCORE' : 'SCORE'}
             </span>
             <span className="text-white text-lg md:text-xl leading-none">
               {(gameState === GameState.MENU ? highScore : score).toString().padStart(6, '0')}
             </span>
          </div>
          
          {gameState !== GameState.MENU && (
            <div className="flex gap-1">
               {Array.from({ length: 5 }).map((_, i) => (
                 <svg 
                   key={i} 
                   viewBox="0 0 24 24"
                   className={`w-4 h-4 md:w-5 md:h-5 ${i < hp ? 'fill-[#FF3333]' : 'fill-transparent stroke-gray-600'}`}
                   style={{ filter: i < hp ? 'drop-shadow(0 0 2px #FF3333)' : 'none' }}
                 >
                    <path 
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                      strokeWidth={i < hp ? "0" : "2"}
                    />
                 </svg>
               ))}
            </div>
          )}

          <button 
            onClick={toggleLanguage}
            className="flex flex-col items-end group cursor-pointer"
          >
             <span className="text-[10px] text-gray-400">MODE</span>
             <div className="border border-white px-2 py-0.5 text-xs text-[#00FFFF] hover:bg-white hover:text-black transition-colors pixelated">
                {isEnglishOnly ? 'ENG ONLY' : 'JP & EN'}
             </div>
          </button>
        </div>

        {/* Game Canvas Area */}
        <div className="flex-1 relative bg-black overflow-hidden">
          {/* Scanlines Overlay */}
          <div className="scanlines pointer-events-none opacity-30"></div>
          
          <GameCanvas 
            gameState={gameState}
            gameMode={gameMode}
            setGameState={setGameState}
            hp={hp}
            setHp={setHp}
            score={score}
            setScore={setScore}
            isEnglishOnly={isEnglishOnly}
            actionRef={shootActionRef}
          />

          {/* Start Screen Overlay */}
          {gameState === GameState.MENU && (
             <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center z-30">
                <h1 className="text-4xl md:text-5xl text-[#39FF14] mb-2 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] stroke-white">
                  GRAMMAR<br/>DEFENSE
                </h1>
                <p className="text-[#FF00FF] mb-8 text-sm md:text-base animate-pulse">
                   Target the correct Part of Speech!
                </p>
                
                <div className="flex flex-col gap-4 w-full max-w-[200px]">
                  <RetroButton 
                    label="START MISSION" 
                    color="green" 
                    onClick={() => startGame(GameMode.NORMAL)}
                    className="w-full"
                  />
                  <RetroButton 
                    label="IMABARI MODE" 
                    color="cyan" 
                    onClick={() => startGame(GameMode.IMABARI)}
                    className="w-full"
                  />
                </div>
             </div>
          )}

          {/* Game Over Overlay */}
          {gameState === GameState.GAME_OVER && (
             <div className="absolute inset-0 bg-red-900/40 flex flex-col items-center justify-center p-6 text-center z-30">
                <h2 className="text-5xl text-[#FF3333] mb-4">GAME OVER</h2>
                <div className="mb-8">
                  <p className="text-white">FINAL SCORE</p>
                  <p className="text-3xl text-[#00FFFF]">{score}</p>
                  {score >= highScore && score > 0 && (
                    <p className="text-[#FFD700] text-sm mt-2 animate-pulse">NEW HIGH SCORE!</p>
                  )}
                </div>
                <div className="flex flex-col gap-4 w-full max-w-[200px]">
                  <RetroButton 
                    label="RETRY" 
                    color="cyan" 
                    onClick={() => startGame(gameMode)} // Retry with same mode
                    className="w-full"
                  />
                  <RetroButton 
                    label="MAIN MENU" 
                    color="pink" 
                    onClick={() => setGameState(GameState.MENU)}
                    className="w-full"
                  />
                </div>
             </div>
          )}
        </div>

        {/* Controls Area */}
        {gameState !== GameState.MENU && (
          <div 
            className="h-auto pt-2 px-2 bg-black border-t-4 border-white shrink-0 z-20"
            style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
          >
            <div className="grid grid-cols-3 gap-2 md:gap-4 max-w-sm mx-auto">
              <RetroButton 
                label="NOUN" 
                subLabel={isEnglishOnly ? undefined : "名詞"}
                color="cyan" 
                onClick={() => handleShoot(WordType.NOUN)}
                disabled={gameState !== GameState.PLAYING}
              />
              <RetroButton 
                label="VERB" 
                subLabel={isEnglishOnly ? undefined : "動詞"}
                color="pink" 
                onClick={() => handleShoot(WordType.VERB)}
                disabled={gameState !== GameState.PLAYING}
              />
              <RetroButton 
                label="ADJ" 
                subLabel={isEnglishOnly ? undefined : "形容詞"}
                color="green" 
                onClick={() => handleShoot(WordType.ADJECTIVE)}
                disabled={gameState !== GameState.PLAYING}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default App;