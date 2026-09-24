package algorithms.flow;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Queue;

public class Dinic {
    public static int maxFlow(int[][] graph, int source, int sink) {
        if (graph == null || graph.length == 0) {
            return 0;
        }

        int n = graph.length;
        int[][] residual = new int[n][n];
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                residual[i][j] = graph[i][j];
            }
        }

        int[] level = new int[n];
        int[] nextEdge = new int[n];
        int maxFlow = 0;

        while (bfs(residual, source, sink, level)) {
            Arrays.fill(nextEdge, 0);
            while (true) {
                int pushed = dfs(residual, source, sink, level, nextEdge, Integer.MAX_VALUE);
                if (pushed == 0) {
                    break;
                }
                maxFlow += pushed;
            }
        }

        return maxFlow;
    }

    private static boolean bfs(int[][] residual, int source, int sink, int[] level) {
        Arrays.fill(level, -1);
        level[source] = 0;
        Queue<Integer> queue = new ArrayDeque<>();
        queue.add(source);

        while (!queue.isEmpty()) {
            int u = queue.poll();
            for (int v = 0; v < residual.length; v++) {
                if (residual[u][v] > 0 && level[v] < 0) {
                    level[v] = level[u] + 1;
                    queue.add(v);
                }
            }
        }

        return level[sink] >= 0;
    }

    private static int dfs(int[][] residual, int u, int sink, int[] level, int[] nextEdge, int flow) {
        if (u == sink) {
            return flow;
        }

        for (int v = nextEdge[u]; v < residual.length; v++, nextEdge[u]++) {
            if (residual[u][v] > 0 && level[v] == level[u] + 1) {
                int pushed = dfs(residual, v, sink, level, nextEdge, Math.min(flow, residual[u][v]));
                if (pushed > 0) {
                    residual[u][v] -= pushed;
                    residual[v][u] += pushed;
                    return pushed;
                }
            }
        }

        return 0;
    }

    public static List<String> explain() {
        List<String> steps = new ArrayList<>();
        steps.add("Phase 1: BFS builds the level graph");
        steps.add("Phase 2: DFS sends blocking flow along level graph");
        steps.add("Repeat until no augmenting path exists");
        steps.add("Max flow = min cut capacity");
        steps.add("Time complexity: O(V^2 * E)");
        steps.add("Space complexity: O(V^2)");
        return steps;
    }
}
