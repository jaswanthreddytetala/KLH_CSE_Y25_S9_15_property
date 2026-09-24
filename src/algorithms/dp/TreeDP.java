package algorithms.dp;

import java.util.ArrayList;
import java.util.List;

public class TreeDP {
    public static int maximumIndependentSet(List<List<Integer>> graph) {
        if (graph == null || graph.isEmpty()) {
            return 0;
        }

        int n = graph.size();
        int[] include = new int[n];
        int[] exclude = new int[n];

        for (int i = n - 1; i >= 0; i--) {
            include[i] = 1;
            for (int neighbor : graph.get(i)) {
                if (neighbor != i) {
                    include[i] += exclude[neighbor];
                }
            }
            exclude[i] = 0;
            for (int neighbor : graph.get(i)) {
                if (neighbor != i) {
                    exclude[i] += Math.max(include[neighbor], exclude[neighbor]);
                }
            }
        }

        return Math.max(include[0], exclude[0]);
    }

    public static List<String> explain() {
        List<String> steps = new ArrayList<>();
        steps.add("State: include[u] = best solution if u is chosen");
        steps.add("State: exclude[u] = best solution if u is not chosen");
        steps.add("Transition: include[u] = 1 + sum(exclude[v]) for neighbors v");
        steps.add("Transition: exclude[u] = sum(max(include[v], exclude[v]))");
        steps.add("Time complexity: O(n)") ;
        steps.add("Space complexity: O(n)");
        return steps;
    }
}
