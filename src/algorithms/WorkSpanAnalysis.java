package algorithms;

public class WorkSpanAnalysis {
    public static double parallelism(double work, double span) {
        if (span == 0) {
            return 0.0;
        }
        return work / span;
    }
}
