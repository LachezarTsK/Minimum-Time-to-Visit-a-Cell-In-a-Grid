
import java.util.Arrays;
import java.util.PriorityQueue;

public class Solution {

    private record Point(int row, int column) {}
    private record Step(int row, int column, int time) {}

    private static final int CAN_NOT_REACH_GOAL = -1;
    private static final int[][] moves = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};

    private int rows;
    private int columns;

    public int minimumTime(int[][] matrix) {
        rows = matrix.length;
        columns = matrix[0].length;

        Point start = new Point(0, 0);
        Point goal = new Point(rows - 1, columns - 1);

        return dijkstraSearchForMinTimeFromStartToGoal(matrix, start, goal);
    }

    private int dijkstraSearchForMinTimeFromStartToGoal(int[][] matrix, Point start, Point goal) {
        // If just one move is possible from the start, then the goal can be reached
        // with appropriate adjustments in the following moves. Otherwise, the goal can not be reached.
        if (notPossibleToMoveFromStart(matrix, start)) {
            return CAN_NOT_REACH_GOAL;
        }

        PriorityQueue<Step> minHeapForTime = new PriorityQueue<>((x, y) -> x.time - y.time);
        minHeapForTime.add(new Step(start.row, start.column, 0));

        int[][] minTime = createMinTimeMatrix();
        minTime[start.row][start.column] = 0;

        while (!minHeapForTime.isEmpty()) {

            Step current = minHeapForTime.poll();
            if (current.row == goal.row && current.column == goal.column) {
                break;
            }

            for (int[] move : moves) {
                int nextRow = current.row + move[0];
                int nextColumn = current.column + move[1];

                if (isInMatrix(nextRow, nextColumn)) {
                    int newTime = calculateNewTime(current.time, matrix[nextRow][nextColumn]);

                    if (newTime < minTime[nextRow][nextColumn]) {
                        minHeapForTime.add(new Step(nextRow, nextColumn, newTime));
                        minTime[nextRow][nextColumn] = newTime;
                    }
                }
            }
        }

        return minTime[goal.row][goal.column];
    }

    private boolean notPossibleToMoveFromStart(int[][] matrix, Point start) {
        for (int[] move : moves) {
            int nextRow = start.row + move[0];
            int nextColumn = start.column + move[1];
            if (isInMatrix(nextRow, nextColumn) && matrix[start.row][start.column] + 1 >= matrix[nextRow][nextColumn]) {
                return false;
            }
        }
        return true;
    }

    private int[][] createMinTimeMatrix() {
        int[][] minTime = new int[rows][columns];
        for (int r = 0; r < rows; ++r) {
            Arrays.fill(minTime[r], Integer.MAX_VALUE);
        }
        return minTime;
    }

    private int calculateNewTime(int currentTime, int matrixTime) {
        return currentTime + 1 >= matrixTime
                ? currentTime + 1
                : matrixTime + (matrixTime - currentTime + 1) % 2;
    }

    private boolean isInMatrix(int row, int column) {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }
}
