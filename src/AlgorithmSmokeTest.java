import java.util.ArrayList;
import java.util.Arrays;

import algorithms.*;

public class AlgorithmSmokeTest {
    public static void main(String[] args) {
        check("StrategySelection", ComplexityClassification.classify("pattern search").size() >= 3);
        check("KMP", algorithms.string.KMPAlgorithm.search("abcabcabc", "abc").size() == 3);
        check("Z", algorithms.string.ZAlgorithm.findMatches("banana", "ana").size() == 2);
        check("RabinKarp", algorithms.string.RabinKarp.search("abcabc", "bc", 3, 101).size() == 2);
        check("SuffixArray", algorithms.string.SuffixArray.build("banana").size() == 6);
        check("LCPArray", algorithms.string.LCPArray.build("banana", algorithms.string.SuffixArray.build("banana")).size() == 6);
        check("SuffixAutomaton", algorithms.SuffixAutomaton.contains("banana", "ana"));

        check("IntervalDP", algorithms.IntervalDP.matrixChainMultiplication(new int[]{10,20,30,40,30}) == 30000);
        check("BitmaskDP", algorithms.BitmaskDP.tsp(new int[][]{{0,10,15},{10,0,20},{15,20,0}}) == 45);
        check("TreeDP", algorithms.TreeDP.maximumIndependentSet(Arrays.asList(Arrays.asList(1,2), Arrays.asList(0,2), Arrays.asList(0,1))) == 2);
        check("SubsetDP", algorithms.SubsetDP.subsetSum(new int[]{3,34,4,12,5,2}, 9).size() == 3);

        check("EdmondsKarp", algorithms.EdmondsKarp.maxFlow(new int[][]{{0,3,2,0},{0,0,2,3},{0,0,0,2},{0,0,0,0}}, 0, 3) == 5);
        check("Dinic", algorithms.Dinic.maxFlow(new int[][]{{0,3,2,0},{0,0,2,3},{0,0,0,2},{0,0,0,0}}, 0, 3) == 5);
        check("MinimumCut", algorithms.MinimumCut.minCut(new int[][]{{0,3,2,0},{0,0,2,3},{0,0,0,2},{0,0,0,0}}, 0, 3) >= 0);

        check("ComplexityClassification", ComplexityClassification.classify("network flow").size() >= 3);
        check("ThreeSATToVertexCover", algorithms.ThreeSATToVertexCover.reduce("(x1 OR x2 OR x3) AND (¬x1 OR x2 OR x3)").size() == 5);
        check("VertexCover", algorithms.VertexCover.approximateCover(new int[][]{{0,1,0,1},{1,0,1,0},{0,1,0,1},{1,0,1,0}}).size() >= 2);
        check("Approximation", ApproximationAlgorithm.approximationRatio(6, 3) == 2.0);
        check("SchedulingApproximation", SchedulingApproximation.schedule(new int[]{5,7,3}, 2).size() >= 4);

        check("LasVegas", algorithms.LasVegasAlgorithm.sort(new ArrayList<>(Arrays.asList(5,1,3,2))).equals(Arrays.asList(1,2,3,5)));
        check("MonteCarlo", Math.abs(algorithms.MonteCarloAlgorithm.estimatePi(1000) - 3.14) < 1.0);
        check("PrefixSum", algorithms.ParallelPrefixSum.prefixSum(new int[]{1,2,3,4,5}).equals(Arrays.asList(1,3,6,10,15)));
        check("ParallelReduce", algorithms.ParallelReduce.reduce(new int[]{2,4,6,8}) == 20);
        check("WorkSpan", algorithms.WorkSpanAnalysis.parallelism(100, 25) == 4.0);

        System.out.println("ALL CO1-CO6 TESTS PASSED");
    }

    private static void check(String name, boolean condition) {
        if (!condition) {
            throw new IllegalStateException("Assertion failed: " + name);
        }
        System.out.println("PASS: " + name);
    }
}
