package algorithms.dp;

import java.util.ArrayList;
import java.util.List;

public class IntervalDP {
    public static int matrixChainMultiplication(int[] dims) {
        if (dims == null || dims.length < 2) {
            return 0;
        }

        int n = dims.length - 1;
        int[][] dp = new int[n][n];
        int[][] split = new int[n][n];

        for (int len = 2; len <= n; len++) {
            for (int i = 0; i + len - 1 < n; i++) {
                int j = i + len - 1;
                dp[i][j] = Integer.MAX_VALUE;
                for (int k = i; k < j; k++) {
                    int cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];
                    if (cost < dp[i][j]) {
                        dp[i][j] = cost;
                        split[i][j] = k;
                    }
                }
            }
        }

        return dp[0][n - 1];
    }

    public static List<String> explain(int[] dims) {
        List<String> steps = new ArrayList<>();
        steps.add("State: dp[i][j] = minimum cost to multiply matrices from i to j");
        steps.add("Recurrence: dp[i][j] = min over k of dp[i][k] + dp[k+1][j] + dims[i]*dims[k+1]*dims[j+1]");
        steps.add("Base case: dp[i][i] = 0");
        steps.add("Time complexity: O(n^3)");
        steps.add("Space complexity: O(n^2)");
        return steps;
    }
}
