import confetti from 'canvas-confetti';

/**
 * Trigger a confetti celebration
 */
export function celebrateWithConfetti(type: 'small' | 'medium' | 'large' = 'medium') {
  const configs = {
    small: {
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    },
    medium: {
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    },
    large: {
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
    },
  };

  confetti(configs[type]);
}

/**
 * Trigger an epic confetti burst for major milestones
 */
export function celebrateMilestone(streakDays: number) {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  // Determine intensity based on milestone
  const intensity = streakDays >= 100 ? 3 : streakDays >= 30 ? 2 : 1;

  const interval: NodeJS.Timeout = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * intensity * (timeLeft / duration);

    // Fire confetti from both sides
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
}

/**
 * Fire confetti from a specific position
 */
export function celebrateFromPosition(x: number, y: number) {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { x, y },
    colors: ['#0ea5e9', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'],
  });
}

/**
 * Fireworks effect for special occasions
 */
export function celebrateWithFireworks() {
  const duration = 5000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: NodeJS.Timeout = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 100;

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.2, 0.5) },
      colors: ['#0ea5e9', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'],
    });
  }, 400);
}
