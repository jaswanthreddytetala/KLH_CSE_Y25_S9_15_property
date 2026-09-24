package algorithms;

import java.util.ArrayList;
import java.util.List;

public class VertexCover {
    public static List<Integer> approximateCover(int[][] graph) {
        List<Integer> cover = new ArrayList<>();
        boolean[] visited = new boolean[graph.length];
        for (int i = 0; i < graph.length; i++) {
            for (int j = i + 1; j < graph.length; j++) {
                if (graph[i][j] == 1 && !visited[i] && !visited[j]) {
                    cover.add(i);
                    cover.add(j);
                    visited[i] = true;
                    visited[j] = true;
                }
            }
        }
        return cover;
    }
}
