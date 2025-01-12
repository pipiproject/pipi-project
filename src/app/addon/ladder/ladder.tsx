'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './ladder.module.css';

export default function Ladder() {
  const [players, setPlayers] = useState<string[]>(['', '']);
  const [results, setResults] = useState<string[]>(['', '']);
  const [ladderLines, setLadderLines] = useState<boolean[][]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [currentPath, setCurrentPath] = useState<{x: number, y: number}[]>([]);
  const [result, setResult] = useState<string>('');
  const [isAnimating, setIsAnimating] = useState(false);

  const addPlayer = () => {
    if (players.length < 8) {  // 최대 8명으로 제한
      setPlayers([...players, '']);
      setResults([...results, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 2) {  // 최소 2명은 유지
      const newPlayers = players.filter((_, i) => i !== index);
      const newResults = results.filter((_, i) => i !== index);
      setPlayers(newPlayers);
      setResults(newResults);
    }
  };

  const handlePlayerChange = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const handleResultChange = (index: number, value: string) => {
    const newResults = [...results];
    newResults[index] = value;
    setResults(newResults);
  };

  const drawLadder = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const playerCount = players.length;
    const verticalGap = width / (playerCount + 1);
    const horizontalGap = height / (ladderLines.length + 1);

    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 2;

    // 세로선 그리기
    for (let i = 0; i < playerCount; i++) {
      ctx.beginPath();
      ctx.moveTo(verticalGap * (i + 1), 0);
      ctx.lineTo(verticalGap * (i + 1), height);
      ctx.stroke();
    }

    // 가로선 그리기
    for (let i = 0; i < ladderLines.length; i++) {
      for (let j = 0; j < ladderLines[i].length; j++) {
        if (ladderLines[i][j]) {
          ctx.beginPath();
          ctx.moveTo(verticalGap * (j + 1), horizontalGap * (i + 1));
          ctx.lineTo(verticalGap * (j + 2), horizontalGap * (i + 1));
          ctx.stroke();
        }
      }
    }

    // 참가자 이름과 결과 표시
    ctx.font = '14px Arial';
    ctx.fillStyle = '#2c3e50';
    ctx.textAlign = 'center';

    players.forEach((player, i) => {
      ctx.fillText(player, verticalGap * (i + 1), 20);
      ctx.fillText(results[i], verticalGap * (i + 1), height - 10);
    });
  };

  useEffect(() => {
    if (gameStarted && canvasRef.current) {
      // Canvas 크기 설정
      canvasRef.current.width = 600;
      canvasRef.current.height = 400;
      drawLadder();
    }
  }, [gameStarted, ladderLines]);

  const generateLadder = () => {
    const lines: boolean[][] = [];
    const height = 8;  // 사다리 높이

    for (let i = 0; i < height; i++) {
      const row: boolean[] = [];
      for (let j = 0; j < players.length - 1; j++) {
        const prevHasLine = i > 0 && lines[i - 1][j];
        row.push(!prevHasLine && Math.random() > 0.5);
      }
      lines.push(row);
    }

    setLadderLines(lines);
    setGameStarted(true);
  };

  const tracePath = (startIndex: number) => {
    let currentX = startIndex;
    let currentY = 0;
    const path: {x: number, y: number}[] = [{x: currentX, y: currentY}];

    while (currentY < ladderLines.length) {
      // 왼쪽으로 이동 가능한지 확인
      if (currentX > 0 && ladderLines[currentY][currentX - 1]) {
        currentX--;
        path.push({x: currentX, y: currentY});
      }
      // 오른쪽으로 이동 가능한지 확인
      else if (currentX < ladderLines[currentY].length && ladderLines[currentY][currentX]) {
        currentX++;
        path.push({x: currentX, y: currentY});
      }
      currentY++;
      path.push({x: currentX, y: currentY});
    }

    return { path, endIndex: currentX };
  };

  const animatePath = (path: {x: number, y: number}[], currentStep = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const playerCount = players.length;
    const verticalGap = width / (playerCount + 1);
    const horizontalGap = height / (ladderLines.length + 1);

    // 기존 사다리 다시 그리기
    drawLadder();

    // 경로 그리기
    ctx.beginPath();
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;

    // 시작점 수정
    const startX = verticalGap * (path[0].x + 1);
    ctx.moveTo(startX, horizontalGap);  // y 좌표를 horizontalGap으로 수정

    // 현재 스텝까지만 그리기
    for (let i = 0; i <= currentStep; i++) {
      const x = verticalGap * (path[i].x + 1);
      const y = horizontalGap * (path[i].y + 1);  // y 좌표 계산 수정
      ctx.lineTo(x, y);
    }
    ctx.stroke();

    // 다음 스텝이 있으면 애니메이션 계속
    if (currentStep < path.length - 1) {
      setTimeout(() => {  // requestAnimationFrame 대신 setTimeout 사용
        requestAnimationFrame(() => {
          animatePath(path, currentStep + 1);
        });
      }, 100);  // 100ms 딜레이 추가 (숫자를 조절하여 속도 변경 가능)
    } else {
      setIsAnimating(false);
      const endIndex = path[path.length - 1].x;
      setResult(`${players[path[0].x]}님의 결과: ${results[endIndex]}`);
    }
  };

  const handleLineClick = (index: number) => {
    if (!gameStarted || isAnimating) return;
    
    setIsAnimating(true);
    setResult('');
    const { path, endIndex } = tracePath(index);
    setCurrentPath(path);
    animatePath(path);
    setSelectedLine(index);
  };

  // Canvas 클릭 이벤트 핸들러 수정
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleClick = (e: MouseEvent) => {
      if (isAnimating) return;  // 애니메이션 중에는 클릭 무시

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = canvas.width;
      const playerCount = players.length;
      const verticalGap = width / (playerCount + 1);

      for (let i = 0; i < playerCount; i++) {
        const lineX = verticalGap * (i + 1);
        if (Math.abs(x - lineX) < 20) {
          handleLineClick(i);
          break;
        }
      }
    };

    canvas.addEventListener('click', handleClick);
    return () => canvas.removeEventListener('click', handleClick);
  }, [gameStarted, players, results, ladderLines, isAnimating]);

  return (
    <div className={styles.container}>
      <h1>사다리 게임</h1>
      
      <div className={styles.inputSection}>
        {players.map((player, index) => (
          <div key={index} className={styles.playerInput}>
            <input
              type="text"
              value={player}
              onChange={(e) => handlePlayerChange(index, e.target.value)}
              placeholder={`참가자 ${index + 1}`}
              className={styles.input}
            />
            <input
              type="text"
              value={results[index]}
              onChange={(e) => handleResultChange(index, e.target.value)}
              placeholder={`결과 ${index + 1}`}
              className={styles.input}
            />
            {players.length > 2 && (
              <button onClick={() => removePlayer(index)} className={styles.removeButton}>
                삭제
              </button>
            )}
          </div>
        ))}
        
        {players.length < 8 && (
          <button onClick={addPlayer} className={styles.addButton}>
            참가자 추가
          </button>
        )}
      </div>

      <button 
        onClick={generateLadder} 
        className={styles.startButton}
        disabled={players.some(p => !p) || results.some(r => !r)}
      >
        게임 시작
      </button>

      {gameStarted && (
        <div className={styles.ladderContainer}>
          <canvas 
            ref={canvasRef} 
            className={`${styles.ladder} ${isAnimating ? styles.animating : ''}`}
          ></canvas>
          {result && (
            <div className={styles.result}>
              {result}
            </div>
          )}
        </div>
      )}
    </div>
  );
}