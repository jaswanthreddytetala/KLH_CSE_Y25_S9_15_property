package algorithms.complexity;

public class ReductionDemo {
    public static String describe3SatToVertexCover() {
        return "3-SAT formula -> construct a graph with a variable gadget per literal and clause gadget per clause. " +
               "A satisfying assignment corresponds to selecting a vertex cover of size related to the clause constraints.";
    }
}
