package algorithms;

import java.util.ArrayList;
import java.util.List;

public class ThreeSATToVertexCover {
    public static List<String> reduce(String formula) {
        List<String> steps = new ArrayList<>();
        steps.add("3-SAT formula: " + formula);
        steps.add("Reduction: each clause contributes a gadget, each literal becomes a variable node");
        steps.add("Construct graph: variable nodes and clause nodes connected to encode satisfiability");
        steps.add("Vertex cover corresponds to selecting enough vertices to cover every clause edge");
        steps.add("Educational reduction demonstration: NP-hardness of Vertex Cover follows from 3-SAT reduction");
        return steps;
    }
}
