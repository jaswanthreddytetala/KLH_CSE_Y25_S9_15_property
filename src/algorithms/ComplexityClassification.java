package algorithms;

import java.util.ArrayList;
import java.util.List;

public class ComplexityClassification {
    public static List<String> classify(String problemType) {
        List<String> result = new ArrayList<>();
        if (problemType == null) {
            return result;
        }

        switch (problemType.toLowerCase()) {
            case "pattern search":
                result.add("Problem class: substring search");
                result.add("Suitable algorithm: KMP / Z / Rabin-Karp");
                result.add("Complexity: O(n + m)");
                break;
            case "sequence alignment":
                result.add("Problem class: dynamic programming");
                result.add("Suitable algorithm: edit-distance / DP");
                result.add("Complexity: O(mn)");
                break;
            case "network flow":
                result.add("Problem class: flow optimization");
                result.add("Suitable algorithm: Edmonds-Karp / Dinic");
                result.add("Complexity: O(VE^2) / O(V^2 E)");
                break;
            case "np-hard scheduling":
                result.add("Problem class: NP-hard optimization");
                result.add("Suitable algorithm: approximation / heuristic");
                result.add("Complexity: NP-hard");
                break;
            default:
                result.add("Unknown problem type");
                break;
        }
        return result;
    }
}
