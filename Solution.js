
/**
 * @param {number[][]} matrix
 * @return {number}
 */
var minimumTime = function (matrix) {
    this.CAN_NOT_REACH_GOAL = -1;
    this.moves = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    this.rows = matrix.length;
    this.columns = matrix[0].length;

    const start = new Point(0, 0);
    const goal = new Point(this.rows - 1, this.columns - 1);

    return dijkstraSearchForMinTimeFromStartToGoal(matrix, start, goal);
};

/**
 * @param {number[][]} matrix
 * @param {Point} start
 * @param {Point} goal
 * @return {number}
 */
function dijkstraSearchForMinTimeFromStartToGoal(matrix, start, goal) {
    // If just one move is possible from the start, then the goal can be reached
    // with appropriate adjustments in the following moves. Otherwise, the goal can not be reached.
    if (notPossibleToMoveFromStart(matrix, start)) {
        return this.CAN_NOT_REACH_GOAL;
    }

    // PriorityQueue<Step>
    const minHeapForTime = new MinPriorityQueue({compare: (x, y) => x.time - y.time});
    minHeapForTime.enqueue(new Step(start.row, start.column, 0));

    const minTime = createMinTimeMatrix();
    minTime[start.row][start.column] = 0;

    while (!minHeapForTime.isEmpty()) {

        const current = minHeapForTime.dequeue();
        if (current.row === goal.row && current.column === goal.column) {
            break;
        }

        for (let move of this.moves) {
            let nextRow = current.row + move[0];
            let nextColumn = current.column + move[1];

            if (isInMatrix(nextRow, nextColumn)) {
                let newTime = calculateNewTime(current.time, matrix[nextRow][nextColumn]);

                if (newTime < minTime[nextRow][nextColumn]) {
                    minHeapForTime.enqueue(new Step(nextRow, nextColumn, newTime));
                    minTime[nextRow][nextColumn] = newTime;
                }
            }
        }
    }

    return minTime[goal.row][goal.column];
}

/**
 * @param {number[][]} matrix
 * @param {Point} start
 * @return {boolean}
 */
function notPossibleToMoveFromStart(matrix, start) {
    for (let move of this.moves) {
        let nextRow = start.row + move[0];
        let nextColumn = start.column + move[1];
        if (isInMatrix(nextRow, nextColumn) && matrix[start.row][start.column] + 1 >= matrix[nextRow][nextColumn]) {
            return false;
        }
    }
    return true;
}

/**
 * @param {number} row
 * @param {number} column
 */
function Point(row, column) {
    this.row = row;
    this.column = column;
}

/**
 * @param {number} row
 * @param {number} column
 * @param {number} time
 */
function Step(row, column, time) {
    this.row = row;
    this.column = column;
    this.time = time;
}

/**
 * @return {number[][]}
 */
function createMinTimeMatrix() {
    return Array.from(new Array(this.rows), () => new Array(this.columns).fill(Number.MAX_SAFE_INTEGER));
}

/**
 * @param {number} currentTime
 * @param {number} matrixTime
 * @return {number}
 */
function calculateNewTime(currentTime, matrixTime) {
    return currentTime + 1 >= matrixTime
            ? currentTime + 1
            : matrixTime + (matrixTime - currentTime + 1) % 2;
}

/**
 * @param {number} row
 * @param {number} column
 * @return {boolean}
 */
function isInMatrix(row, column) {
    return row >= 0 && row < this.rows && column >= 0 && column < this.columns;
}
