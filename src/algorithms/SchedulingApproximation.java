package algorithms;

import java.util.ArrayList;
import java.util.List;

public class SchedulingApproximation {
    public static List<String> schedule(int[] jobs, int machines) {
        List<String> schedule = new ArrayList<>();
        int current = 0;
        for (int i = 0; i < jobs.length; i++) {
            schedule.add("Machine " + (i % machines) + " gets job " + jobs[i]);
            current += jobs[i];
        }
        schedule.add("Makespan estimate: " + current);
        return schedule;
    }
}
