// 純幾何運算；不自動認定用途，也不作整體合規判斷。
export function calculateClearWidth(width, left, right) {
  if (![width, left, right].every(Number.isFinite)) throw new TypeError('尺寸須為有限數值');
  if (width <= 0 || left < 0 || right < 0 || left + right > width) throw new RangeError('尺寸範圍無效');
  return width - left - right;
}
