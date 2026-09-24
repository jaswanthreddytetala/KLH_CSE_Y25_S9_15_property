package algorithms;

import java.util.List;

public class Dinic {
    public static int maxFlow(int[][] graph, int source, int sink) {
        return algorithms.flow.Dinic.maxFlow(graph, source, sink);
    }

    public static List<String> explain() {
        return algorithms.flow.Dinic.explain();
    }
}
