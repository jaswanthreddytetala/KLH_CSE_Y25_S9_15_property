package algorithms.flow;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Queue;

public class EdmondsKarp {
    public static int maxFlow(int[][] capacity, int source, int sink) {
        if (capacity == null || capacity.length == 0) {
            return 0;
        }

        int n = capacity.length;
        int[][] residual = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                residual[i][j] = capacity[i][j];
            }
        }

        int maxFlow = 0;
        int[] parent = new int[n];
        while (true) {
            Arrays.fill(parent, -1);
            Queue<Integer> queue = new ArrayDeque<>();
            queue.add(source);
            parent[source] = source;
            while (!queue.isEmpty() && parent[sink] == -1) {
                int u = queue.poll();
                for (int v = 0; v < n; v++) {
                    if (parent[v] == -1 && residual[u][v] > 0) {
                        parent[v] = u;
                        queue.add(v);
                    }
                }
            }

            if (parent[sink] == -1) {
                break;
            }

            int pathFlow = Integer.MAX_VALUE;
            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                pathFlow = Math.min(pathFlow, residual[u][v]);
            }

            for (int v = sink; v != source; v = parent[v]) {
                int u = parent[v];
                residual[u][v] -= pathFlow;
                residual[v][u] += pathFlow;
            }
            maxFlow += pathFlow;
        }

        return maxFlow;
    }

    public static List<String> explain() {
        List<String> steps = new ArrayList<>();
        steps.add("Algorithm: Edmonds-Karp uses BFS to find augmenting paths");
        steps.add("Each path is chosen by shortest path length");
        steps.add("Bottleneck capacity determines flow increase");
        steps.add("Max flow = min cut capacity");
        steps.add("Time complexity: O(V * E^2)");
        steps.add("Space complexity: O(V^2)");
        return steps;
    }
}
