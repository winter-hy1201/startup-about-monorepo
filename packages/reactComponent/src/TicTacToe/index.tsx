import _ from 'lodash';
import React, { useEffect, useState, type FC } from 'react';

const FirstHandPiece = 'X';
const BackhandPiece = 'O';

const COVER_PROMPT = '棋盘已经填满拉,不允许再落子了';
const WIN_PROMPT = '已经有胜利者了，不允许再落子了';

const ChessPieces = ({
  value,
  index,
  parentIndex,
  clickCallBack,
}: {
  value: string | null;
  index: number;
  parentIndex: number;
  clickCallBack: any;
}) => {
  const clickChessPieces = () => {
    console.log('父级index', parentIndex, '当前二维index', index);
    clickCallBack(index, parentIndex);
  };

  return (
    <div
      className="flex justify-center items-center border w-16 h-16"
      onClick={clickChessPieces}
    >
      {value}
    </div>
  );
};

const TicTacToe: FC = () => {
  const [currentChessPieces, setCurrentChessPieces] = useState(FirstHandPiece);

  const [board, setBoard] = useState([
    Array(3).fill(null),
    Array(3).fill(null),
    Array(3).fill(null),
  ]);

  //校验是否有胜利者
  const isWin = () => {
    // 检查每一行
    for (let i = 0; i < 3; i++) {
      if (
        board[i][0] !== null &&
        board[i][0] === board[i][1] &&
        board[i][1] === board[i][2]
      ) {
        return true;
      }
    }

    // 检查每一列
    for (let j = 0; j < 3; j++) {
      if (
        board[0][j] !== null &&
        board[0][j] === board[1][j] &&
        board[1][j] === board[2][j]
      ) {
        return true;
      }
    }

    // 检查对角线
    if (
      board[0][0] !== null &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]
    ) {
      return true;
    }
    if (
      board[0][2] !== null &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0]
    ) {
      return true;
    }

    return false;
  };

  //校验棋盘是否已下满
  const isCover = (): boolean => {
    return board.every((i) => i.every((j) => j !== null));
  };

  useEffect(() => {
    if (isWin()) {
      alert(
        `胜利属于你!  ${
          currentChessPieces === FirstHandPiece ? BackhandPiece : FirstHandPiece
        }`,
      );
    }
  }, [board]);

  const clickCallBack = (subIndex: number, parentIndex: number) => {
    console.log('subIndex', subIndex, 'parentIndex', parentIndex);
    if (isCover() || isWin()) {
      alert(isCover() ? COVER_PROMPT : WIN_PROMPT);
    } else if (board[parentIndex][subIndex]) {
      alert('格子已有落子');
    } else {
      const cloneArr = _.cloneDeep(board);
      cloneArr[parentIndex][subIndex] = currentChessPieces;
      setBoard(cloneArr);
      setCurrentChessPieces(
        currentChessPieces === FirstHandPiece ? BackhandPiece : FirstHandPiece,
      );
    }
  };

  const resetCheckerBoard = () => {
    setBoard([Array(3).fill(null), Array(3).fill(null), Array(3).fill(null)]);
  };

  return (
    <div>
      <button type="button" className="py-5" onClick={resetCheckerBoard}>
        重置棋盘
      </button>
      {board.map((parentItem, parentIndex) => {
        return (
          <div className="flex" key={parentIndex}>
            {parentItem.map((subItem, subIndex) => {
              return (
                <ChessPieces
                  value={subItem}
                  parentIndex={parentIndex}
                  index={subIndex}
                  key={subIndex}
                  clickCallBack={clickCallBack}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default TicTacToe;
