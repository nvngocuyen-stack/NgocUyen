import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Gamepad2,
  Trophy,
  RotateCcw,
  Volume2,
  VolumeX,
  Copy,
  CheckCircle2,
  Sparkles,
  Ticket,
  ChevronRight,
  Flame,
  Clock,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import contentData from '../data/contentData.json';
import { VoucherRecord } from '../types';

declare global {
  interface Window {
    onFlappyVoucherWin?: (data: {
      score: number;
      voucherCode: string;
      reward: string;
      timestamp: string;
    }) => void;
    onFlappyVoucherLose?: (data: {
      score: number;
      timestamp: string;
    }) => void;
  }
}

export const GamesSection: React.FC = () => {
  const { games, brand } = contentData;
  const [activeGame, setActiveGame] = useState<'flappy' | 'snake'>('flappy');
  const [savedVouchers, setSavedVouchers] = useState<VoucherRecord[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Load vouchers from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vietinbank_vouchers');
      if (stored) {
        setSavedVouchers(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveVoucher = (code: string, game: 'flappy' | 'snake', reward: string, score: number) => {
    const record: VoucherRecord = {
      id: Date.now().toString(),
      code,
      game,
      reward,
      score,
      date: new Date().toLocaleString('vi-VN'),
    };
    const updated = [record, ...savedVouchers.filter((v) => v.code !== code)];
    setSavedVouchers(updated);
    try {
      localStorage.setItem('vietinbank_vouchers', JSON.stringify(updated));
      localStorage.setItem('vietinbank_last_voucher', code);
    } catch {
      // ignore
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-br from-sky-900 via-sky-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-sky-700/40 relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-300/30 rounded-full text-xs font-semibold text-amber-200">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Chơi vui tại quầy · Nhận quà liền tay</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            {games.title}
          </h2>
          <p className="text-sm sm:text-base text-sky-100/90 leading-relaxed">
            {games.subtitle}
          </p>
        </div>
      </div>

      {/* Game Selector Tabs & Voucher Wallet Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveGame('flappy')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeGame === 'flappy'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            🎮 Flappy Bird: Săn Voucher Xăng
          </button>
          <button
            onClick={() => setActiveGame('snake')}
            className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              activeGame === 'snake'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            🐍 VietinBank Snake Challenge
          </button>
        </div>

        {savedVouchers.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-amber-900">
            <Ticket className="w-4 h-4 text-amber-600" />
            <span>Quý khách đã sở hữu {savedVouchers.length} voucher!</span>
          </div>
        )}
      </div>

      {/* Game Arena */}
      {activeGame === 'flappy' ? (
        <FlappyBirdGame
          onWin={(code, score) =>
            saveVoucher(code, 'flappy', 'Voucher mua 2 lít xăng', score)
          }
        />
      ) : (
        <SnakeGame
          onWin={(code, reward, score) =>
            saveVoucher(code, 'snake', reward, score)
          }
        />
      )}

      {/* Saved Vouchers Wallet Section */}
      {savedVouchers.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Ticket className="w-5 h-5 text-amber-500" />
                <span>Ví Voucher Quà Tặng Đã Nhận Tại Quầy</span>
              </h3>
              <p className="text-xs text-slate-500">
                Đưa mã voucher hoặc màn hình này cho Giao dịch viên tại quầy VietinBank để nhận quà
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedVouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="p-4 bg-gradient-to-br from-amber-50 via-white to-sky-50 rounded-2xl border-2 border-dashed border-amber-300 relative space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800">
                    {voucher.game === 'flappy' ? 'Flappy Bird' : 'Snake Challenge'}
                  </span>
                  <span className="text-[11px] text-slate-400">{voucher.date}</span>
                </div>

                <div className="text-lg font-black text-slate-900 tracking-wider font-mono">
                  {voucher.code}
                </div>

                <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{voucher.reward}</span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-500">Điểm: {voucher.score}</span>
                  <button
                    onClick={() => handleCopyCode(voucher.code)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-900"
                  >
                    {copiedCode === voucher.code ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Sao chép</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* =========================================================================
   GAME 1: FLAPPY BIRD COMPONENT (HTML5 Canvas pure implementation)
   ========================================================================= */
interface FlappyBirdProps {
  onWin: (code: string, score: number) => void;
}

const FlappyBirdGame: React.FC<FlappyBirdProps> = ({ onWin }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Configuration constants
  const WIN_SCORE = 20;
  const GRAVITY = 0.28;
  const JUMP_FORCE = -5.8;
  const PIPE_SPEED = 2.1;
  const PIPE_SPAWN_RATE = 115;
  const PIPE_GAP = 145; // generous gap for banking customers
  const VOUCHER_TEXT = 'Voucher 2 lít xăng';
  const BRAND_NAME = 'VietinBank';
  const GAME_TITLE = 'Chờ vui – Chơi hay – Nhận quà liền tay';

  // Game States: 'start' | 'playing' | 'lose' | 'win'
  const [gameState, setGameState] = useState<'start' | 'playing' | 'lose' | 'win'>('start');
  const [score, setScore] = useState<number>(0);
  const [voucherCode, setVoucherCode] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);

  // Encouragement text computation
  const getEncouragement = (s: number) => {
    if (s < 5) return 'Khởi động nhẹ nhàng!';
    if (s < 10) return 'Tốt lắm, tiếp tục nào!';
    if (s < 15) return 'Một nửa chặng đường rồi!';
    if (s < 20) return 'Sắp nhận quà rồi!';
    return 'Xuất sắc!';
  };

  // Sound synthesis using Web Audio API (no external files needed)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playBeep = (freq: number, type: OscillatorType = 'sine', duration = 0.1) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // audio disabled/unsupported
    }
  };

  const generateVoucherCode = (): string => {
    const random6 = Math.floor(100000 + Math.random() * 900000);
    return `VB-${random6}`;
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Internal loop refs
  const birdRef = useRef({
    x: 60,
    y: 180,
    velocity: 0,
    radius: 16,
    angle: 0,
  });

  interface Pipe {
    x: number;
    topHeight: number;
    bottomHeight: number;
    passed: boolean;
  }
  const pipesRef = useRef<Pipe[]>([]);
  const frameCountRef = useRef<number>(0);
  const scoreRef = useRef<number>(0);
  const reqIdRef = useRef<number | null>(null);
  const stateRef = useRef<'start' | 'playing' | 'lose' | 'win'>('start');

  stateRef.current = gameState;

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  const winGame = useCallback(() => {
    stateRef.current = 'win';
    setGameState('win');
    const newCode = generateVoucherCode();
    setVoucherCode(newCode);
    onWin(newCode, WIN_SCORE);

    // Call external window callback if defined
    if (typeof window.onFlappyVoucherWin === 'function') {
      window.onFlappyVoucherWin({
        score: WIN_SCORE,
        voucherCode: newCode,
        reward: VOUCHER_TEXT,
        timestamp: new Date().toISOString(),
      });
    }

    playBeep(587, 'triangle', 0.2);
    setTimeout(() => playBeep(880, 'triangle', 0.3), 150);

    // Confetti effect
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0284c7', '#ef4444', '#f59e0b', '#ffffff'],
    });
  }, [onWin]);

  const endGame = useCallback((finalScore: number) => {
    stateRef.current = 'lose';
    setGameState('lose');
    triggerShake();
    playBeep(180, 'sawtooth', 0.3);

    // Call external callback
    if (typeof window.onFlappyVoucherLose === 'function') {
      window.onFlappyVoucherLose({
        score: finalScore,
        timestamp: new Date().toISOString(),
      });
    }
  }, []);

  const resetGame = () => {
    birdRef.current = {
      x: 60,
      y: 180,
      velocity: 0,
      radius: 16,
      angle: 0,
    };
    pipesRef.current = [];
    frameCountRef.current = 0;
    scoreRef.current = 0;
    setScore(0);
  };

  const startGame = () => {
    resetGame();
    setGameState('playing');
    stateRef.current = 'playing';
    playBeep(440, 'sine', 0.1);
  };

  const jump = useCallback(() => {
    if (stateRef.current === 'start') {
      startGame();
      return;
    }
    if (stateRef.current === 'playing') {
      birdRef.current.velocity = JUMP_FORCE;
      playBeep(520, 'sine', 0.08);
    }
  }, []);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const render = () => {
      // Background sky
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Gradient background
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, '#e0f2fe');
      skyGrad.addColorStop(0.7, '#bae6fd');
      skyGrad.addColorStop(1, '#f1f5f9');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.beginPath();
      ctx.arc(80, 50, 24, 0, Math.PI * 2);
      ctx.arc(110, 45, 30, 0, Math.PI * 2);
      ctx.arc(140, 50, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(280, 80, 20, 0, Math.PI * 2);
      ctx.arc(305, 75, 26, 0, Math.PI * 2);
      ctx.arc(330, 80, 20, 0, Math.PI * 2);
      ctx.fill();

      // If game is active
      if (stateRef.current === 'playing') {
        frameCountRef.current++;

        // Bird physics
        const bird = birdRef.current;
        bird.velocity += GRAVITY;
        bird.y += bird.velocity;
        bird.angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (bird.velocity * 4 * Math.PI) / 180));

        // Pipe spawning
        if (frameCountRef.current % PIPE_SPAWN_RATE === 0) {
          const minPipe = 40;
          const maxPipe = height - PIPE_GAP - minPipe;
          const topH = Math.floor(Math.random() * (maxPipe - minPipe + 1)) + minPipe;
          const bottomH = height - topH - PIPE_GAP;

          pipesRef.current.push({
            x: width,
            topHeight: topH,
            bottomHeight: bottomH,
            passed: false,
          });
        }

        // Move pipes & collision
        for (let i = pipesRef.current.length - 1; i >= 0; i--) {
          const pipe = pipesRef.current[i];
          pipe.x -= PIPE_SPEED;

          // Check if scored
          if (!pipe.passed && pipe.x + 48 < bird.x) {
            pipe.passed = true;
            scoreRef.current += 1;
            setScore(scoreRef.current);
            playBeep(659, 'sine', 0.1);

            // Win condition reached!
            if (scoreRef.current >= WIN_SCORE) {
              winGame();
              break;
            }
          }

          // Collision detection with upper pipe
          const pipeWidth = 50;
          if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipeWidth &&
            bird.y - bird.radius < pipe.topHeight
          ) {
            endGame(scoreRef.current);
            break;
          }

          // Collision detection with lower pipe
          if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipeWidth &&
            bird.y + bird.radius > height - pipe.bottomHeight
          ) {
            endGame(scoreRef.current);
            break;
          }

          // Remove offscreen
          if (pipe.x + pipeWidth < 0) {
            pipesRef.current.splice(i, 1);
          }
        }

        // Floor / ceiling collision
        if (bird.y + bird.radius >= height - 20 || bird.y - bird.radius <= 0) {
          endGame(scoreRef.current);
        }
      }

      // Draw Pipes (Styled in VietinBank Cyan-Blue with white accent stripes)
      pipesRef.current.forEach((pipe) => {
        const pipeWidth = 50;

        // Top Pipe
        const topGrad = ctx.createLinearGradient(pipe.x, 0, pipe.x + pipeWidth, 0);
        topGrad.addColorStop(0, '#0369a1');
        topGrad.addColorStop(0.5, '#0ea5e9');
        topGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = topGrad;
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);

        // Top pipe cap
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(pipe.x - 4, pipe.topHeight - 16, pipeWidth + 8, 16);
        ctx.strokeStyle = '#bae6fd';
        ctx.lineWidth = 2;
        ctx.strokeRect(pipe.x - 4, pipe.topHeight - 16, pipeWidth + 8, 16);

        // Bottom Pipe
        const botY = height - pipe.bottomHeight;
        const botGrad = ctx.createLinearGradient(pipe.x, botY, pipe.x + pipeWidth, botY);
        botGrad.addColorStop(0, '#0369a1');
        botGrad.addColorStop(0.5, '#0ea5e9');
        botGrad.addColorStop(1, '#0284c7');
        ctx.fillStyle = botGrad;
        ctx.fillRect(pipe.x, botY, pipeWidth, pipe.bottomHeight);

        // Bottom pipe cap
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(pipe.x - 4, botY, pipeWidth + 8, 16);
        ctx.strokeRect(pipe.x - 4, botY, pipeWidth + 8, 16);
      });

      // Ground bar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, height - 20, width, 20);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(0, height - 20, width, 3);

      // Draw Mascot / Winged Card Bird
      const bird = birdRef.current;
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.rotate(bird.angle);

      // Card body
      ctx.fillStyle = '#0284c7'; // VietinBank Blue
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-16, -12, 32, 24, 4);
      ctx.fill();
      ctx.stroke();

      // Card stripe (Gold chip / Red accent)
      ctx.fillStyle = '#ef4444'; // VietinBank red flag
      ctx.fillRect(-16, -4, 32, 4);
      ctx.fillStyle = '#f59e0b'; // Gold chip
      ctx.fillRect(-12, -8, 6, 6);

      // Wing
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      const wingFlap = Math.sin(frameCountRef.current * 0.25) * 6;
      ctx.ellipse(-4, wingFlap, 10, 5, 0.2, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8, -5, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(9, -5, 2, 0, Math.PI * 2);
      ctx.fill();

      // Beak
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.moveTo(14, -4);
      ctx.lineTo(21, -2);
      ctx.lineTo(14, 2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    reqIdRef.current = animationId;

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [winGame, endGame, WIN_SCORE, GRAVITY, JUMP_FORCE, PIPE_SPEED, PIPE_SPAWN_RATE, PIPE_GAP]);

  // Handle keyboard events (Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jump]);

  return (
    <div
      id="flappy-voucher-game"
      ref={containerRef}
      className={`relative bg-white rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto select-none transition-transform ${
        shake ? 'translate-x-1 duration-75' : ''
      }`}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Game Header Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div>
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
            {BRAND_NAME} Minigame
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
            {GAME_TITLE}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title={soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-sky-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Progress & Encouragement Bar during Play */}
      {gameState === 'playing' && (
        <div className="my-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700">
              Điểm: <strong className="text-sky-700 text-sm font-black">{score} / {WIN_SCORE}</strong>
            </span>
            <span className="text-amber-600 animate-bounce">
              {getEncouragement(score)}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-amber-500 h-full rounded-full transition-all duration-150"
              style={{ width: `${Math.min(100, (score / WIN_SCORE) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Canvas Game Arena */}
      <div
        onClick={jump}
        className="relative my-3 rounded-2xl overflow-hidden cursor-pointer shadow-inner border border-slate-300 touch-none flex items-center justify-center bg-sky-100"
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={480}
          className="w-full max-w-[400px] h-[440px] sm:h-[480px] block"
        />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center">
              <Trophy className="w-8 h-8 text-amber-300" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl sm:text-2xl font-black">
                {GAME_TITLE}
              </h4>
              <p className="text-xs sm:text-sm text-sky-200 font-medium">
                Vượt qua {WIN_SCORE} thử thách để nhận {VOUCHER_TEXT}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-900 font-black text-sm rounded-xl shadow-lg transition-transform active:scale-95"
            >
              Bắt đầu chơi ngay
            </button>
            <p className="text-[11px] text-slate-300">
              Chạm màn hình hoặc nhấn phím Space để bay
            </p>
          </div>
        )}

        {/* Lose Overlay */}
        {gameState === 'lose' && (
          <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-2xl">
              😢
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">
                Rất tiếc, bạn đã vượt qua {score}/{WIN_SCORE} thử thách
              </h4>
              <p className="text-xs sm:text-sm text-sky-200">
                Chỉ còn một chút nữa thôi, hãy thử lại nhé!
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 justify-center pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
              >
                Chơi lại
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGameState('start');
                }}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl transition-all"
              >
                Về màn hình chính
              </button>
            </div>
          </div>
        )}

        {/* Win Overlay */}
        {gameState === 'win' && (
          <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center text-3xl animate-bounce">
              🏆
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-black text-amber-300">Chúc mừng!</h4>
              <p className="text-xs sm:text-sm text-white/90">
                Bạn đã vượt qua {WIN_SCORE} thử thách và đủ điều kiện nhận {VOUCHER_TEXT}.
              </p>
            </div>

            {/* Voucher Card Display */}
            <div className="w-full max-w-xs p-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-2xl text-slate-950 shadow-xl space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-800">
                MÃ NHẬN QUÀ TẶNG
              </div>
              <div className="text-2xl font-black tracking-widest font-mono py-1 bg-white/80 rounded-lg">
                {voucherCode}
              </div>
              <p className="text-[11px] font-medium text-slate-900 leading-tight">
                Vui lòng chụp màn hình hoặc đưa mã này cho nhân viên để nhận quà.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 justify-center pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyVoucherCode(voucherCode);
                }}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-800" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép' : 'Sao chép mã'}</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startGame();
                }}
                className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs rounded-xl transition-all"
              >
                Chơi lại
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center text-xs text-slate-400">
        💡 Mẹo: Nhấn nhẹ vào màn hình hoặc ấn phím Space để bay nhịp nhàng qua khe ống.
      </div>
    </div>
  );
};

/* =========================================================================
   GAME 2: SNAKE CHALLENGE COMPONENT (VietinBank Snake Challenge)
   ========================================================================= */
interface SnakeGameProps {
  onWin: (code: string, reward: string, score: number) => void;
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onWin }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const GRID_SIZE = 20;
  const TILE_COUNT = 18; // 18x18 grid = 360x360 canvas
  const SPEED = 110; // ms per step

  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameover'>('start');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [currentTierReward, setCurrentTierReward] = useState<string>('Chưa đạt mốc thưởng');
  const [alertNotice, setAlertNotice] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<{
    score: number;
    reward: string;
    code: string;
    time: string;
    isWinner: boolean;
  } | null>(null);

  const snakeRef = useRef<Array<{ x: number; y: number }>>([
    { x: 9, y: 9 },
    { x: 8, y: 9 },
    { x: 7, y: 9 },
  ]);
  const dirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const nextDirRef = useRef<{ x: number; y: number }>({ x: 1, y: 0 });
  const foodRef = useRef<{ x: number; y: number }>({ x: 14, y: 9 });
  const scoreRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Spawn food safely
  const spawnFood = () => {
    let newX = Math.floor(Math.random() * TILE_COUNT);
    let newY = Math.floor(Math.random() * TILE_COUNT);
    const snake = snakeRef.current;
    while (snake.some((segment) => segment.x === newX && segment.y === newY)) {
      newX = Math.floor(Math.random() * TILE_COUNT);
      newY = Math.floor(Math.random() * TILE_COUNT);
    }
    foodRef.current = { x: newX, y: newY };
  };

  const notifyMilestone = (msg: string) => {
    setAlertNotice(msg);
    setTimeout(() => setAlertNotice(null), 3500);
  };

  const handleGameOver = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const finalScore = scoreRef.current;
    setGameState('gameover');

    let reward = '';
    let isWinner = false;
    let code = '';

    if (finalScore >= 40) {
      reward = '02 voucher xăng, mỗi voucher trị giá 2 lít';
      isWinner = true;
      code = `VB-${Math.floor(100000 + Math.random() * 900000)}`;
      onWin(code, reward, finalScore);
    } else if (finalScore >= 20) {
      reward = '01 voucher xăng trị giá 2 lít';
      isWinner = true;
      code = `VB-${Math.floor(100000 + Math.random() * 900000)}`;
      onWin(code, reward, finalScore);
    } else {
      reward = 'Chưa đạt mốc nhận voucher (cần tối thiểu 20 điểm)';
      isWinner = false;
    }

    setCertificate({
      score: finalScore,
      reward,
      code,
      time: new Date().toLocaleString('vi-VN'),
      isWinner,
    });
  };

  const moveSnake = () => {
    dirRef.current = nextDirRef.current;
    const snake = snakeRef.current;
    const head = {
      x: snake[0].x + dirRef.current.x,
      y: snake[0].y + dirRef.current.y,
    };

    // Wall collision
    if (head.x < 0 || head.x >= TILE_COUNT || head.y < 0 || head.y >= TILE_COUNT) {
      handleGameOver();
      return;
    }

    // Self collision
    if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
      handleGameOver();
      return;
    }

    snake.unshift(head);

    // Food collision
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      scoreRef.current += 1;
      const s = scoreRef.current;
      setScore(s);
      if (s > highScore) setHighScore(s);

      // Milestone rewards detection
      if (s === 20) {
        setCurrentTierReward('01 voucher xăng 2 lít');
        notifyMilestone('🎉 Chúc mừng Quý khách đã đạt 20 điểm! Nhận 01 voucher xăng 2 lít.');
      } else if (s === 40) {
        setCurrentTierReward('02 voucher xăng (mỗi voucher 2 lít)');
        notifyMilestone('🔥 Xuất sắc! Quý khách đã đạt 40 điểm! Nhận 02 voucher xăng 2 lít.');
      }

      spawnFood();
    } else {
      snake.pop();
    }

    draw();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear board
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid pattern
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i < TILE_COUNT; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(canvas.width, i * GRID_SIZE);
      ctx.stroke();
    }

    // Draw Food (VietinBank Gold Coin)
    const food = foodRef.current;
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Red inner dot
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(
      food.x * GRID_SIZE + GRID_SIZE / 2,
      food.y * GRID_SIZE + GRID_SIZE / 2,
      GRID_SIZE / 6,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw Snake
    const snake = snakeRef.current;
    snake.forEach((seg, idx) => {
      if (idx === 0) {
        // Head
        ctx.fillStyle = '#0ea5e9'; // Bright sky blue
      } else {
        // Body
        ctx.fillStyle = idx % 2 === 0 ? '#0284c7' : '#0369a1';
      }
      ctx.beginPath();
      ctx.roundRect(
        seg.x * GRID_SIZE + 1,
        seg.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2,
        idx === 0 ? 5 : 3
      );
      ctx.fill();
    });
  };

  const startGame = () => {
    snakeRef.current = [
      { x: 9, y: 9 },
      { x: 8, y: 9 },
      { x: 7, y: 9 },
    ];
    dirRef.current = { x: 1, y: 0 };
    nextDirRef.current = { x: 1, y: 0 };
    scoreRef.current = 0;
    setScore(0);
    setCurrentTierReward('Chưa đạt mốc thưởng');
    setCertificate(null);
    setGameState('playing');
    spawnFood();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(moveSnake, SPEED);
  };

  useEffect(() => {
    draw();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const dir = dirRef.current;
      if (e.key === 'ArrowUp' && dir.y === 0) {
        nextDirRef.current = { x: 0, y: -1 };
      } else if (e.key === 'ArrowDown' && dir.y === 0) {
        nextDirRef.current = { x: 0, y: 1 };
      } else if (e.key === 'ArrowLeft' && dir.x === 0) {
        nextDirRef.current = { x: -1, y: 0 };
      } else if (e.key === 'ArrowRight' && dir.x === 0) {
        nextDirRef.current = { x: 1, y: 0 };
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const changeDirection = (dx: number, dy: number) => {
    const dir = dirRef.current;
    if (dx !== 0 && dir.x === 0) {
      nextDirRef.current = { x: dx, y: 0 };
    }
    if (dy !== 0 && dir.y === 0) {
      nextDirRef.current = { x: 0, y: dy };
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-4">
      {/* Title & Rules */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-xs font-bold text-sky-700 uppercase tracking-wider">
            VietinBank Gaming
          </span>
          <h3 className="text-lg font-black text-slate-900">
            VietinBank Snake Challenge
          </h3>
          <p className="text-xs text-slate-500">
            Chơi vui tại quầy – Săn voucher xăng hấp dẫn
          </p>
        </div>
      </div>

      {/* Rewards rule overview */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/70">
        <div className="space-y-0.5">
          <p className="font-bold text-slate-700">Mốc 20 điểm:</p>
          <p className="text-emerald-700 font-semibold">Nhận 01 voucher 2 lít xăng</p>
        </div>
        <div className="space-y-0.5">
          <p className="font-bold text-slate-700">Mốc 40 điểm:</p>
          <p className="text-amber-700 font-semibold">Nhận 02 voucher 2 lít xăng</p>
        </div>
      </div>

      {/* Live HUD */}
      <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-3">
          <span>
            Điểm số: <strong className="text-sky-700 text-sm">{score}</strong>
          </span>
          <span>
            Kỷ lục: <strong className="text-slate-900 text-sm">{highScore}</strong>
          </span>
        </div>
        <div className="text-amber-700 font-semibold truncate max-w-[200px]">
          {currentTierReward}
        </div>
      </div>

      {/* Alert toast for reaching milestone without interruption */}
      {alertNotice && (
        <div className="p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs text-center rounded-xl shadow-md animate-pulse">
          {alertNotice}
        </div>
      )}

      {/* Canvas Arena */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center p-2">
        <canvas
          ref={canvasRef}
          width={360}
          height={360}
          className="w-full max-w-[360px] h-[320px] sm:h-[360px] block"
        />

        {gameState === 'start' && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-3xl">
              🐍
            </div>
            <div>
              <h4 className="text-xl font-bold">VietinBank Snake Challenge</h4>
              <p className="text-xs text-sky-200 mt-1">
                Dùng phím mũi tên hoặc nút ảo để điều khiển rắn ăn tiền vàng
              </p>
            </div>
            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md transition-transform active:scale-95"
            >
              Bắt đầu chơi
            </button>
          </div>
        )}
      </div>

      {/* Mobile Touch D-Pad for easy play without physical keyboard */}
      <div className="sm:hidden flex flex-col items-center gap-1.5 pt-2">
        <button
          onClick={() => changeDirection(0, -1)}
          className="w-12 h-10 bg-slate-100 active:bg-sky-200 rounded-lg flex items-center justify-center text-slate-700 shadow-xs"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={() => changeDirection(-1, 0)}
            className="w-12 h-10 bg-slate-100 active:bg-sky-200 rounded-lg flex items-center justify-center text-slate-700 shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => changeDirection(1, 0)}
            className="w-12 h-10 bg-slate-100 active:bg-sky-200 rounded-lg flex items-center justify-center text-slate-700 shadow-xs"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => changeDirection(0, 1)}
          className="w-12 h-10 bg-slate-100 active:bg-sky-200 rounded-lg flex items-center justify-center text-slate-700 shadow-xs"
        >
          <ArrowDown className="w-5 h-5" />
        </button>
      </div>

      {/* Gift Certificate / Phiếu xác nhận quà tặng modal */}
      {certificate && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="text-center space-y-2 border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-widest">
                Ngân hàng TMCP Công Thương Việt Nam
              </span>
              <h4 className="text-xl font-black text-slate-900">
                PHIẾU XÁC NHẬN QUÀ TẶNG
              </h4>
              <p className="text-xs text-slate-500">
                Chương trình: VietinBank Snake Challenge
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 p-4 rounded-2xl text-xs sm:text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Điểm cuối cùng:</span>
                <strong className="text-slate-900 text-base">{certificate.score} điểm</strong>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-slate-500">Mức quà đạt được:</span>
                <strong className="text-right text-emerald-700 font-bold max-w-[220px]">
                  {certificate.reward}
                </strong>
              </div>

              {certificate.isWinner && (
                <div className="flex justify-between items-center bg-amber-100/80 p-2.5 rounded-xl border border-amber-300">
                  <span className="text-amber-950 font-bold">Mã Voucher:</span>
                  <strong className="font-mono text-base font-black text-slate-900">
                    {certificate.code}
                  </strong>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-slate-500">Thời gian hoàn thành:</span>
                <span className="text-slate-700 font-medium">{certificate.time}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 font-medium leading-relaxed">
              📌 Vui lòng chụp màn hình hoặc thông báo với giao dịch viên VietinBank tại quầy để nhận quà.
            </div>

            <div className="flex gap-3">
              <button
                onClick={startGame}
                className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors"
              >
                Chơi lại
              </button>
              <button
                onClick={() => setCertificate(null)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
