/** CSS keyframe animations for canvas elements */

export const ENTRANCE_KEYFRAMES = `
@keyframes ce-fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes ce-slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes ce-slideLeft {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes ce-slideRight {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes ce-scaleIn {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes ce-bounceIn {
  0% { opacity: 0; transform: scale(0.3); }
  50% { opacity: 1; transform: scale(1.1); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
@keyframes ce-flipIn {
  from { opacity: 0; transform: perspective(400px) rotateY(90deg); }
  to { opacity: 1; transform: perspective(400px) rotateY(0); }
}
@keyframes ce-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
@keyframes ce-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
@keyframes ce-shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}
@keyframes ce-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes ce-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
`;

/** Get CSS animation string for entrance animation */
export function getEntranceAnimation(
  entrance: { type: string; duration: number; delay: number } | null,
): string | undefined {
  if (!entrance || entrance.type === "none") return undefined;
  const name = `ce-${entrance.type}`;
  return `${name} ${entrance.duration}ms ease-out ${entrance.delay}ms both`;
}

/** Get CSS animation string for continuous/loop animation */
export function getContinuousAnimation(
  continuous: { type: string; duration: number } | null,
): string | undefined {
  if (!continuous || continuous.type === "none") return undefined;
  const name = `ce-${continuous.type}`;
  return `${name} ${continuous.duration}ms ease-in-out infinite`;
}
