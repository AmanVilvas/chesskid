import React from 'react';

const pieceNames = {
  k: 'king',
  q: 'queen',
  r: 'rook',
  b: 'bishop',
  n: 'knight',
  p: 'pawn',
};

/** Independent, license-noted SVG artwork used by both the board and piece rail. */
export function CourseChessPiece({ type, color = 'w', className = '' }) {
  const pieceFile = `${color === 'b' ? 'b' : 'w'}${type.toUpperCase()}`;
  const colorName = color === 'b' ? 'black' : 'white';

  return (
    <img
      className={`course-chess-piece-svg ${className}`.trim()}
      src={`/pieces/chessnut/${pieceFile}.svg`}
      alt=""
      aria-hidden="true"
      draggable="false"
      data-piece-name={pieceNames[type]}
      data-piece-color={colorName}
    />
  );
}
