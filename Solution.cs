
using System;
using System.Collections.Generic;

public class Solution
{
    private record Point (int row, int column) {}
    private record Step(int row, int column, int time) {}

    private static readonly int CAN_NOT_REACH_GOAL = -1;
    private static readonly int[][] moves = new int[4][]
    { new int[] {-1, 0}, new int[]{1, 0}, new int[]{0, -1}, new int[]{0, 1} };

    private int rows;
    private int columns;

    public int MinimumTime(int[][] matrix)
    {
        rows = matrix.Length;
        columns = matrix[0].Length;

        Point start = new Point(0, 0);
        Point goal = new Point(rows - 1, columns - 1);

        return DijkstraSearchForMinTimeFromStartToGoal(matrix, start, goal);
    }

    private int DijkstraSearchForMinTimeFromStartToGoal(int[][] matrix, Point start, Point goal)
    {
        // If just one move is possible from the start, then the goal can be reached
        // with appropriate adjustments in the following moves. Otherwise, the goal can not be reached.
        if (NotPossibleToMoveFromStart(matrix, start))
        {
            return CAN_NOT_REACH_GOAL;
        }

        Comparer<int> comparator = Comparer<int>.Create((x, y) => x.CompareTo(y));
        PriorityQueue<Step, int> minHeapForTime = new PriorityQueue<Step, int>(comparator);
        minHeapForTime.Enqueue(new Step(start.row, start.column, 0), 0);

        int[][] minTime = CreateMinTimeMatrix();
        minTime[start.row][start.column] = 0;

        while (minHeapForTime.Count > 0)
        {
            Step current = minHeapForTime.Dequeue();
            if (current.row == goal.row && current.column == goal.column)
            {
                break;
            }

            foreach (int[] move in moves)
            {
                int nextRow = current.row + move[0];
                int nextColumn = current.column + move[1];

                if (IsInMatrix(nextRow, nextColumn))
                {
                    int newTime = CalculateNewTime(current.time, matrix[nextRow][nextColumn]);

                    if (newTime < minTime[nextRow][nextColumn])
                    {
                        minHeapForTime.Enqueue(new Step(nextRow, nextColumn, newTime), newTime);
                        minTime[nextRow][nextColumn] = newTime;
                    }
                }
            }
        }

        return minTime[goal.row][goal.column];
    }

    private bool NotPossibleToMoveFromStart(int[][] matrix, Point start)
    {
        foreach (int[] move in moves)
        {
            int nextRow = start.row + move[0];
            int nextColumn = start.column + move[1];
            if (IsInMatrix(nextRow, nextColumn) && matrix[start.row][start.column] + 1 >= matrix[nextRow][nextColumn])
            {
                return false;
            }
        }
        return true;
    }

    private int[][] CreateMinTimeMatrix()
    {
        int[][] minTime = new int[rows][];
        for (int r = 0; r < rows; ++r)
        {
            minTime[r] = new int[columns];
            Array.Fill(minTime[r], int.MaxValue);
        }
        return minTime;
    }

    private int CalculateNewTime(int currentTime, int matrixTime)
    {
        return currentTime + 1 >= matrixTime
                ? currentTime + 1
                : matrixTime + (matrixTime - currentTime + 1) % 2;
    }

    private bool IsInMatrix(int row, int column)
    {
        return row >= 0 && row < rows && column >= 0 && column < columns;
    }
}
