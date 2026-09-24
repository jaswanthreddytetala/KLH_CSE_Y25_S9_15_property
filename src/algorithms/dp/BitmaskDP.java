package algorithms.dp;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class BitmaskDP {
    public static int tsp(int[][] dist) {
        if (dist == null || dist.length == 0) {
            return 0;
        }

        int n = dist.length;
        int[][] dp = new int[1 << n][n];
        for (int i = 0; i < (1 << n); i++) {
            for (int j = 0; j < n; j++) {
                dp[i][j] = Integer.MAX_VALUE / 4;
            }
        }

        dp[1][0] = 0;
        for (int mask = 1; mask < (1 << n); mask++) {
            for (int j = 0; j < n; j++) {
                if ((mask & (1 << j)) == 0) continue;
                for (int k = 0; k < n; k++) {
                    if (k == j || (mask & (1 << k)) == 0) continue;
                    int prevMask = mask ^ (1 << j);
                    if (dp[prevMask][k] != Integer.MAX_VALUE / 4) {
                        dp[mask][j] = Math.min(dp[mask][j], dp[prevMask][k] + dist[k][j]);
                    }
                }
            }
        }

        int full = (1 << n) - 1;
        int best = Integer.MAX_VALUE / 4;
        for (int j = 1; j < n; j++) {
            best = Math.min(best, dp[full][j] + dist[j][0]);
        }
        return best;
    }

    public static List<String> explain() {
        List<String> steps = new ArrayList<>();
        steps.add("State: dp[mask][j] = minimum cost to visit set mask and end at city j");
        steps.add("Transition: dp[mask][j] = min over k of dp[mask without j][k] + dist[k][j]");
        steps.add("Base case: dp[1<<0][0] = 0");
        steps.add("Time complexity: O(n^2 * 2^n)");
        steps.add("Space complexity: O(n * 2^n)");
        return steps;
    }
}
