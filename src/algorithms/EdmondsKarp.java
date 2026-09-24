package algorithms;

import java.util.List;

public class EdmondsKarp {
    public static int maxFlow(int[][] capacity, int source, int sink) {
        return algorithms.flow.EdmondsKarp.maxFlow(capacity, source, sink);
    }

    public static List<String> explain() {
        return algorithms.flow.EdmondsKarp.explain();
    }
}
