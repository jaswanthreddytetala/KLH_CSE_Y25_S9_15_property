package algorithms;

public class MinimumCut {
    public static int minCut(int[][] capacity, int source, int sink) {
        int maxFlow = algorithms.flow.EdmondsKarp.maxFlow(capacity, source, sink);
        int total = 0;
        for (int i = 0; i < capacity.length; i++) {
            total += capacity[source][i];
        }
        return Math.max(0, total - maxFlow);
    }
}
