import { useState, useEffect, useRef, useCallback } from 'react';

const WORDS_BY_LEVEL = {
  1: ['마법', '기사', '드래곤', '성', '주문', '방패', '칼', '용사', '모험', '마왕'],
  2: ['마법의 성에 가요', '용사가 칼을 휘두릅니다', '드래곤이 불을 뿜어요', '비밀 보물을 찾으세요', '요정이 하늘을 날아요'],
  3: ['어두운 숲속에서 마왕을 물리치세요', '용기는 지혜보다 강한 무기입니다', '마법 주문을 외워 적을 물리쳐라', '전설 속의 보물을 찾아 떠나는 여행', '하늘을 나는 요정이 길을 알려줘요']
};

export default function App() {
  const [gameState, setGameState] = useState<'TITLE_MENU' | 'PLAYING' | 'PAUSED' | 'ROUND_SUMMARY' | 'GAME_OVER'>('TITLE_MENU');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(1);
  const [targetWord, setTargetWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [remainingWords, setRemainingWords] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  const nextWord = useCallback((words: string[]) => {
    if (words.length === 0) {
      const newWords = [...WORDS_BY_LEVEL[difficulty]].sort(() => Math.random() - 0.5);
      setTargetWord(newWords[0]);
      setRemainingWords(newWords.slice(1));
    } else {
      setTargetWord(words[0]);
      setRemainingWords(words.slice(1));
    }
    setUserInput('');
  }, [difficulty]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameState === 'PLAYING') {
      const shuffled = [...WORDS_BY_LEVEL[difficulty]].sort(() => Math.random() - 0.5);
      nextWord(shuffled);
      inputRef.current?.focus();
    }
  }, [gameState, difficulty, nextWord]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'PLAYING') return;
    
    const value = e.target.value;
    if (value === targetWord) {
      nextWord(remainingWords);
    } else {
      setUserInput(value);
    }
  };

  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const animate = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        ctx.fillStyle = 'black';
        ctx.font = '48px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(targetWord, canvasRef.current.width / 2, 80);
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [gameState, targetWord, userInput]);

  return (
    <div className="w-full h-screen bg-[#FDB813] flex flex-col items-center justify-center p-4 font-mono">
      {gameState === 'TITLE_MENU' && (
        <div className="text-center border-4 border-black p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-5xl font-bold text-black mb-8">타자 챔피언</h1>
          <div className="flex gap-4 mb-8">
            {[1, 2, 3].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDifficulty(lvl as 1 | 2 | 3)}
                className={`px-4 py-2 border-2 border-black font-bold ${difficulty === lvl ? 'bg-black text-white' : 'bg-white'}`}
              >
                {lvl}단계
              </button>
            ))}
          </div>
          <button
            onClick={() => setGameState('PLAYING')}
            className="px-8 py-4 bg-white border-2 border-black text-xl font-bold hover:bg-black hover:text-white transition-colors"
          >
            게임 시작
          </button>
        </div>
      )}
      {(gameState === 'PLAYING' || gameState === 'PAUSED') ? (
          <div 
            className="flex flex-col items-center cursor-text"
            onClick={() => inputRef.current?.focus()}
          >
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="opacity-0 absolute"
              autoFocus
            />
            <div className="flex items-center gap-8 mb-4">
              <div className="text-6xl">🐰</div> {/* Usagi placeholder */}
              <div className="border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-lg font-bold">마법 주문을 입력하여 물리치세요!</p>
              </div>
            </div>
            <canvas ref={canvasRef} width={800} height={150} className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-4" />
            <div className="border-4 border-black bg-white p-4 w-[800px] text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-2xl font-bold text-[#E11D48] tracking-widest">{userInput || '입력하세요...'}</p>
            </div>
          </div>
        ) : null
      }
      <div className="fixed bottom-0 w-full h-16 bg-[#4A7C59] border-t-4 border-black" />
      <div className="fixed bottom-16 w-full h-8 bg-[#8B4513] border-t-4 border-black" />
    </div>
  );
}
