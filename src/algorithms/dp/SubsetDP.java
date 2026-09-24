package algorithms.dp;

import java.util.ArrayList;
import java.util.List;

public class SubsetDP {
    public static List<Integer> subsetSum(int[] nums, int target) {
        List<Integer> result = new ArrayList<>();
        if (nums == null || nums.length == 0) {
            return result;
        }

        boolean[][] dp = new boolean[nums.length + 1][target + 1];
        dp[0][0] = true;

        for (int i = 1; i <= nums.length; i++) {
            for (int sum = 0; sum <= target; sum++) {
                dp[i][sum] = dp[i - 1][sum];
                if (nums[i - 1] <= sum) {
                    dp[i][sum] = dp[i][sum] || dp[i - 1][sum - nums[i - 1]];
                }
            }
        }

        if (!dp[nums.length][target]) {
            return result;
        }

        int curr = target;
        for (int i = nums.length; i > 0; i--) {
            if (dp[i][curr]) {
                if (curr >= nums[i - 1] && dp[i - 1][curr - nums[i - 1]]) {
                    result.add(nums[i - 1]);
                    curr -= nums[i - 1];
                }
            }
        }
        return result;
    }

    public static List<String> explain() {
        List<String> steps = new ArrayList<>();
        steps.add("State: dp[i][s] = whether subset of first i numbers can sum to s");
        steps.add("Transition: dp[i][s] = dp[i-1][s] OR dp[i-1][s - nums[i-1]]");
        steps.add("Base case: dp[0][0] = true");
        steps.add("Time complexity: O(n * target)");
        steps.add("Space complexity: O(n * target)");
        return steps;
    }
}
