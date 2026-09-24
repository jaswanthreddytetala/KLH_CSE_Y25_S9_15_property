package algorithms.complexity;

import java.util.ArrayList;
import java.util.List;

public class VertexCoverApproximation {
    public static List<Integer> approximate(int[][] graph) {
        List<Integer> cover = new ArrayList<>();
        if (graph == null || graph.length == 0) {
            return cover;
        }

        boolean[] used = new boolean[graph.length];
        for (int i = 0; i < graph.length; i++) {
            for (int j = i + 1; j < graph.length; j++) {
                if (graph[i][j] == 1 && !used[i] && !used[j]) {
                    cover.add(i);
                    cover.add(j);
                    used[i] = true;
                    used[j] = true;
                }
            }
        }
        return cover;
    }

    public static List<String> explain() {
        List<String> steps = new ArrayList<>();
        steps.add("Select any uncovered edge (u, v)");
        steps.add("Add both endpoints to the cover");
        steps.add("Remove all edges incident to u or v");
        steps.add("Approximation ratio is at most 2x the optimum");
        steps.add("This is a classic approximation strategy for Vertex Cover");
        return steps;
    }
}
